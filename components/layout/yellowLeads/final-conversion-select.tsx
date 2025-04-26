import { useEffect, useRef, useState } from 'react';
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

  const handleTriggerClick = () => {
    if (!isDisable) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (status: FinalConversionStatus) => {
    if (!isDisable) {
      onChange(status);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-[140px]" ref={dropdownRef}>
      <button
        onClick={handleTriggerClick}
        disabled={isDisable}
        className={`w-full flex items-center justify-between gap-2 rounded-md text-sm font-medium px-3 py-1 ${conversionStyles[value]} ${
          isDisable
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:opacity-90 hover:border-slate-500 border-1 border-transparent'
        }`}
      >
        <span className="truncate">{FinalConversionStatusMapper[value]}</span>
        {!isDisable && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !isDisable && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1">
          {Object.values(FinalConversionStatus).map((status) => (
            <div
              key={status}
              onClick={() => handleItemClick(status)}
              className={`flex items-center justify-between px-3 py-2 mx-1 rounded-md text-sm font-medium cursor-pointer transition-colors hover:opacity-80 ${conversionStyles[status]}`}
            >
              <span>{FinalConversionStatusMapper[status]}</span>
              {value === status && <Check className="w-4 h-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
