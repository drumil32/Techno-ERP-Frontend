import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { FinalConversionStatus, FinalConversionStatusMapper } from './final-conversion-tag';

const conversionStyles: Record<FinalConversionStatus, string> = {
  [FinalConversionStatus.UNCONFIRMED]: 'bg-pink-100 text-pink-700',
  [FinalConversionStatus.CONVERTED]: 'bg-green-100 text-green-700',
  [FinalConversionStatus.DEAD]: 'bg-red-100 text-red-700',
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
  const [dropdownStyles, setDropdownStyles] = useState({
    top: 0,
    left: 0,
    width: 0,
    placeAbove: false
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 200;
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
    if (isDisable || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !buttonRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isDisable, isOpen]);

  const handleOptionClick = (status: FinalConversionStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          !isDisable && setIsOpen((prev) => !prev);
        }}
        disabled={isDisable}
        className={`w-[140px] mx-auto flex items-center justify-between gap-2 rounded-md text-sm font-medium px-3 py-1 ${conversionStyles[value]} ${
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
            className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1"
            style={{
              top: dropdownStyles.top,
              left: dropdownStyles.left,
              width: dropdownStyles.width,
              minWidth: '140px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {Object.values(FinalConversionStatus).map((status) => (
              <div
                key={status}
                onClick={() => handleOptionClick(status)}
                className={`flex items-center justify-between px-3 py-2 mx-1 rounded-md text-sm font-medium cursor-pointer transition-colors hover:opacity-80 ${conversionStyles[status]}`}
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
