import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { LeadType, LeadTypeMapper } from '@/types/enum';

export const typeStyles: Record<LeadType, string> = {
  [LeadType.LEFT_OVER]: 'bg-[#FFC492] text-[#743D1B]',
  [LeadType.NOT_INTERESTED]: 'bg-[#FFA2AE] text-[#961322]',
  [LeadType.ACTIVE]: 'bg-[#FFD60A] text-[#685701]',
  [LeadType.COURSE_UNAVAILABLE]: 'bg-[#00B8B0] text-[#FFFFFF]',
  [LeadType.NEUTRAL]: 'bg-[#C8E4FF] text-[#006ED8]',
  [LeadType.DID_NOT_PICK]: 'bg-[#F2D0A6] text-[#6D5822]',
  [LeadType.INVALID]: 'bg-black text-[#FFFFFF]'
};

interface LeadTypeSelectProps {
  value: LeadType;
  onChange: (value: LeadType) => void;
  disabled?: boolean;
}

export default function LeadTypeSelect({ value, onChange, disabled = false }: LeadTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!isOpen) return;
    const handleWheel = (e: WheelEvent) => e.preventDefault();
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = Object.keys(LeadType).length * 36 + 16;
      const spaceBelow = window.innerHeight - rect.bottom;

      setPosition({
        top: spaceBelow > dropdownHeight ? rect.bottom : rect.top - dropdownHeight,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || disabled) return;
    const handleClick = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, disabled]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-[150px] mx-auto flex items-center justify-between gap-2 rounded-[5px] px-3 py-1 text-sm font-medium ${typeStyles[value]} ${
          disabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        <span className="truncate">{LeadTypeMapper[value]}</span>
        {!disabled && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-50 bg-white rounded-[5px] shadow-lg border border-gray-200 py-1"
            style={{ top: position.top, left: position.left, width: position.width }}
          >
            {Object.values(LeadType).map((type) => (
              <div
                key={type}
                onClick={() => {
                  onChange(type);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 mx-1 rounded-[3px] text-sm font-medium cursor-pointer hover:opacity-80 ${typeStyles[type]}`}
              >
                <span>{LeadTypeMapper[type]}</span>
                {value === type && <Check className="w-4 h-4" />}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
