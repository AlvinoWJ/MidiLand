/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  parseCreateUlokEksternalFromFormData,
  requireFotoFile,
} from "@/lib/validation/ulok_eksternal";

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

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentExternalUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);
    const limit = Math.max(0, Math.min(100, Number(searchParams.get("limit") ?? 20)));
    const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));

    const { data: rawData, count, error } = await supabase
      .from("ulok_eksternal")
      .select("*", { count: "exact" })
      .eq("users_eksternal_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    let enrichedData: any[] = [];

    if (rawData && rawData.length > 0) {
      const ulokEksternalIds = rawData.map((d) => d.id);
      
      const existingPjIds = rawData
        .map((d) => d.penanggungjawab)
        .filter((id) => id !== null) as string[];
      const userMap: Record<string, { nama: string, no_telp: string | null }> = {};
      
      if (existingPjIds.length > 0) {
        const { data: users } = await supabase
          .from("users")
          .select("id, nama, no_telp")
          .in("id", existingPjIds);
        
        if (users) {
          users.forEach((u) => { 
              userMap[u.id] = { nama: u.nama, no_telp: u.no_telp }; 
          });
        }
      }

      const { data: activities } = await supabase
          .from("assignment_activities")
          .select(`
              external_location_id,
              assignments!inner (
                  users!inner ( nama, no_telp )
              )
          `)
          .in("external_location_id", ulokEksternalIds);
      
      const activityMap: Record<string, { nama: string, no_telp: string | null }> = {};
      if (activities) {
          activities.forEach((item: any) => {
              const u = item.assignments?.users;
              if (item.external_location_id && u?.nama) {
                  activityMap[item.external_location_id] = { nama: u.nama, no_telp: u.no_telp };
              }
          });
      }

      const { data: ulokInternal } = await supabase
        .from('ulok')
        .select('id, ulok_eksternal_id, approval_status')
        .in('ulok_eksternal_id', ulokEksternalIds);

      const ulokInternalMap: Record<string, string> = {}; 
      const internalUlokIds: string[] = [];

      if (ulokInternal) {
          ulokInternal.forEach(u => {
              internalUlokIds.push(u.id);
              if (u.approval_status) {
                  ulokInternalMap[u.ulok_eksternal_id] = u.approval_status;
              }
          });
      }

      const kpltMap: Record<string, string> = {}; 
      if (internalUlokIds.length > 0) {
          const { data: kpltData } = await supabase
            .from('kplt')
            .select('ulok_id, kplt_approval')
            .in('ulok_id', internalUlokIds);

          if (kpltData) {
             const ulokToKplt: Record<string, string> = {};
             kpltData.forEach(k => {
                 if(k.kplt_approval) ulokToKplt[k.ulok_id] = k.kplt_approval;
             });
             
             ulokInternal?.forEach(u => {
                 if (ulokToKplt[u.id]) {
                     kpltMap[u.ulok_eksternal_id] = ulokToKplt[u.id];
                 }
             });
          }
      }

      enrichedData = rawData.map(row => {
          let pjInfo = null;
          
          if (row.penanggungjawab && userMap[row.penanggungjawab]) {
              pjInfo = userMap[row.penanggungjawab];
          } 
          else if (activityMap[row.id]) {
              pjInfo = activityMap[row.id];
          }

          return {
              ...row,
              penanggungjawab_nama: pjInfo?.nama ?? null,
              penanggungjawab_telp: pjInfo?.no_telp ?? null,
              kplt_approval: kpltMap[row.id] || null,
              ulok_approval: ulokInternalMap[row.id] || null
          };
      });
    } else {
        enrichedData = [];
    }

    return NextResponse.json({ data: enrichedData, count, limit, offset });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e instanceof Error ? e.message : "Unknown error") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  let objectPath: string | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Gunakan multipart/form-data" },
        { status: 415 }
      );
    }

    const user = await getCurrentExternalUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const form = await req.formData();
    const body = parseCreateUlokEksternalFromFormData(form); 
    const incomingFile = requireFotoFile(form); 

    const id = crypto.randomUUID();
    const ts = Date.now();
    const originalName = incomingFile.name || "file";
    const fileName = `${ts}_${safeFileName(originalName)}`;
    objectPath = `${id}/ulok_eksternal/${fileName}`;

    const { error: upErr } = await supabase.storage
      .from("file_storage_eksternal")
      .upload(objectPath, incomingFile, {
        contentType: incomingFile.type || "application/octet-stream",
        upsert: false,
      });

    if (upErr) {
      objectPath = null;
      return NextResponse.json(
        { error: `Gagal upload file: ${upErr.message}` },
        { status: 400 }
      );
    }

    const insertRow = {
      id,
      users_eksternal_id: user.id,
      ...body,
      foto_lokasi: objectPath, 
    };

    const { data, error } = await supabase
      .from("ulok_eksternal")
      .insert(insertRow)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const { error: notifError } = await supabase
      .from("notifications_midiland")
      .insert({
        user_id: user.id,
        ulok_eksternal_id: data.id,
        title: "Usulan Berhasil Disimpan",
        body: `Properti baru di ${
          body.kabupaten || "lokasi baru"
        }, ${body.provinsi || ""} telah dikirim.`,
        type: "Usulan",
      });

    if (notifError) {
      throw new Error(
        `Gagal membuat notifikasi: ${notifError.message}`
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e: unknown) {
    if (objectPath) {
      await supabase.storage
        .from("file_storage_eksternal")
        .remove([objectPath])
        .catch((err) =>
          console.error("Gagal melakukan rollback file:", err)
        );
    }

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
