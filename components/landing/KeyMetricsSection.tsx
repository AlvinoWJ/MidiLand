"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; 

interface LocationData {
  kabupaten: string;
}

export default function KeyMetricsSection() {
  const supabase = createClient();
  
  const [metrics, setMetrics] = useState({
    mitraCount: 0,
    citiesCount: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { count: totalUlok, error: ulokError } = await supabase
          .from('ulok_eksternal') 
          .select('*', { count: 'exact', head: true });

        if (ulokError) throw ulokError;

        const { data: locations, error: locError } = await supabase
          .from('ulok_eksternal')
          .select('kabupaten');

        if (locError) throw locError;

        const uniqueCities = new Set(
          (locations as unknown as LocationData[])?.map((item) => item.kabupaten)
        ).size;

        setMetrics({
          mitraCount: totalUlok || 0,
          citiesCount: uniqueCities || 0,
          isLoading: false
        });

      } catch (error) {
        console.error("Error fetching metrics:", error);
        setMetrics(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchMetrics();
  }, [supabase]);

  const formatNumber = (num: number) => {
    if (metrics.isLoading) return "..."; 
    
    if (num > 1000) {
        return Math.floor(num / 100) * 100 + "+"; 
    }
    return num + "+";
  };

  return (
    <div className="w-full bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 relative z-20 -mt-12 md:-mt-15 mb-16">
        <div className="bg-white rounded-2xl shadow-[1px_1px_6px_rgba(0,0,0,0.25)] p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              {formatNumber(metrics.mitraCount)}
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Mitra Property
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              18+
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Tahun Pengalaman
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              {formatNumber(metrics.citiesCount)}
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Kota/Kabupaten
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              20+
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Juta Pelanggan
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
