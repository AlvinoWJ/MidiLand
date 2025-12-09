import { UlokEksternal, TimelineStep } from '@/lib/types/ulok-eksternal';

export const formatDateIndo = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const isDate = dateString.includes('T') && dateString.includes('-');
  if (!isDate) return dateString; 
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('id-ID', {
      weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
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
        details: formatDateIndo(property.created_at)
    });

    let surveyStatus: TimelineStep['status'] = 'pending';
    let surveyDetails = "Menunggu antrian survey";
    
    const surveyDateText = property.survey_assigned_at 
        ? `\n${formatDateIndo(property.survey_assigned_at)}` 
        : '';

    if (status === 'Draft') {
        surveyStatus = 'pending'; surveyDetails = "Menunggu kelengkapan data";
    } else if (status === 'In Progress') {
        surveyStatus = 'in-progress';
        if (property.penanggungjawab_nama) {
            let details = `Surveyor : ${property.penanggungjawab_nama}`;
            if (property.penanggungjawab_telp) details += `\nNomor Telpon : ${property.penanggungjawab_telp}`;
            surveyDetails = details + surveyDateText;
        } else { surveyDetails = "Sedang dalam proses survey lapangan" + surveyDateText; }
    } else if (status === 'OK') {
        surveyStatus = 'completed';
        if (property.penanggungjawab_nama) {
             let details = `Surveyor : ${property.penanggungjawab_nama}`;
             if (property.penanggungjawab_telp) details += `\nNomor Telpon : ${property.penanggungjawab_telp}`;
             surveyDetails = details + surveyDateText;
        } else { surveyDetails = "Survey lapangan selesai" + surveyDateText; }
    } else if (status === 'Rejected') {
        surveyStatus = 'completed'; 
        surveyDetails = "Survey selesai (Tidak Lolos)" + surveyDateText;
    }
    timeline.push({ step: "Pengecekan Awal (Survey)", status: surveyStatus, details: surveyDetails });
    
    let internalStatus: TimelineStep['status'] = 'pending';
    let internalDetails = "Menunggu hasil survey lapangan";
    const ulokApp = property.ulok_approval?.toLowerCase() || '';
    
    const internalDateText = property.internal_reviewed_at 
        ? `\n${formatDateIndo(property.internal_reviewed_at)}` 
        : '';

    if (status === 'OK' || ulokApp) {
        if (['approved', 'disetujui', 'ok', 'acc'].includes(ulokApp)) {
            internalStatus = 'completed'; 
            internalDetails = "Lolos verifikasi internal, lanjut ke KPLT" + internalDateText;
        } else if (['nok', 'rejected', 'tolak', 'tidak'].includes(ulokApp)) {
            internalStatus = 'completed'; 
            internalDetails = `Pengajuan Ditolak pada verifikasi Tahap 2 (${property.ulok_approval})` + internalDateText;
        } else {
            internalStatus = 'in-progress'; 
            internalDetails = "Sedang diverifikasi oleh Tim Internal";
        }
    } else if (status === 'Rejected') {
         internalStatus = 'pending'; internalDetails = "-";
    }
    timeline.push({ step: "Pengecekan Tahap 2", status: internalStatus, details: internalDetails });

    let approvalStatus: TimelineStep['status'] = 'pending';
    let approvalDetails = "Menunggu keputusan manajemen (GM/KPLT)";
    const kpltStatus = property.kplt_approval ? property.kplt_approval.toLowerCase() : '';

    let finalDate = property.kplt_approved_at || property.approved_at;
    if (!finalDate && (status === 'Rejected' || ['nok', 'rejected', 'tolak'].includes(ulokApp))) {
        finalDate = property.updated_at;
    }

    if (kpltStatus) {
        if (['approved', 'disetujui', 'ok'].includes(kpltStatus)) {
            approvalStatus = 'completed';
            approvalDetails = `Disetujui oleh KPLT / GM\n${formatDateIndo(finalDate)}`;
        } 
        else if (kpltStatus.includes('reject') || kpltStatus.includes('tolak') || kpltStatus.includes('nok')) {
            approvalStatus = 'completed'; 
            approvalDetails = `Ditolak (KPLT)\n${formatDateIndo(finalDate)}`;
        }
        else {
            approvalStatus = 'in-progress';
            approvalDetails = `Sedang dalam proses review KPLT (${property.kplt_approval})`;
        }
    } else {
        if (status === 'Rejected' || ['nok', 'rejected', 'tolak', 'tidak'].includes(ulokApp)) {
            approvalStatus = 'completed';
            approvalDetails = "Pengajuan Properti Ditolak & Proses Dihentikan"; 
            if (finalDate) approvalDetails += `\n${formatDateIndo(finalDate)}`;
        } else if (internalStatus === 'completed' && !['nok', 'rejected'].includes(ulokApp)) {
             approvalStatus = 'in-progress';
             approvalDetails = "Menunggu Rapat Internal";
        }
    }

    timeline.push({ step: "Status Properti", status: approvalStatus, details: approvalDetails });

    return timeline;
};
