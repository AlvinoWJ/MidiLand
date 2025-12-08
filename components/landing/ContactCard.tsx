import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, User, Briefcase, ExternalLink } from "lucide-react";

interface ContactCardProps {
  branch: string;
  name: string;
  phone: string;
  position: string;
  address: string;
}

export default function ContactCard({
  branch,
  name,
  phone,
  position,
  address,
}: ContactCardProps) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Halo ${name}, saya ingin menanyakan tentang MidiLand.`);
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    <Card className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 flex flex-col h-full min-h-[260px] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {branch}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:border-red-100 group-hover:bg-red-50 transition-colors duration-300">
            <User className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate">{name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{position}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6 flex-1">
          <div className="h-px w-full bg-gray-50" />

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Nomor Telepon</p>
              <p className="text-gray-700 font-semibold">{phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div className="min-w-0 w-full">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Alamat Kantor</p>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-white border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-bold h-12 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
          >
            <span className="flex items-center justify-center gap-2">
              Hubungi via WhatsApp
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
