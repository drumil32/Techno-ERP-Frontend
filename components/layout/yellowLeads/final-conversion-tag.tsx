export enum FinalConversionStatus {
  NO_FOOTFALL = 'NO_FOOTFALL',
  UNCONFIRMED = 'UNCONFIRMED',
  CONVERTED = 'CONVERTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
}

export const FinalConversionStatusMapper: Record<FinalConversionStatus, string> = {
  [FinalConversionStatus.CONVERTED]: 'Admission',
  [FinalConversionStatus.NOT_INTERESTED]: 'Not Interested',
  [FinalConversionStatus.UNCONFIRMED]: 'Unconfirmed',
  [FinalConversionStatus.NO_FOOTFALL]: 'No Footfall',
};

const conversionStyles = {
  [FinalConversionStatus.UNCONFIRMED]: 'bg-pink-100 text-pink-700',
  [FinalConversionStatus.CONVERTED]: 'bg-green-100 text-green-700',
  [FinalConversionStatus.NOT_INTERESTED]: 'bg-red-100 text-red-700',
  [FinalConversionStatus.NO_FOOTFALL]: 'bg-yellow-100 text-orange-700',
};

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
