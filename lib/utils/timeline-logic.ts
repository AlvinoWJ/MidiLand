import { UlokEksternal, TimelineStep } from '@/lib/types/ulok-eksternal';

export const formatDateIndo = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const isDate = dateString.includes('T') && dateString.includes('-');
  
  if (!isDate) return dateString; 

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).replace(/\./g, ':');
  } catch {
    return dateString;
  }
};

export const generateTimeline = (property: UlokEksternal): TimelineStep[] => {
    const timeline: TimelineStep[] = [];
    const status = property.status_ulok_eksternal;
    timeline.push({
        step: "Pengajuan Lokasi",
        status: "completed",
        details: property.created_at 
    });

    let surveyStatus: TimelineStep['status'] = 'pending';
    let surveyDetails = "Menunggu antrian survey";

    if (status === 'Draft') {
        surveyStatus = 'pending';
        surveyDetails = "Menunggu kelengkapan data";
    } else if (status === 'In Progress') {
        surveyStatus = 'in-progress';
        
        if (property.penanggungjawab_nama) {
            let details = `Surveyor : ${property.penanggungjawab_nama}`;
            if (property.penanggungjawab_telp) {
                details += `\nNomor Telpon : ${property.penanggungjawab_telp}`;
            }
            surveyDetails = details;
        } else {
            surveyDetails = "Sedang dalam proses survey lapangan";
        }
    } else if (status === 'OK') {
        surveyStatus = 'completed';
        
        if (property.penanggungjawab_nama) {
             let details = `Surveyor : ${property.penanggungjawab_nama}`;
             if (property.penanggungjawab_telp) {
                details += `\nNomor Telpon : ${property.penanggungjawab_telp}`;
             }
             surveyDetails = details;
        } else {
             surveyDetails = "Survey lapangan selesai (Menunggu Approval KPLT)";
        }
    } else if (status === 'Rejected') {
        surveyStatus = 'completed'; 
        surveyDetails = "Survey selesai (Tidak Lolos)";
    }

    timeline.push({
        step: "Pengecekan Awal (Survey)",
        status: surveyStatus,
        details: surveyDetails
    });
    
    let approvalStatus: TimelineStep['status'] = 'pending';
    let approvalDetails = "Menunggu keputusan manajemen (GM/KPLT)";

    const kpltStatus = property.kplt_approval ? property.kplt_approval.toLowerCase() : '';

    if (kpltStatus) {
        if (['approved', 'disetujui', 'ok'].includes(kpltStatus)) {
            approvalStatus = 'completed';
            approvalDetails = property.approved_at || "Disetujui oleh KPLT / GM";
        } 
        else if (kpltStatus.includes('reject') || kpltStatus.includes('tolak') || kpltStatus.includes('nok')) {
            approvalStatus = 'pending';
            approvalDetails = `Mohon maaf, pengajuan Ditolak berdasarkan hasil KPLT (${property.kplt_approval})`;
        }
        else {
            approvalStatus = 'in-progress';
            approvalDetails = `Sedang dalam proses review KPLT (${property.kplt_approval})`;
        }
    } else {
        if (status === 'Rejected') {
            approvalStatus = 'pending'; 
            approvalDetails = "Pengajuan dihentikan / Ditolak";
        } else {
            approvalStatus = 'pending';
            approvalDetails = "Menunggu jadwal/hasil Rapat Internal";
        }
    }

    timeline.push({
        step: "Status Properti",
        status: approvalStatus,
        details: approvalDetails
    });

    return timeline;
};
