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
import { BadgeIndianRupee, ReceiptIndianRupee } from 'lucide-react';
import { TransactionReceiptDialog } from './trascation-receipt-download-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-green-900 pb-3 border-b border-gray-100">
          <BadgeIndianRupee className="h-6 w-6 text-green-700" />
          All Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto -mt-2">
        <div className="rounded-[5px] w-[65%] overflow-auto border-2 border-gray-100 relative">
          <Table className="w-full">
            <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1] ">
              <TableRow>
                <TableHead className="text-center">S. No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Transaction ID</TableHead>
                <TableHead>Fees Action</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extendedTransactionHistory.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="text-center">{transaction.sno}</TableCell>
                  <TableCell>{format(transaction.dateTime, 'dd/MM/yyyy')}</TableCell>
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
                    <TransactionReceiptDialog
                      studentId={studentId}
                      transactionId={transaction._id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="font-bold">
              <TableRow className="bg-gray-300/70">
                <TableCell className="" colSpan={4}>
                  Total
                </TableCell>
                <TableCell className="text-right">
                  ₹{amountTotal?.amount.toLocaleString()}
                </TableCell>
                <TableCell className="" colSpan={3}>
                  {''}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
