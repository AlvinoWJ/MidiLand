"use client";

import { useState, useMemo, useRef } from "react";
import ContactCard from "./ContactCard";
import { Input } from "@/components/ui/input";
import { Search, X, MapPinned, ChevronLeft, ChevronRight } from "lucide-react";
import { contactData } from "../../lib/contacts/contact-data"; 

const ITEMS_PER_PAGE = 6;

export default function ContactSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return contactData.filter((contact) =>
      contact.branch.toLowerCase().includes(query) ||
      contact.name.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      contact.position.toLowerCase().includes(query) ||
      contact.address.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentContacts = filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (sectionRef.current) {
      const yOffset = -50; 
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY + yOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <section 
      id="contact-section" 
      ref={sectionRef} 
      className="relative bg-gray-50 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b pointer-events-none" />
      <div className="relative container mx-auto px-4 pt-12 md:pt-20 pb-16 max-w-6xl">
        <div className="text-center mb-8 md:mb-10 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Hubungi <span className="text-red-600">Tim Kami</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Temukan PIC lokasi terdekat untuk konsultasi mengenai kerjasama.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-6 md:mb-10 w-full">
          <div className="bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row items-center gap-4 h-auto md:h-20">
            <div className="relative flex-1 w-full h-14 md:h-full flex items-center min-w-0">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>

              <Input
                placeholder="Cari berdasarkan nama, cabang, atau kota..."
                className={`pl-14 h-full w-full border-0 bg-transparent focus-visible:ring-0 text-sm md:text-base placeholder:text-gray-400 rounded-full text-ellipsis overflow-hidden whitespace-nowrap shadow-none transition-all duration-200 ${
                  searchQuery ? "pr-12" : "pr-4"
                }`}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3 px-6 py-2 border-l border-gray-100 h-full">
              <div className="bg-red-50 p-2.5 rounded-xl">
                <MapPinned className="w-5 h-5 text-red-600" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Kontak</p>
                <p className="text-base font-bold text-gray-900">{filteredContacts.length} PIC</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full"> 
          {currentContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 content-start">
              {currentContacts.map((contact) => (
                <div key={contact.id} className="animate-fade-in">
                  <ContactCard {...contact} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState query={searchQuery} onReset={() => handleSearch("")} />
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 w-full flex justify-center animate-fade-in">
            <div className="bg-white px-2 py-2 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-1">
              
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center ${
                      currentPage === page
                        ? "bg-red-600 text-white shadow-md shadow-red-500/30 scale-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="w-full py-24 flex flex-col justify-center items-center text-center bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 animate-fade-in px-4">
      <div className="inline-flex justify-center items-center w-20 h-20 bg-red-50 rounded-full shadow-sm mb-6">
        <Search className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Pencarian tidak ditemukan</h3>
      
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Maaf, kami tidak dapat menemukan kontak dengan kata kunci &quot;<span className="text-red-600 font-semibold break-all">{query}</span>&quot;. Silakan coba kata kunci lain.
      </p>
      
      <button 
        onClick={onReset}
        className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors shadow-lg shadow-gray-200"
      >
        Reset Pencarian
      </button>
    </div>
  );
}
