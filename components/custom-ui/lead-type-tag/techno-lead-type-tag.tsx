import { LeadType, LeadTypeMapper } from "@/static/enum";

const typeStyles = {
  [LeadType.OPEN]: 'bg-[#FFE3CB] text-[#E06C06]',
  [LeadType.DEAD]: 'bg-[#FFD0D6] text-[#E22339]',
  [LeadType.INTERESTED]: 'bg-[#F8F6BC] text-[#A67B0A]',
  [LeadType.COURSE_UNAVAILABLE]: 'bg-[#CECECE] text-[#696969]',
  [LeadType.NO_CLARITY]: 'bg-[#C8E4FF] text-[#006ED8]',
  [LeadType.DID_NOT_PICK]: 'bg-[#F5F5F5] text-[#9E9E9E]',
  [LeadType.INVALID]:'bg-[#BDBDBD] text-[#FFFFFF]'
};

interface TechnoLeadTypeTagProps {
  type: LeadType;
}

export default function TechnoLeadTypeTag({ type }: TechnoLeadTypeTagProps) {
  const style = typeStyles[type] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`px-2 py-1 rounded-[5px] text-sm font-medium ${style}`}>
      {/* Converting into Pascal style*/}
      {LeadTypeMapper[type]}
    </span>
  );
}
