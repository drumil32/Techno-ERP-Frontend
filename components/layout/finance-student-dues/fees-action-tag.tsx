import { toPascal } from "@/lib/utils";
import { FeeActions } from "@/types/enum";

const feesActionTagStype: Record<FeeActions, string> = {
    [FeeActions.REFUND]: 'bg-green-100 text-green-700',
    [FeeActions.DEPOSIT]: 'bg-rose-100 text-rose-700',
};

interface FeesActionTagProps {
    status: FeeActions
}

const defaultStyle = 'bg-gray-100 text-gray-700';

export default function FeeActionTag({ status }: FeesActionTagProps) {
    const style = feesActionTagStype[status] ?? defaultStyle;
    return <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>{toPascal(status)}</span>;
}