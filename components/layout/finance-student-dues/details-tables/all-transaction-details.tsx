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
import TxnTypeTag from '../txn-type-tag';
import { format } from 'date-fns';
import { TruncatedCell } from '@/components/custom-ui/data-table/techno-data-table';
import { Button } from '@/components/ui/button';
import { ReceiptIndianRupee } from 'lucide-react';
import { TransactionReceiptDialog } from './trascation-receipt-download-dialog';

type ExtendedTransaction = Transaction & {
  sno: number;
};

export default function AllTransactionsDetails({
  transactionHistory,
  studentId
}: {
  transactionHistory: Transaction[];
  studentId: string;
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
        totals.amount -= item.amount ?? 0;
      }
      return totals;
    },
    { amount: 0 }
  );

  const handleReceiptDownload = (transactionId: string) => {
    console.log('Download receipt for transaction ID:', transactionId);
  };

  return (
    <div className="w-full p-3 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-full flex p-2 items-center my-2">
        <div className="font-semibold text-[16px]">All Transactions </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="w-3/5">
          <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1]">
            <TableRow>
              <TableHead className="rounded-l-[5px] text-center">S. No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">Transaction ID</TableHead>
              <TableHead>Fees Action</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="rounded-r-[5px]">Download Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extendedTransactionHistory.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell className="text-center">{transaction.sno}</TableCell>
                <TableCell>{format(transaction.dateTime, 'dd/MM/yyyy')}</TableCell>
                <TableCell>{format(transaction.dateTime, 'HH:mm')}</TableCell>
                <TableCell className="text-center">{transaction.transactionID}</TableCell>
                <TableCell>
                  <FeeActionTag status={transaction.feeAction as FeeActions} />
                </TableCell>
                <TableCell className="text-right">
                  {transaction.amount != null ? `${transaction.amount.toLocaleString()}` : '--'}
                </TableCell>
                <TableCell>
                  <TxnTypeTag status={transaction.txnType as TransactionTypes} />
                </TableCell>
                <TableCell>
                  <TruncatedCell
                    value={!transaction.remark ? '--' : transaction.remark}
                    maxWidth={90}
                  />
                </TableCell>
                <TableCell className="text-center py-2">
                  <TransactionReceiptDialog studentId={studentId} transactionId={transaction._id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="font-bold">
            <TableRow className="bg-gray-300/70">
              <TableCell className="rounded-l-[5px]" colSpan={5}>
                Total
              </TableCell>
              <TableCell className="text-right">₹{amountTotal?.amount.toLocaleString()}</TableCell>
              <TableCell className="rounded-r-[5px]" colSpan={3}>
                {''}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
