import React from 'react';
import { CheckCircle, Clock, XCircle, FileText, HelpCircle, Loader2 } from 'lucide-react';
import { UlokEksternal } from '@/lib/types/ulok-eksternal';

interface StatusBadgeProps {
    status: UlokEksternal['status_ulok_eksternal'];
    kplt_approval?: string | null;
    ulok_approval?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, kplt_approval, ulok_approval }) => {
  let colorClass = "bg-gray-100 text-gray-700";
  let text: string = status;
  let Icon = HelpCircle;

  const kplt = kplt_approval ? kplt_approval.toLowerCase() : '';
  const ulok = ulok_approval ? ulok_approval.toLowerCase() : '';

  const isRejected = 
      status === 'Rejected' || 
      kplt.includes('reject') || kplt.includes('tolak') || kplt.includes('nok') ||
      ulok.includes('reject') || ulok.includes('tolak') || ulok.includes('nok') || ulok.includes('tidak');

  if (isRejected) {
      colorClass = "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200";
      Icon = XCircle;
      
      if (kplt.includes('nok') || kplt.includes('reject')) text = "Ditolak (KPLT)";
      else if (ulok.includes('nok') || ulok.includes('reject')) text = "Ditolak (Internal)";
      else text = "Ditolak";
  }
  
  else if (['approved', 'disetujui', 'ok'].includes(kplt)) {
      colorClass = "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200";
      text = "Disetujui"; 
      Icon = CheckCircle;
  }

  else if (['approved', 'disetujui', 'ok', 'acc'].includes(ulok)) {
      colorClass = "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-200";
      text = "Menunggu Rapat Internal"; 
      Icon = Clock;
  }
  else if (status === 'OK') {
      colorClass = "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-200";
      text = "Proses Pengecekan Tahap 2";
      Icon = Loader2;
  }
  else if (status === 'In Progress') {
      colorClass = "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-200";
      text = "Proses Survey Lapangan";
      Icon = Loader2;
  }

  else if (status === 'Draft') {
      colorClass = "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg shadow-slate-200";
      text = "Draft";
      Icon = FileText;
  }

  else if (kplt && kplt.length > 0) {
      colorClass = "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-200";
      text = "Review KPLT";
      Icon = Clock;
  }

  else {
      text = status;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap ${colorClass}`}>
      <Icon className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${Icon === Loader2 ? 'animate-spin' : ''}`} />
      {text}
    </span>
  );
};
