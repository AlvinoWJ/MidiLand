/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseUpdateUlokEksternalFromFormData } from "@/lib/validation/ulok_eksternal";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getCurrentExternalUser() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return null;

  const { data: user, error } = await supabase
    .from("users_eksternal")
    .select("id")
    .eq("id", uid)
    .maybeSingle();

  if (error || !user) return null;
  return user;
}

function safeFileName(name: string) {
  const parts = name.split(".");
  const ext = parts.length > 1 ? "." + parts.pop() : "";
  const base = parts.join(".");
  const normalized = base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
  return (normalized || "file") + ext.toLowerCase();
}

async function ensureOwnedRow(
  supabase: SupabaseClient,
  id: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("ulok_eksternal")
    .select("*")
    .eq("id", id)
    .eq("users_eksternal_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return data as any;
}

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const user = await getCurrentExternalUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const row = await ensureOwnedRow(supabase, params.id, user.id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let pjNama: string | null = null;
    let pjNoTelp: string | null = null;
    let surveyAssignedAt: string | null = null;

    if (row.penanggungjawab) {
      const { data: pj } = await supabase
        .from("users")
        .select("nama, no_telp")
        .eq("id", row.penanggungjawab)
        .maybeSingle();

      if (pj) {
        pjNama = pj.nama ?? null;
        pjNoTelp = pj.no_telp ?? null;
        surveyAssignedAt = row.updated_at;
      }
    } 
    else {
      const { data: activity } = await supabase
        .from("assignment_activities")
        .select(`
            created_at,
            assignments!inner (
                users!inner ( nama, no_telp )
            )
        `)
        .eq("external_location_id", row.id)
        .maybeSingle();
      
      const u = (activity as any)?.assignments?.users;
      if (u) {
        pjNama = u.nama ?? null;
        pjNoTelp = u.no_telp ?? null;
        surveyAssignedAt = (activity as any)?.created_at ?? null;
      }
    }

    let kpltApproval: string | null = null;
    let kpltApprovedAt: string | null = null;
    let ulokApproval: string | null = null;
    let internalReviewedAt: string | null = null;
    const approvedAt: string | null = row.approved_at;

    const { data: uloks } = await supabase
      .from("ulok")
      .select("id, approval_status, updated_at")
      .eq("ulok_eksternal_id", row.id);

    if (uloks && uloks.length > 0) {
      const ulokIds = uloks.map((u) => u.id);

      if (uloks[0].approval_status) {
        ulokApproval = uloks[0].approval_status;
        internalReviewedAt = uloks[0].updated_at;
      }
      
      const { data: latestKplt } = await supabase
        .from("kplt")
        .select("kplt_approval, created_at")
        .in("ulok_id", ulokIds)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestKplt) {
        kpltApproval = latestKplt.kplt_approval ?? null;
        kpltApprovedAt = latestKplt.created_at ?? null;
      }
    }

    const enrichedData = {
      ...row,
      penanggungjawab_nama: pjNama,
      penanggungjawab_telp: pjNoTelp,
      survey_assigned_at: surveyAssignedAt,
      kplt_approval: kpltApproval,
      ulok_approval: ulokApproval,
      internal_reviewed_at: internalReviewedAt,
      kplt_approved_at: kpltApprovedAt, 
      approved_at: approvedAt,
    };

    return NextResponse.json(
      {
        success: true,
        ulok_eksternal: enrichedData,
      },
      { status: 200 }
    );

  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Gunakan multipart/form-data" },
        { status: 415 }
      );
    }

    const user = await getCurrentExternalUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const existing = await ensureOwnedRow(supabase, params.id, user.id);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const form = await req.formData();
    const patch = parseUpdateUlokEksternalFromFormData(form) as Record<
      string,
      unknown
    >;

    delete patch.status_ulok_eksternal;
    delete patch.branch_id;
    delete patch.penanggungjawab;
    delete patch.approved_at;
    delete patch.users_eksternal_id;
    delete patch.id;

    const newFile =
      (form.get("foto_lokasi") as File | null) ||
      (form.get("file") as File | null);

    let newPath: string | undefined;

    if (newFile) {
      const ts = Date.now();
      const fileName = `${ts}_${safeFileName(newFile.name || "file")}`;
      const objectPath = `${params.id}/ulok_eksternal/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from("file_storage_eksternal")
        .upload(objectPath, newFile, {
          contentType: newFile.type || "application/octet-stream",
          upsert: false,
        });

      if (upErr) {
        return NextResponse.json(
          { error: `Gagal upload file: ${upErr.message}` },
          { status: 400 }
        );
      }
      newPath = objectPath;
      patch.foto_lokasi = newPath;
    }

    patch.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("ulok_eksternal")
      .update(patch)
      .eq("id", params.id)
      .eq("users_eksternal_id", user.id)
      .select("*")
      .single();

    if (error) {
      if (newPath) {
        await supabase.storage
          .from("file_storage_eksternal")
          .remove([newPath])
          .catch(() => {});
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (newPath && existing?.foto_lokasi && existing.foto_lokasi !== newPath) {
      await supabase.storage
        .from("file_storage_eksternal")
        .remove([existing.foto_lokasi])
        .catch(() => {});
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const user = await getCurrentExternalUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const existing = await ensureOwnedRow(supabase, params.id, user.id);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { error } = await supabase
      .from("ulok_eksternal")
      .delete()
      .eq("id", params.id)
      .eq("users_eksternal_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    try {
      const prefix = `${params.id}/ulok_eksternal`;
      const { data: files, error: listErr } = await supabase.storage
        .from("file_storage_eksternal")
        .list(prefix, { limit: 1000 });

      if (!listErr && files && files.length > 0) {
        const paths = files.map((f: any) => `${prefix}/${f.name}`);
        await supabase.storage.from("file_storage_eksternal").remove(paths);
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
