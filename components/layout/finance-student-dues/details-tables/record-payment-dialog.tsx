import { Button } from "@/components/ui/button";
import { StudentDetails } from "@/types/finance";
import { BookOpen, Loader2 } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';
import { Label } from "@/components/ui/label";
import { FeeActions, TransactionTypes } from "@/types/enum";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { recordPayment } from "../helpers/fetch-data";
import { getFeeActionLabel, getTransactionTypeLabel } from "@/lib/enumDisplayMapper";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const feesActionMapping = {
  [FeeActions.DEPOSIT]: "DEPOSIT",
  [FeeActions.REFUND]: "REFUND"
};

const transactionTypeMapping = {
  [TransactionTypes.CASH]: "CASH",
  [TransactionTypes.NEFT_IMPS_RTGS]: "NEFT/RTGS/IMPS",
  [TransactionTypes.UPI]: "UPI",
  [TransactionTypes.CHEQUE]: "CHEQUE",
  [TransactionTypes.OTHERS]: "OTHERS",
};

const formSchema = z.object({
  feesAction: z.nativeEnum(FeeActions, {
    required_error: "Please select a fees action"
  }),
  transactionType: z.nativeEnum(TransactionTypes, {
    required_error: "Please select a transaction type"
  }),
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).gt(0, { message: "Amount must be greater than 0" }),
  remark: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function RecordPaymentDialog({ studentDetails }: { studentDetails: StudentDetails | undefined }) {
  const param = useParams();
  const studentId = param.studentId as string;
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feesAction: FeeActions.DEPOSIT,
      transactionType: TransactionTypes.CASH,
      amount: 0,
      remark: ""
    }
  });

  const handleRecordPayment = async (values: FormValues) => {
    setIsLoading(true);

    const payload = {
      studentId: studentId,
      feeAction: feesActionMapping[values.feesAction],
      txnType: transactionTypeMapping[values.transactionType],
      amount: values.amount,
      remark: values.remark || "",
      date: new Date().toISOString()
    };

    try {
      const res = await recordPayment(payload);

      if (res == null) {
        throw new Error("Failed to record payment");
      }

      toast.success("Payment recorded successfully!");

      // Reset form and invalidate queries
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['studentFeesInformation', studentId]
      });

      // Close dialog only after successful response
      setOpen(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(newOpen) => {
      if (isLoading && !newOpen) return;
      setOpen(newOpen);
    }}>
      <Dialog.Trigger asChild>
        <Button className="ml-auto rounded-[10px]">Record a payment</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-30 inset-0 bg-black/30" />
        <Dialog.Content className="bg-white h-fit sm:min-w-[600px] z-40 p-6 rounded-xl shadow-xl w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/*Dialogue Title Header*/}
          <div className="flex justify-between items-center mb-8">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-500 text-xl" />
              &nbsp;Record a payment
            </Dialog.Title>
            <Dialog.Close
              className="text-gray-500 hover:text-black text-xl font-bold cursor-pointer"
              disabled={isLoading}
            >
              &times;
            </Dialog.Close>
          </div>

          {/*Readable Fields - Student Information*/}
          <div className="flex flex-row z-100">
            <div className="flex flex-col w-1/2 gap-6">
              <div className="flex flex-col gap-3">
                <Label className="text-gray-500 text-md">Student Name</Label>
                <Label className="text-gray-800 text-md">{studentDetails?.studentName}</Label>
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-gray-500 text-md">Student ID</Label>
                <Label className="text-gray-800 text-md">{studentDetails?.studentID}</Label>
              </div>
            </div>
            <div className="flex flex-col w-1/2 gap-6">
              <div className="flex flex-col gap-3">
                <Label className="text-gray-500 text-md">Father Name</Label>
                <Label className="text-gray-800 text-md">{studentDetails?.fatherName}</Label>
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-gray-500 text-md">Date</Label>
                <Label className="text-gray-800 text-md">{format(new Date(), 'dd/MM/yyyy')}</Label>
              </div>
            </div>
          </div>

          {/*Form*/}
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRecordPayment)} className="space-y-6">
                <div className="flex flex-row gap-4 text-md">
                  <FormField
                    control={form.control}
                    name="feesAction"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-500 text-md">Fees Action</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="w-full text-md">
                              <SelectValue placeholder="Select a fees action" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-md">
                            {Object.values(FeeActions).map((action) => (
                              <SelectItem key={action} value={action}>
                                {getFeeActionLabel(action)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-500 text-md">Transaction Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="w-full text-md">
                              <SelectValue placeholder="Select a transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-md">
                            {Object.values(TransactionTypes).map((type) => (
                              <SelectItem key={type} value={type}>
                                {getTransactionTypeLabel(type)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-500 text-md">Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the amount"
                          {...field}
                          type="text"
                          className="!text-md"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-500 text-md">Remarks</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Write your remarks"
                          {...field}
                          className="!text-md"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => !isLoading && setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#5B31D1] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Record"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
