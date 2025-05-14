import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Dialog from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { SquarePen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { getFinanceFeeTypeLabel } from '@/lib/enumDisplayMapper';
import { updateFeeBreakUp } from '../helpers/fetch-data';
import { toast } from 'sonner';
import { SemesterBreakUp } from '@/types/finance';

const feeSchema = z.object({
  amount: z.coerce
    .number({
      required_error: '',
      invalid_type_error: ''
    })
    .refine((val) => val !== 0, {
      message: ''
    })
    .refine((val) => val !== null && val !== undefined, {
      message: ''
    })
});

type FormData = z.infer<typeof feeSchema>;

export default function UpdateFeeDetailDialog({
  studentName,
  semesterNumber,
  semesterId,
  feeDetail
}: {
  studentName: string;
  semesterNumber: number;
  semesterId: string;
  feeDetail: SemesterBreakUp['details'][number];
}) {
  const [open, setOpen] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  const params = useParams();
  const studentId = params.studentId as string;
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    defaultValues: {
      amount: 0
    },
    resolver: zodResolver(feeSchema)
  });

  const handleDialogClose = () => {
    setAdjustmentAmount(0);
    setValidationError('');
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (data: FormData) => {
    const updatedFinalFee = feeDetail.finalFee + data.amount;

    // Check if updated final fee would be negative
    if (updatedFinalFee < 0) {
      setValidationError('Updated final fee cannot be negative');
      return;
    }

    const payload = {
      studentId,
      semesterId,
      detailId: feeDetail.feeDetailId,
      amount: feeDetail.finalFee + data.amount
    };

    try {
      await updateFeeBreakUp(payload);
      toast.success(
        `${getFinanceFeeTypeLabel(feeDetail.feeCategory)} is updated for ${studentName}.`
      );
      handleDialogClose();
    } catch (error) {
      toast.error('Failed to record payment. Please try again.');
    }

    handleDialogClose();

    queryClient.invalidateQueries({
      queryKey: ['studentFeesInformation', studentId]
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAdjustmentAmount(value);

    // Clear validation error if input is valid
    if (feeDetail.finalFee + value >= 0) {
      setValidationError('');
    } else {
      setValidationError('Updated final fee cannot be negative');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon">
          <SquarePen className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-30 inset-0 bg-black/30" />
        <Dialog.Content className="bg-white sm:min-w-[500px] z-40 p-6 rounded-xl shadow-xl w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Dialogue Title Header */}
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <SquarePen className="w-5 h-5 text-gray-500" />
              Edit Fee Breakup
            </Dialog.Title>
            <Dialog.Close
              className="text-gray-500 hover:text-black text-xl font-bold cursor-pointer"
              onClick={handleDialogClose}
            >
              &times;
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div className="mb-5 space-y-2">
              <h3 className="font-medium text-lg">Semester {semesterNumber}</h3>
              <p className="text-gray-600">
                Fee Category:{' '}
                <span className="text-gray-900">
                  {getFinanceFeeTypeLabel(feeDetail.feeCategory)}
                </span>
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex mb-5 gap-4">
                  <div className="space-y-2 cursor-not-allowed">
                    <Label htmlFor="current-fee">Current Final Fee</Label>
                    <Input
                      id="current-fee"
                      type="text"
                      value={`₹ ${feeDetail.finalFee.toLocaleString()}`}
                      disabled
                      className="bg-gray-50 "
                    />
                  </div>

                  <div className="space-y-2 cursor-not-allowed">
                    <Label htmlFor="updated-fee">Updated Final Fee</Label>
                    <Input
                      id="updated-fee"
                      type="text"
                      value={`₹ ${(feeDetail.finalFee + adjustmentAmount).toLocaleString()}`}
                      disabled
                      className={`bg-gray-50 ${feeDetail.finalFee + adjustmentAmount < 0 ? 'border-red-500 text-red-500' : ''}`}
                    />
                    {feeDetail.finalFee + adjustmentAmount < 0 && (
                      <p className="text-red-500 text-sm mt-1">Updated fee cannot be negative</p>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustment Amount (+ for increase, - for decrease)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter adjustment amount"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleAmountChange(e);
                          }}
                          className={validationError ? 'border-red-500' : ''}
                        />
                      </FormControl>
                      {validationError && (
                        <p className="text-red-500 text-sm mt-1">{validationError}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!!validationError || feeDetail.finalFee + adjustmentAmount < 0}
                  >
                    Save Changes
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
