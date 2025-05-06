import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagInputProps {
  value?: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ value = [], onChange, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tag: string) => {
    if (disabled) return;
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-wrap gap-2 border rounded-lg p-2 min-h-[40px]">
      {value.map((tag, index) => (
        <div key={index} className="bg-[#4E2ECC] text-white px-2 py-1 rounded flex items-center">
          {tag}
          {!disabled && (
            <X size={16} className="ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
          )}
        </div>
      ))}
      {!disabled && (
        <Input
          type="text"
          className="border-none focus:ring-0"
          placeholder="Add subjects..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default TagInput;
