import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { FootFallStatus } from './foot-fall-tag';
import { toPascal } from '@/lib/utils';

const footfallStyles: Record<FootFallStatus, string> = {
  [FootFallStatus.true]: 'bg-green-100 text-green-700',
  [FootFallStatus.false]: 'bg-rose-100 text-rose-700'
};

interface FootFallSelectProps {
  value: FootFallStatus;
  onChange: (value: FootFallStatus) => void;
  disabled?: boolean;
}

export default function FootFallSelect({ value, onChange, disabled = false }: FootFallSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [disabled]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (status: FootFallStatus) => {
    if (!disabled) {
      onChange(status);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-[75px] mx-auto" ref={dropdownRef}>
      <button
        onClick={handleTriggerClick}
        disabled={disabled}
        className={`w-full  hover:border-slate-500 border-1 border-transparent flex items-center justify-between gap-1 cursor-pointer rounded-md text-sm font-medium px-2 py-1 hover:opacity-90 ${footfallStyles[value]} ${
          disabled ? 'border-transparent  opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="truncate">{toPascal(value)}</span>
        {!disabled && (
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-[75px] bg-white rounded-md shadow-lg border border-gray-200 py-1">
          {Object.values(FootFallStatus).map((status) => (
            <div
              key={status}
              onClick={() => handleItemClick(status)}
              className={`flex items-center justify-between px-2 py-1 mx-[2px] rounded-md text-sm font-medium cursor-pointer transition-colors hover:opacity-80 ${
                footfallStyles[status]
              }`}
            >
              <span>{toPascal(status)}</span>
              {value === status && <Check className="w-3 h-3" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
