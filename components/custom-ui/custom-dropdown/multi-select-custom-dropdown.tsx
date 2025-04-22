import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownProps {
  label?: string;
  options: string[];
  selected: string[];
  placeholder?: string;
  onChange: (value: string[]) => void;
}

export const MultiSelectCustomDropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected,
  placeholder,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    const isSelected = selected.includes(option);
    const updated = isSelected
      ? selected.filter((val) => val !== option)
      : [...selected, option];
    onChange(updated);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>

      <div
        className={`flex justify-between items-center p-3 border rounded-md w-full cursor-pointer form-field ${
          selected.length === 0 ? "form-field-input-init-text" : "form-field-input-text"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">
          {selected.length > 0 ? selected.join(", ") : placeholder || "Select options"}
        </span>
        <ChevronDown className="w-6 h-6 text-gray-600" />
      </div>

      {open && (
        <div className="absolute mt-2 max-h-60 bg-white form-field shadow-lg z-10 overflow-auto w-full py-2">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <div
                key={option}
                onClick={() => toggleOption(option)}
                className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  isSelected ? "form-field-input-text" : ""
                }`}
              >
                <span className="form-field-input-text">{option}</span>
                {isSelected && <Check className="w-5 h-5 text-gray-600" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
