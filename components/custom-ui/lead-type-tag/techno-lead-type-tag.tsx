import { LeadType, LeadTypeMapper } from '@/types/enum';

import { typeStyles } from '../lead-type-select/lead-type-select';

interface TechnoLeadTypeTagProps {
  type: LeadType;
}

export default function TechnoLeadTypeTag({ type }: TechnoLeadTypeTagProps) {
  const style = typeStyles[type] || 'bg-gray-100 text-gray-700';

  return (
    <div className={`px-2 py-1 rounded-[5px] text-sm font-medium ${style}`}>
      {/* Converting into Pascal style*/}
      {LeadTypeMapper[type]}
    </div>
  );
}
