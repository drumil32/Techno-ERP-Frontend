import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
import { FootFallStatus } from "./foot-fall-tag";
  
  const footfallStyles: Record<FootFallStatus, string> = {
    [FootFallStatus.true]: 'bg-green-100 text-green-700',
    [FootFallStatus.false]: 'bg-rose-100 text-rose-700',
  };
  
  interface FootFallSelectProps {
    value: FootFallStatus;
    onChange: (value: FootFallStatus) => void;
  }
  
  export default function FootFallSelect({
    value,
    onChange,
  }: FootFallSelectProps) {
    const selectedStyle = footfallStyles[value];
  
    return (
      <Select value={value} onValueChange={(val) => onChange(val as FootFallStatus)}>
        <SelectTrigger
          className={`cursor-pointer rounded-md text-sm font-medium px-2 py-1 w-[120px] ${selectedStyle}`}
        >
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="space-y-1 py-1">
          {Object.values(FootFallStatus).map((status) => (
            <SelectItem
              key={status}
              value={status}
              className={`hover:border-slate-600 border-2 cursor-pointer rounded-md text-sm font-medium px-3 py-2 transition-all ${footfallStyles[status]}`}
            >
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  