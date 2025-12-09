"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const carouselSlides = [
  {
    image: "/2.svg",
    alt: "Ilustrasi Kemitraan",
    title: "Kemitraan Terpercaya",
    description: "Bergabunglah dengan ribuan mitra terpercaya kami.",
  },
  {
    image: "/3.svg",
    alt: "Ilustrasi Peluang",
    title: "Peluang Menguntungkan",
    description: "Raih peluang bisnis yang menguntungkan bersama kami.",
  },
  {
    image: "/4.svg",
    alt: "Ilustrasi Proses",
    title: "Proses Mudah dan Cepat",
    description: "Proses pendaftaran yang sederhana dan cepat.",
  },
];


export default function CompleteProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_telp: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselSlides.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
        });

        if (res.status === 401) {
          router.replace("/auth/login");
          return;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Gagal memuat profil");
        }

        const data = await res.json();
        setForm({
          nama: data.nama || "",
          email: data.email || "",
          no_telp: data.no_telp || "",
          alamat: data.alamat || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Gagal memuat data pengguna");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          no_telp: form.no_telp,
          alamat: form.alamat,
        }),
      });

      if (res.status === 401) {
        toast.error("Sesi login tidak valid");
        router.replace("/auth/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Gagal menyimpan data profil");
      }

      toast.success("Profil berhasil dilengkapi!");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Gagal menyimpan data profil");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 animate-pulse">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <div className="relative flex w-full lg:w-1/2 flex-col items-center md:justify-center px-6 md:px-6 lg:px-10 bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full max-w-lg space-y-4 pt-8 md:pt-0">
          <div className="flex justify-center text-center lg:text-left mb-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Lengkapi Profil <span className="text-secondary">Midi</span>
              <span className="text-primary">Land</span>
            </h1>
          </div>
          <div className="flex justify-center mb-3">
            <Image
              src="/alfamidi.svg"
              alt="Header Gambar"
              width={350}
              height={250}
              className="object-contain"
              priority
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label
                htmlFor="nama"
                className="text-gray-900 font-medium text-sm"
              >
                Nama Lengkap
              </Label>
              <Input
                id="nama"
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-gray-900 font-medium text-sm"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="no_telp"
                className="text-gray-900 font-medium text-sm"
              >
                No. Telepon
              </Label>
              <Input
                id="no_telp"
                type="tel"
                name="no_telp"
                value={form.no_telp}
                onChange={handleChange}
                placeholder="Contoh: 08123456789"
                required
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="alamat"
                className="text-gray-900 font-medium text-sm"
              >
                Alamat
              </Label>
              <Textarea
                id="alamat"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                required
                className="border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-md mt-4"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan dan Lanjut"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/login.svg"
            alt="City Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 backdrop-blur-2xl bg-white/30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30"></div>
        </div>

        <div className="relative z-10 w-full h-full flex items-center justify-center p-14">
          <div className="w-full h-full rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/60 relative flex flex-col">
            <div className="absolute top-6 right-6 z-50">
              <div className="border border-white/50 rounded-xl p-2 bg-white/80 shadow-sm backdrop-blur-sm">
                <Image
                  src="/alfamidilogo.svg"
                  alt="Alfamidi Logo"
                  width={120}
                  height={35}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 h-full flex flex-col items-center px-4 lg:px-8 transition-opacity duration-500 ${
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center z-20 mb-4 mt-10 lg:mt-24 flex-none">
                    <h2
                      className={`text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-800 tracking-tight relative transition-all duration-700 ${
                        currentSlide === index
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.title}
                    </h2>

                    <p
                      className={`text-base lg:text-lg xl:text-xl text-gray-700 font-medium max-w-xl lg:max-w-2xl leading-relaxed mt-2 text-center transition-all duration-700 delay-100 ${
                        currentSlide === index
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.description}
                    </p>
                  </div>

                  <div
                    className={`relative w-full flex-1 z-10 transition-all duration-700 ease-out 
                    transform scale-110 lg:scale-110 xl:scale-[1.45] origin-bottom pb-10
                    ${
                      currentSlide === index
                        ? "opacity-100 rotate-0"
                        : "opacity-0 rotate-6"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[70px] animate-pulse opacity-50"></div>
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="object-contain object-bottom drop-shadow-2xl"
                      priority={index === 0}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/40 z-30">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-500 rounded-full ${
                    currentSlide === index
                      ? "w-8 h-2.5 bg-gradient-to-r from-primary to-secondary shadow-md"
                      : "w-2.5 h-2.5 bg-gray-400/70 hover:bg-gray-600 hover:scale-110"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
