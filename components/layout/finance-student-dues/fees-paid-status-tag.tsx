import { toPascal } from "@/lib/utils";
import { FeesPaidStatus } from "@/types/enum";

const feespaidStyle: Record<FeesPaidStatus, string> = {
  [FeesPaidStatus.PAID]: 'bg-green-100 text-green-700',
  [FeesPaidStatus.DUE]: 'bg-rose-100 text-rose-700',
  [FeesPaidStatus.NOT_PROVIDED]: 'bg-gray-100 text-gray-700',
};

interface FeesPaidTagProps {
  status: FeesPaidStatus
}

const defaultStyle = 'bg-gray-100 text-gray-700';

export default function FeesPaidTag({ status }: FeesPaidTagProps) {
  const style = feespaidStyle[status] ?? defaultStyle;
  return <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>{toPascal(status)}</span>;
}
