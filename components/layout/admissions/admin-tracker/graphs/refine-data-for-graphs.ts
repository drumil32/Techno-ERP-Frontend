import { getOrdinal } from '@/lib/numbers';
import { AdmissionAggregationItem } from '@/types/admissions';
import { AdmissionAggregationType } from '@/types/enum';
import { FaW } from 'react-icons/fa6';

export const refineDataForDayWiseGraph = ({
  data,
  type
}: {
  data: AdmissionAggregationItem[];
  type: AdmissionAggregationType;
}): {
  day: string;
  admissions: number;
}[] => {
  return data.map((item) => {
    const [day, month, year] = item.date.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    const options = { month: 'long' } as const;
    const monthName = new Intl.DateTimeFormat('en-US', options).format(date);

    return {
      day:
        type === AdmissionAggregationType.DATE_WISE
          ? `${getOrdinal(day)} ${monthName}`
          : `${monthName}`,
      admissions: item.count
    };
  });
};
