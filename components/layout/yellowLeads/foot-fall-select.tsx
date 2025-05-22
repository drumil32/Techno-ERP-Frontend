import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
      const dropdownHeight = Object.values(FootFallStatus).length * 32 + 8;
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
        className={`w-[75px] flex mx-auto items-center justify-between gap-1 rounded-md text-sm font-medium px-2 py-1 hover:border-slate-500 border-1 border-transparent hover:opacity-90 ${footfallStyles[value]} ${
          disabled ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        <span className="truncate">{toPascal(value)}</span>
        {!disabled && (
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1"
            style={{ top: position.top, left: position.left, width: position.width }}
          >
            {Object.values(FootFallStatus).map((status) => (
              <div
                key={status}
                onClick={() => {
                  onChange(status);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-2 py-1 mx-[2px] rounded-md text-sm font-medium cursor-pointer hover:opacity-80 ${footfallStyles[status]}`}
              >
                <span>{toPascal(status)}</span>
                {value === status && <Check className="w-3 h-3" />}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
