import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  name: string;
  bgStyle: string;
  textStyle: string;
}

interface CustomDropdownProps<T extends string> {
  value: T;
  onChange: (newValue: T) => void;
  data: Record<T, DropdownOption>;
  isDisabled?: boolean;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export function CustomDropdown<T extends string>({
  value,
  onChange,
  data,
  isDisabled = false,
  className = '',
  buttonClassName = '',
  dropdownClassName = ''
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const currentOption = data[value];

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = Object.keys(data).length * 36 + 16; // Approximate height
      const spaceBelow = window.innerHeight - rect.bottom;

      setPosition({
        top: spaceBelow > dropdownHeight ? rect.bottom : rect.top - dropdownHeight,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen, data]);

  useEffect(() => {
    if (!isOpen || isDisabled) return;
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
  }, [isOpen, isDisabled]);

  const handleOptionClick = (key: T) => {
    onChange(key);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`flex items-center justify-between  rounded-md text-sm font-medium px-2 py-1 w-full
          ${currentOption?.bgStyle || 'bg-white'} 
          ${currentOption?.textStyle || 'text-gray-800'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}
          border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300
          ${buttonClassName}`}
      >
        <span className="truncate">{currentOption?.name || value}</span>
        {!isDisabled && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 overflow-auto max-h-[250px] ${dropdownClassName}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`
            }}
          >
            {Object.entries<DropdownOption>(data).map(([key, option]) => (
              <div
                key={key}
                onClick={() => handleOptionClick(key as T)}
                className={`flex items-center justify-between px-2 py-1 mx-1 rounded-md text-sm font-medium cursor-pointer
                  ${option.bgStyle} ${option.textStyle}
                  hover:opacity-80 transition-colors
                  ${value === key ? 'ring-1 ring-inset ring-gray-400' : ''}`}
              >
                <span className="truncate">{option.name}</span>
                {value === key && <Check className="w-4 h-4" />}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
