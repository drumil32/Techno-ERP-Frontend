import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FootFallStatus } from "./foot-fall-tag";
import { toPascal } from "@/lib/utils";

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
      <SelectTrigger className={`cursor-pointer border-transparent hover:border-slate-600 rounded-md text-sm font-medium px-2 py-1 w-[75px] ${selectedStyle}`}>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent className="w-[75px] min-w-[75px]">
        {Object.values(FootFallStatus).map((status) => (
          <SelectItem
            key={status}
            value={status}
            className={`w-[71px] mx-[2px] border-transparent cursor-pointer rounded-md text-sm font-medium px-2 py-1 transition-all ${footfallStyles[status]}`}
          >
            {toPascal(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}