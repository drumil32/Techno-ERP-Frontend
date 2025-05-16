import { toPascal } from "@/lib/utils";
import { TransactionTypes } from "@/types/enum";

interface TxnTypeTagProps {
    status: TransactionTypes
}

const defaultStyle = 'bg-gray-100 text-gray-700';

export default function TxnTypeTag({ status }: TxnTypeTagProps) {
    const style = defaultStyle;
    return <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>{toPascal(status)}</span>;
}
