import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FinalConversionStatus, FinalConversionStatusMapper } from "./final-conversion-tag";

const conversionStyles: Record<FinalConversionStatus, string> = {
  [FinalConversionStatus.UNCONFIRMED]: 'bg-pink-100 text-pink-700',
  [FinalConversionStatus.CONVERTED]: 'bg-green-100 text-green-700',
  [FinalConversionStatus.DEAD]: 'bg-red-100 text-red-700',
  [FinalConversionStatus.NO_FOOTFALL]: 'bg-yellow-100 text-orange-700',
};

interface FinalConversionSelectProps {
  value: FinalConversionStatus;
  onChange: (value: FinalConversionStatus) => void;
  isDisable?:boolean;
}

export default function FinalConversionSelect({
  value,
  onChange,
  isDisable=false
}: FinalConversionSelectProps) {
  const selectedStyle = conversionStyles[value];

  return (
    <Select value={value} disabled={isDisable} onValueChange={(val) => onChange(val as FinalConversionStatus)}>
      <SelectTrigger
        className={`cursor-pointer rounded-md text-sm font-medium px-2 py-1 w-[180px] ${selectedStyle}`}
      >
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent className="space-y-1 py-1">
        {Object.values(FinalConversionStatus).map((status) => (
          <SelectItem
            key={status}
            value={status}
            className={`hover:border-slate-600 border-2 cursor-pointer rounded-md text-sm font-medium px-3 py-2 transition-all ${conversionStyles[status]}`}
          >
            {FinalConversionStatusMapper[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
