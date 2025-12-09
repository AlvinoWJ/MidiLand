import React from 'react';
import { Home, Layers, Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { UlokEksternal } from '@/lib/types/ulok-eksternal';
import { StatusBadge } from './StatusBadge';
import { AssetDetailContent } from './AssetDetailContent';

interface AssetAccordionRowProps {
    property: UlokEksternal;
    isSelected: boolean; 
    onToggle: (id: string) => void;
    onAssetUpdate?: (updatedProperty: UlokEksternal) => void; 
}

export const AssetAccordionRow: React.FC<AssetAccordionRowProps> = ({ property, isSelected, onToggle, onAssetUpdate }) => {
    const { 
        id, kabupaten, provinsi, alamat, status_ulok_eksternal, 
        created_at, bentuk_objek, kplt_approval, ulok_approval 
    } = property;
    
    const handleUpdateSuccess = (updatedProperty: UlokEksternal) => {
        if (onAssetUpdate) {
            onAssetUpdate(updatedProperty);
        }
    };
    
    const getPropertyIcon = () => {
        switch(bentuk_objek) {
            case 'Ruko': return Building2;
            case 'Tanah': return Layers;
            case 'Gudang': return Home;
            default: return Building2;
        }
    };
    const PropertyIcon = getPropertyIcon();

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };
    
    return (
        <div 
            className={`
                rounded-2xl transition-all duration-300 overflow-hidden
                ${isSelected 
                    ? 'shadow-2xl border-2 border-rose-500 bg-white'
                    : 'shadow-md border-2 border-transparent bg-white hover:shadow-xl'
                }
            `}
        >
            <button
                onClick={() => onToggle(id)}
                className={`
                    w-full p-5 flex flex-col-reverse md:flex-row items-start md:items-start justify-between text-left transition-colors duration-200 focus:outline-none h-auto
                    ${isSelected ? 'bg-gradient-to-r from-rose-50 to-pink-50' : 'hover:bg-gray-50 bg-white'}
                `}
            >
                <div className="flex items-start space-x-4 min-w-0 flex-1 w-full mt-3 md:mt-0">
                    <div className={`
                        flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300 self-start
                        ${isSelected ? 'bg-gradient-to-br from-rose-500 to-pink-600' : 'bg-gradient-to-br from-gray-600 to-slate-700'}
                    `}>
                        <PropertyIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="hidden md:flex mb-2 h-8 items-center">
                            <StatusBadge 
                                status={status_ulok_eksternal} 
                                kplt_approval={kplt_approval} 
                                ulok_approval={ulok_approval}
                            />
                        </div>

                        <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500 font-medium">
                                {formatDateTime(created_at)}
                            </p>
                        </div>
                        <p className="text-base font-bold text-gray-800 break-all whitespace-normal leading-tight mb-1">
                            {alamat}
                        </p>
                        <p className="text-sm text-gray-600 break-words whitespace-normal leading-tight">
                            {kabupaten}, {provinsi}
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end md:ml-4 self-start">
                    <div className="md:hidden">
                        <StatusBadge 
                            status={status_ulok_eksternal} 
                            kplt_approval={kplt_approval} 
                            ulok_approval={ulok_approval}
                        />
                    </div>
                    <div className={`p-1.5 rounded-full transition-colors ${isSelected ? 'bg-rose-100' : 'bg-gray-100'}`}>
                        {isSelected ? <ChevronUp className="w-5 h-5 text-rose-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                    </div>
                </div>
            </button>
            
            {isSelected && <div className="h-[4px] w-full bg-rose-500" />}
            
            <div className={`
                transition-all duration-500 ease-in-out 
                ${isSelected ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <AssetDetailContent 
                    property={property} 
                    onUpdateSuccess={handleUpdateSuccess} 
                />
            </div>
        </div>
    );
};
