import { SemesterFeesResponse, TransactionsResponse } from "@/types/finance"
import { useQuery } from "@tanstack/react-query"
import { fetchSemesterFees, fetchTransactions } from "../helpers/mock-api"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { use } from "react"

export default function AllTransactionsDetails({ studentDuesId }: { studentDuesId: string }) {
  const allTransactions = useQuery<TransactionsResponse, Error>({
    queryKey: ['allTransactions', studentDuesId],
    queryFn: fetchTransactions,
    placeholderData: (previousData) => previousData,
  })

  const amountTotal = allTransactions.data?.transactions.reduce(
    (totals, item) => {
      totals.amount += item.amount ?? 0
      return totals
    },
    { amount: 0}
  )



  return (
    <div className="w-full p-3 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-full flex p-2 items-center">
        <div className="font-semibold text-[16px]">All Transactions </div>
      </div>
      <Table className="w-full">
        <TableHeader className="bg-[#F7F7F7] ">
          <TableRow>
            <TableHead className="rounded-l-[5px]">S. No</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[80px]">Time</TableHead>
            <TableHead className="w-[110px]">Transaction ID</TableHead>
            <TableHead className="w-[120px]">Fees Action</TableHead>
            <TableHead className="w-[80px] text-right">Amount</TableHead>
            <TableHead className="w-[110px]">Transaction Type</TableHead>
            <TableHead className="w-auto rounded-r-[5px]" >Remarks(Optional)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTransactions.data?.transactions.map((transaction) => (
            <TableRow key={transaction.transactionId}>
              <TableCell className="w-[31px]">{transaction.sno}</TableCell>
              <TableCell className="w-[100px]">{transaction.date}</TableCell>
              <TableCell className="w-[80px]">{transaction.time}</TableCell>
              <TableCell className="w-[80px]">{transaction.transactionId}</TableCell>
              <TableCell className="w-[110px]">{transaction.feesAction}</TableCell>
              <TableCell className="w-[120px] text-right">{transaction.amount != null ? `₹ ${transaction.amount}` : '__'}</TableCell>
              <TableCell className="w-[110px]">{transaction.transactionType}</TableCell>
              <TableCell className="w-auto">{transaction.remarks ?? '--'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="rounded-l-[5px]" colSpan={5}>Total</TableCell>
            <TableCell className="rounded-r-[5px] text-right">₹{amountTotal?.amount}</TableCell>
            <TableCell className="rounded-r-[5px]" colSpan={2}>{""}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
