import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
    value?: string[];
    onChange: (tags: string[]) => void;
    }

const TagInput: React.FC<TagInputProps> = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue(""); // Clear input after adding
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-wrap gap-2 border rounded-lg p-2 min-h-[40px] ">
      {value.map((tag, index) => (
        <div key={index} className="bg-blue-500 text-white px-2 py-1 rounded flex items-center">
          {tag}
          <X
            size={16}
            className="ml-1 cursor-pointer"
            onClick={() => removeTag(tag)}
          />
        </div>
      ))}
      <Input
        type="text"
        className="border-none focus:ring-0"
        placeholder="Add subjects..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TagInput;