import { Transaction } from '@/types/finance';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import FeeActionTag from '../fees-action-tag';
import { FeeActions, TransactionTypes } from '@/types/enum';
import TxnTypaTag from '../txn-type-tag';
import { format } from 'date-fns';
import { TruncatedCell } from '@/components/custom-ui/data-table/techno-data-table';

type ExtendedTransaction = Transaction & {
  sno: number;
};

export default function AllTransactionsDetails({
  transactionHistory,
  studentDuesId
}: {
  transactionHistory: Transaction[];
  studentDuesId: string;
}) {
  const extendedTransactionHistory: ExtendedTransaction[] = transactionHistory.map(
    (item, index) => {
      return {
        ...item,
        sno: index + 1
      };
    }
  );

  const amountTotal = transactionHistory.reduce(
    (totals, item) => {
      if (item.feeAction == FeeActions.DEPOSIT) {
        totals.amount += item.amount ?? 0;
      } else {
        totals.amount -= item.amount ?? 0
      }
      return totals;
    },
    { amount: 0 }
  );

  return (
    <div className="w-full p-3 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-full flex p-2 items-center">
        <div className="font-semibold text-[16px]">All Transactions </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1]">
            <TableRow>
              <TableHead className="rounded-l-[5px]">S. No</TableHead>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[80px]">Time</TableHead>
              <TableHead className="w-[110px]">Transaction ID</TableHead>
              <TableHead className="w-[120px]">Fees Action</TableHead>
              <TableHead className="w-[80px] text-right">Amount</TableHead>
              <TableHead className="w-[110px]">Transaction Type</TableHead>
              <TableHead className="w-auto rounded-r-[5px]">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extendedTransactionHistory.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell className="w-[31px]">{transaction.sno}</TableCell>
                <TableCell className="w-[80px]">
                  {format(transaction.dateTime, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="w-[100px]">{format(transaction.dateTime, 'HH:mm')}</TableCell>
                <TableCell className="w-[80px]">{transaction.transactionID}</TableCell>
                <TableCell className="w-[110px]">
                  <FeeActionTag status={transaction.feeAction as FeeActions} />
                </TableCell>
                <TableCell className="w-[120px] text-right">
                  {transaction.amount != null ? `₹ ${transaction.amount.toLocaleString()}` : '__'}
                </TableCell>
                <TableCell className="w-[110px]">
                  <TxnTypaTag status={transaction.txnType as TransactionTypes} />
                </TableCell>
                <TableCell className="">
                  <TruncatedCell
                    value={transaction.remark === '' ? '--' : transaction.remark}
                    maxWidth={300}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="rounded-l-[5px]" colSpan={5}>
                Total
              </TableCell>
              <TableCell className="rounded-r-[5px] text-right">
                ₹{amountTotal?.amount.toLocaleString()}
              </TableCell>
              <TableCell className="rounded-r-[5px]" colSpan={2}>
                {''}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
