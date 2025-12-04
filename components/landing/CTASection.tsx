"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="w-full h-auto md:h-64 bg-white rounded-3xl shadow-xl -mx-4 md:-mx-6 mb-16 relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
        <div className="relative z-10 flex flex-col justify-center px-6 py-8 md:p-12 md:pl-12 h-full order-2 md:order-1 
          items-center md:items-start text-center md:text-left">
          
          <h2 className="text-xl md:text-3xl font-bold text-red-700 mb-2 leading-tight">
            Siap Memulai Kerjasama?
          </h2>
          <p className="text-black mb-6 max-w-xl text-xs md:text-sm font-medium leading-snug">
            Bergabunglah dengan kami untuk menjadikan property menjadi peluang bisnis.
          </p>
          <Button
            size="lg"
            className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 font-bold px-6 py-2 h-10 rounded-full text-sm shadow-sm transition-all transform hover:scale-105 w-fit"
          >
            Ajukan Usulan Property
          </Button>
        </div>

        <div className="relative w-full h-52 md:h-full order-1 md:order-2">
          <Image 
            src="/cta.svg" 
            alt="Staff Alfamidi"
            fill
            className="object-cover object-center 
              [mask-image:linear-gradient(to_bottom,black_55%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent)]
              md:[mask-image:linear-gradient(to_left,black_60%,transparent)] md:[-webkit-mask-image:linear-gradient(to_left,black_60%,transparent)]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
