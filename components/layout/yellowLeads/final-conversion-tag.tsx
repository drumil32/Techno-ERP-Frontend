export enum FinalConversionStatus {
  NO_FOOTFALL = 'NO_FOOTFALL',
  UNCONFIRMED = 'UNCONFIRMED',
  CONVERTED = 'CONVERTED',
  DEAD = 'DEAD',
}

export const FinalConversionStatusMapper: Record<FinalConversionStatus, string> = {
  [FinalConversionStatus.CONVERTED]: 'Admission',
  [FinalConversionStatus.DEAD]: 'Unconfirmed',
  [FinalConversionStatus.UNCONFIRMED]: 'Not Interested',
  [FinalConversionStatus.NO_FOOTFALL]: 'No Footfall',
};

const conversionStyles = {
  [FinalConversionStatus.UNCONFIRMED]: 'bg-pink-100 text-pink-700',
  [FinalConversionStatus.CONVERTED]: 'bg-green-100 text-green-700',
  [FinalConversionStatus.DEAD]: 'bg-red-100 text-red-700',
  [FinalConversionStatus.NO_FOOTFALL]: 'bg-yellow-100 text-orange-700',
};
export function toPascal(title: string) {
  if (!title.includes('_')) {
    return title[0].toUpperCase() + title.slice(1).toLowerCase();
  }
  var words = title.split('_');
  var convertedTitle = '';
  words.forEach((word) => {
    let formatedWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
    convertedTitle += formatedWord;
    convertedTitle += ' ';
  });

  return convertedTitle;
}
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
