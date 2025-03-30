export enum FinalConversionStatus {
  PINK = 'PENDING',
  GREEN = 'CONVERTED',
  RED = 'NOT_CONVERTED'
}

export const FinalConversionStatusMapper: Record<FinalConversionStatus, string> = {
  [FinalConversionStatus.GREEN]: 'Admission',
  [FinalConversionStatus.RED]: 'Unconfirmed',
  [FinalConversionStatus.PINK]: 'Not Interested'
};

const conversionStyles = {
  [FinalConversionStatus.PINK]: 'bg-pink-100 text-pink-700',
  [FinalConversionStatus.GREEN]: 'bg-green-100 text-green-700',
  [FinalConversionStatus.RED]: 'bg-red-100 text-red-700'
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
