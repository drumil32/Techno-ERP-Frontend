import React, { useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface DropdownProps {
  id: string;
  label?: string;
  options: string[];
  selected: string;
  placeholder?: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  setOpenDropdownId: (id: string | null) => void;
}

export const CustomDropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  selected,
  placeholder,
  onChange,
  isOpen,
  setOpenDropdownId
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [setOpenDropdownId]);

  const handleDropdownToggle = () => {
    setOpenDropdownId(isOpen ? null : id);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {label && <p className="text-xs text-purple-600 mb-1">{label}</p>}
      <div
        className={`flex justify-between items-center p-3 border rounded-md cursor-pointer ${
          !selected ? 'form-field-input-init-text' : 'form-field-input-text'
        }`}
        onClick={handleDropdownToggle}
      >
        <span className="truncate">{selected || placeholder}</span>
        <ChevronDown className="w-6 h-6 text-gray-600" />
      </div>

      {isOpen && (
        <div className="absolute mt-2 max-h-60 bg-white form-field shadow-lg z-10 overflow-auto w-full py-2">
          {options.map((option) => (
            <div
              key={option}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option);
                setOpenDropdownId(null);
              }}
              className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selected === option ? 'form-field-input-text' : ''
              }`}
            >
              <span>{option}</span>
              {selected === option && <Check className="w-5 h-5 text-gray-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
