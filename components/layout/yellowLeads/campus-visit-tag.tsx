export enum CampusVisitStatus {
  true = 'YES',
  false = 'NO'
}

const visitStyles = {
  [CampusVisitStatus.true]: 'bg-green-100 text-green-700',
  [CampusVisitStatus.false]: 'bg-rose-100 text-rose-700'
};

interface CampusVisitTagProps {
  status: CampusVisitStatus;
}

export default function CampusVisitTag({ status }: CampusVisitTagProps) {
  const style = visitStyles[status] || 'bg-gray-100 text-gray-700';

  return <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>{status}</span>;
}
