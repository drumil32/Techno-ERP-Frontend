import { toPascal } from "@/lib/utils";
export enum FootFallStatus {
  true = 'YES',
  false = 'NO'
}

const footfallStyles = {
  [FootFallStatus.true]: 'bg-green-100 text-green-700',
  [FootFallStatus.false]: 'bg-rose-100 text-rose-700'
};

interface FootFallTagProps {
  status: FootFallStatus;
}

export default function FootFallTag({ status }: FootFallTagProps) {
  const style = footfallStyles[status] || 'bg-gray-100 text-gray-700';

  return <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>{toPascal(status)}</span>;
}
