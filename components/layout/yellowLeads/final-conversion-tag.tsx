import { FinalConversionStatus, FinalConversionStatusMapper } from "@/types/enum";
import { conversionStyles } from "./final-conversion-select";


interface FinalConversionTagProps {
  status: FinalConversionStatus;
}

export default function FinalConversionTag({ status }: FinalConversionTagProps) {
  const style = conversionStyles[status] || 'bg-gray-100 text-gray-700';

  return (
    status && (
      <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>
        {FinalConversionStatusMapper[status as FinalConversionStatus]}
      </span>
    )
  );
}
