import React from 'react';
import { Briefcase, CheckCircle, Clock, MinusCircle, XCircle } from 'lucide-react';
import { UlokEksternal, TimelineStep } from '@/lib/types/ulok-eksternal';
import { generateTimeline, formatDateIndo } from '@/lib/utils/timeline-logic';

interface TimelineStatusProps {
    property: UlokEksternal | null;
    assetName: string | undefined;
}

export const TimelineStatus: React.FC<TimelineStatusProps> = ({ property, assetName }) => {
    if (!property) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <Briefcase className="w-6 h-6 text-rose-500" />
            </div>
            <p className="font-semibold text-gray-700">Pilih Aset</p>
            <p className="text-sm text-gray-500 mt-1">Klik aset di sebelah kiri untuk melihat detail.</p>
        </div>
      );
    }
    const currentTimeline = generateTimeline(property);
    const getStatusClasses = (status: TimelineStep['status'], details: string = '') => {
        const isRejected = details.toLowerCase().includes('ditolak') || details.toLowerCase().includes('tidak disetujui');

        if (isRejected) {
             return { 
                Icon: XCircle, 
                bgColor: "bg-red-50", 
                borderColor: "border-red-200", 
                textColor: "text-red-800",
                iconColor: "text-red-500",
                ringColor: "ring-red-100"
            };
        }

        switch (status) {
            case 'completed':
                return { 
                    Icon: CheckCircle, 
                    bgColor: "bg-green-50", 
                    borderColor: "border-green-200", 
                    textColor: "text-green-800",
                    iconColor: "text-green-600",
                    ringColor: "ring-green-100"
                }; 
            case 'in-progress':
                return { 
                    Icon: Clock, 
                    bgColor: "bg-amber-50", 
                    borderColor: "border-amber-200", 
                    textColor: "text-amber-800",
                    iconColor: "text-amber-600",
                    ringColor: "ring-amber-100"
                }; 
            default:
                return { 
                    Icon: MinusCircle, 
                    bgColor: "bg-gray-50", 
                    borderColor: "border-gray-200", 
                    textColor: "text-gray-500",
                    iconColor: "text-gray-400",
                    ringColor: "ring-gray-100"
                };
        }
    };

    return (
        <div className="flow-root">
            <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-white rounded-xl border border-rose-100 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
                    Lokasi Dipilih :
                </p>
                <p className="text-sm font-bold text-gray-900 break-words leading-snug">
                    {assetName}
                </p>
            </div>
            <ul role="list" className="-mb-8">
                {currentTimeline.map((item, index) => {
                    const isLast = index === currentTimeline.length - 1;
                    const { Icon, bgColor, borderColor, textColor, iconColor, ringColor } = 
                        getStatusClasses(item.status, item.details);

                    return (
                        <li key={index}>
                            <div className="relative pb-8">
                                {!isLast && (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                )}
                                <div className="relative flex items-start space-x-3">
                                    <div className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-white ring-4 ${ringColor}`}>
                                        <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
                                    </div>
                                    <div className={`flex-1 min-w-0 rounded-lg border ${borderColor} ${bgColor} p-3 transition-all hover:shadow-sm`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className={`text-sm font-bold ${textColor}`}>
                                                {item.step}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium break-words whitespace-pre-line">
                                            {formatDateIndo(item.details)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
