import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadType, LeadTypeMapper } from "@/static/enum";

const typeStyles: Record<LeadType, string> = {
  [LeadType.OPEN]: 'bg-[#FFE3CB] text-[#E06C06]',
  [LeadType.DEAD]: 'bg-[#FFD0D6] text-[#E22339]',
  [LeadType.INTERESTED]: 'bg-[#F8F6BC] text-[#A67B0A]',
  [LeadType.COURSE_UNAVAILABLE]: 'bg-[#CECECE] text-[#696969]',
  [LeadType.NO_CLARITY]: 'bg-[#C8E4FF] text-[#006ED8]',
  [LeadType.DID_NOT_PICK]: 'bg-[#F5F5F5] text-[#9E9E9E]',
  [LeadType.INVALID]: 'bg-[#BDBDBD] text-[#FFFFFF]',
};

interface LeadTypeSelectProps {
  value: LeadType;
  onChange: (value: LeadType) => void;
}

export default function LeadTypeSelect({ value, onChange }: LeadTypeSelectProps) {
  const selectedStyle = typeStyles[value];

  return (
    <Select value={value} onValueChange={(val) => onChange(val as LeadType)}>
      <SelectTrigger
        className={` cursor-pointer rounded-[5px] text-sm font-medium  w-[180px] px-2 py-1 ${selectedStyle}`}
      >
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>
      <SelectContent className="space-y-1 py-1">
        {Object.values(LeadType).map((type) => (
          <SelectItem
            key={type}
            value={type}
            className={`rounded-[5px] text-sm font-medium px-3 py-2 transition-all ${typeStyles[type]} hover:opacity-80`}
          >
            {LeadTypeMapper[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
