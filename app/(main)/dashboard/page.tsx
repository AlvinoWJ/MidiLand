import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus, MapPin, XCircle, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/status/StatusBadge";

interface DatabaseProperty {
  id: string;
  alamat: string;
  status_ulok_eksternal: string;
  kabupaten: string | null;
  kecamatan: string | null;     
}

interface UserProperty {
  id: string;
  nama: string;
  alamat: string;
  kabupaten: string | null;
  kecamatan: string | null;
  status: string;
  kplt_approval: string | null;
  ulok_approval: string | null;
}

function PropertyCard({ property }: { property: UserProperty }) {
  const locationText = 
    property.kecamatan && property.kabupaten
      ? `${property.kecamatan}, ${property.kabupaten}`
      : property.alamat;
      
  const locationTitle = property.alamat;

  return (
    <Card className="group relative overflow-hidden border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 rounded-xl bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="relative p-6 flex flex-col gap-4">
        <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4">
          
          <div className="flex-1 min-w-0 w-full">
            <h3 
              className="text-lg font-semibold text-gray-900 mb-2 break-words group-hover:text-primary transition-colors" 
              title={property.nama}
            >
              {property.nama}
            </h3>
            
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed break-words" title={locationTitle}>
                {locationText}
              </p>
            </div>
          </div>
      
          <div className="self-start shrink-0 transition-transform group-hover:scale-105">
            <StatusBadge 
              status={property.status} 
              kplt_approval={property.kplt_approval} 
              ulok_approval={property.ulok_approval}
            />
          </div>
        </div>

        <div className="border-t border-gray-100" />

        <Link
          href={`/status?selected=${property.id}`}
          className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
        >
          <span>Lihat Detail</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Pengguna";

  let userProperties: UserProperty[] = [];
  let fetchError: string | null = null;

  if (user) {
    const { data, error } = await supabase
      .from("ulok_eksternal")
      .select("id, alamat, status_ulok_eksternal, kabupaten, kecamatan")
      .eq("users_eksternal_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error.message);
      fetchError = `Gagal memuat data properti: ${error.message}`;
    }

    if (data && data.length > 0) {
      const ulokEksternalIds = data.map((p) => p.id);
      
      const kpltMap: Record<string, string> = {};
      const ulokInternalMap: Record<string, string> = {};
      
      const { data: uloks } = await supabase
        .from('ulok')
        .select('id, ulok_eksternal_id, approval_status')
        .in('ulok_eksternal_id', ulokEksternalIds);
      
      if (uloks && uloks.length > 0) {
          const ulokIds: string[] = [];

          uloks.forEach(u => {
              ulokIds.push(u.id);
              if (u.approval_status) {
                  ulokInternalMap[u.ulok_eksternal_id] = u.approval_status;
              }
          });

          const { data: kplts } = await supabase
            .from('kplt')
            .select('ulok_id, kplt_approval')
            .in('ulok_id', ulokIds);
          
          if (kplts) {
              const ulokToKplt: Record<string, string> = {};
              kplts.forEach(k => { 
                if(k.kplt_approval) ulokToKplt[k.ulok_id] = k.kplt_approval; 
              });
              
              uloks.forEach(u => {
                  if (ulokToKplt[u.id]) {
                    kpltMap[u.ulok_eksternal_id] = ulokToKplt[u.id];
                  }
              });
          }
      }

      userProperties = data.map((prop: DatabaseProperty) => ({
        id: prop.id,
        nama: prop.alamat,
        alamat: prop.alamat,
        status: prop.status_ulok_eksternal,
        kabupaten: prop.kabupaten,
        kecamatan: prop.kecamatan,
        kplt_approval: kpltMap[prop.id] || null,
        ulok_approval: ulokInternalMap[prop.id] || null
      }));
    }
  } else {
    fetchError = "User tidak terautentikasi. Silakan login kembali.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5">
          <Image
            alt="Peta Indonesia Latar Belakang"
            src="/indonesia.png"
            fill
            className="object-cover"
            quality={75}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-12 py-10 lg:py-24">
            <div className="flex-1 flex flex-col text-center lg:text-left items-center lg:items-start max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 sm:mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Dashboard Properti
              </div>
              
              <h1 className="text-3xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
                Selamat Datang,
                <span className="block text-primary mt-2 text-2xl sm:text-2xl lg:text-4xl">
                  {userName}
                </span>
              </h1>
              
              <p className="text-xs sm:text-xl lg:text-sm text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-xl">
                Kelola semua properti yang telah Anda ajukan dengan mudah. Pantau status persetujuan dan kelola submission Anda dalam satu tempat.
              </p>
              
              <Button
                asChild
                className="group rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm sm:text-base px-18 py-4 sm:px-12 sm:py-6 lg:px-24 lg:py-5 transition-all duration-300"
              >
                <Link href="/input" className="flex items-center gap-3 sm:gap-4">
                  Ajukan Properti Baru
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end max-w-md lg:max-w-lg w-full">
              <div className="relative w-full">
                <Image
                  src="/alfamidi.svg"
                  alt="Ilustrasi Dashboard Properti"
                  width={500}
                  height={560}
                  priority
                  className="relative w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {fetchError && (
        <section className="w-full max-w-6xl mx-auto ">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Terjadi Kesalahan</h3>
                <p className="text-sm text-red-700">{fetchError}</p>
                <p className="text-xs text-red-600 mt-2">Pastikan user yang login adalah External User dengan ID yang terdaftar di kolom `users_eksternal_id` pada tabel `ulok_eksternal`.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto pb-12 px-4 sm:px-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Properti Anda
            </h2>
            <p className="text-gray-600">
              {userProperties.length} {userProperties.length === 1 ? 'properti' : 'properti'} yang telah diajukan
            </p>
          </div>
          
          {userProperties.length > 0 && (
            <Button
              asChild
              variant="outline"
              className="hidden sm:flex items-center gap-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Link href="/input">
                <Plus className="w-4 h-4" />
                Ajukan Baru
              </Link>
            </Button>
          )}
        </div>

        {userProperties.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors rounded-2xl bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Search className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Belum Ada Properti
              </h3>
              <p className="text-gray-600 mb-8 max-w-md">
                Anda belum mengajukan properti apapun. Mulai perjalanan Anda dengan mengajukan properti pertama sekarang!
              </p>
              
              <Button
                asChild
                size="lg"
                className="group rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 transition-all"
              >
                <Link href="/input" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Ajukan Properti Baru
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
