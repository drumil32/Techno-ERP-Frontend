import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { FinalConversionStatus, FinalConversionStatusMapper } from '@/types/enum';

export const conversionStyles: Record<FinalConversionStatus, string> = {
  [FinalConversionStatus.NEUTRAL]: 'bg-[#C8E4FF] text-[#006ED8]',
  [FinalConversionStatus.ADMISSION]: 'bg-[#8CFF8C] text-[#0D6C0D]',
  [FinalConversionStatus.NOT_INTERESTED]: 'bg-red-100 text-red-700',
  [FinalConversionStatus.NO_FOOTFALL]: 'bg-yellow-100 text-orange-700'
};

interface FinalConversionSelectProps {
  value: FinalConversionStatus;
  onChange: (value: FinalConversionStatus) => void;
  isDisable?: boolean;
}

export default function FinalConversionSelect({
  value,
  onChange,
  isDisable = false
}: FinalConversionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    const handleWheel = (e: WheelEvent) => e.preventDefault();
    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = Object.values(FinalConversionStatus).length * 36 + 16;
      const spaceBelow = window.innerHeight - rect.bottom;

      setPosition({
        top: spaceBelow > dropdownHeight ? rect.bottom : rect.top - dropdownHeight,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isDisable) return;
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
  }, [isOpen, isDisable]);

  const handleOptionClick = (status: FinalConversionStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => !isDisable && setIsOpen(!isOpen)}
        disabled={isDisable}
        className={`w-[155px] mx-auto flex items-center justify-between gap-2 rounded-md text-sm font-medium px-3 py-1 ${conversionStyles[value]} ${
          isDisable
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:opacity-90 hover:border-slate-500 border border-transparent'
        }`}
      >
        <span className="truncate">{FinalConversionStatusMapper[value]}</span>
        {!isDisable && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[155px]"
            style={{
              top: position.top,
              left: position.left,
              width: position.width
            }}
          >
            {Object.values(FinalConversionStatus).map((status) => (
              <div
                key={status}
                onClick={() => handleOptionClick(status)}
                className={`flex items-center justify-between px-3 py-2 mx-1 rounded-md text-sm font-medium cursor-pointer hover:opacity-80 ${conversionStyles[status]}`}
              >
                <span>{FinalConversionStatusMapper[status]}</span>
                {value === status && <Check className="w-4 h-4" />}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
