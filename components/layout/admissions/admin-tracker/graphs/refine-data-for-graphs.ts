import { getOrdinal } from '@/lib/numbers';
import { AdmissionAggregationItem } from '@/types/admissions';

export const refineDataForDayWiseGraph = ({
  data
}: {
  data: AdmissionAggregationItem[];
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
      day: `${getOrdinal(day)} ${monthName}`,
      admissions: item.count
    };
  });
};
