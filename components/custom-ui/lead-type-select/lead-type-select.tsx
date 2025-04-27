import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { LeadType, LeadTypeMapper } from '@/types/enum';

const typeStyles: Record<LeadType, string> = {
  [LeadType.OPEN]: 'bg-[#FFE3CB] text-[#E06C06]',
  [LeadType.DEAD]: 'bg-[#FFD0D6] text-[#E22339]',
  [LeadType.INTERESTED]: 'bg-[#F8F6BC] text-[#A67B0A]',
  [LeadType.COURSE_UNAVAILABLE]: 'bg-[#CECECE] text-[#696969]',
  [LeadType.NO_CLARITY]: 'bg-[#C8E4FF] text-[#006ED8]',
  [LeadType.DID_NOT_PICK]: 'bg-[#F5F5F5] text-[#9E9E9E]',
  [LeadType.INVALID]: 'bg-black text-[#FFFFFF]'
};

interface LeadTypeSelectProps {
  value: LeadType;
  onChange: (value: LeadType) => void;
  isDisable?: boolean;
}

export default function LeadTypeSelect({
  value,
  onChange,
  isDisable = false
}: LeadTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDisable) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDisable]);

  return (
    <div className="relative w-[150px] mx-auto" ref={dropdownRef}>
      <button
        onClick={() => !isDisable && setIsOpen(!isOpen)}
        disabled={isDisable}
        className={`w-full flex items-center justify-between gap-2 rounded-[5px] text-sm font-medium px-3 py-1 ${typeStyles[value]} ${
          isDisable
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:opacity-90 hover:border-slate-500 border-1 border-transparent'
        }`}
      >
        <span className="truncate">{LeadTypeMapper[value]}</span>
        {!isDisable && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !isDisable && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-[5px] shadow-lg border border-gray-200 py-1">
          {Object.values(LeadType).map((type) => (
            <div
              key={type}
              onClick={() => {
                onChange(type);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between px-3 py-2 mx-1 rounded-[3px] text-sm font-medium cursor-pointer transition-colors hover:opacity-80 ${typeStyles[type]}`}
            >
              <span>{LeadTypeMapper[type]}</span>
              {value === type && <Check className="w-4 h-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
