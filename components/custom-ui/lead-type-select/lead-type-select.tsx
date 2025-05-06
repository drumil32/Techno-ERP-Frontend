import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownStyles, setDropdownStyles] = useState({
    top: 0,
    left: 0,
    width: 0,
    placeAbove: false
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 240;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placeAbove = spaceBelow < dropdownHeight;
      setDropdownStyles({
        top: placeAbove ? rect.top - dropdownHeight : rect.bottom,
        left: rect.left,
        width: rect.width,
        placeAbove
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isDisable) return;
    const close = (e: MouseEvent) => {
      if (!buttonRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isDisable]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => !isDisable && setIsOpen((o) => !o)}
        disabled={isDisable}
        className={`w-[150px] mx-auto flex items-center justify-between gap-2 rounded-[5px] text-sm font-medium px-3 py-1 ${typeStyles[value]} ${
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

      {isOpen &&
        createPortal(
          <div
            className="fixed z-50 bg-white rounded-[5px] shadow-lg border border-gray-200 py-1"
            style={{
              top: dropdownStyles.top,
              left: dropdownStyles.left,
              width: dropdownStyles.width
            }}
          >
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
          </div>,
          document.body
        )}
    </>
  );
}
