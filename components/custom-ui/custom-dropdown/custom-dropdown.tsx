import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownProps {
  label?: string;
  options: string[];
  selected: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const CustomDropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected,
  placeholder,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {label && (
        <p className="text-xs text-purple-600 font-inter mb-1">{label}</p>
      )}
      <div
        className={`flex justify-between items-center p-3 border rounded-md w-full cursor-pointer form-field ${!selected ? "form-field-input-init-text" : "form-field-input-text"
          }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">{selected || placeholder}</span>
        <ChevronDown className="w-6 h-6 text-gray-600" />
      </div>




      {open && (
        <div className="absolute mt-2 max-h-60 bg-white form-field shadow-lg z-10 overflow-auto w-full py-2">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${selected === option ? "form-field-input-text" : ""
                }`}
            >
              <span className="form-field-input-text">{option}</span>
              {selected === option && <Check className="w-5 h-5 text-gray-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
