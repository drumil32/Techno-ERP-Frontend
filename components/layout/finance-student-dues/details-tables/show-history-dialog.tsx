import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import { Info, Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FeeHistoryRequestType, FeeHistoryResponse, SemesterBreakUp } from '@/types/finance';
import { fetchFeeBreakUpHistory } from '../helpers/fetch-data';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function ShowHistoryDialog({
  semesterId,
  feeDetail
}: {
  studentName: string;
  semesterNumber: number;
  semesterId: string;
  feeDetail: SemesterBreakUp['details'][number];
}) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const params = useParams();
  const studentId = params.studentId as string;

  const queryParams: FeeHistoryRequestType = {
    studentId,
    detailId: feeDetail.feeDetailId,
    semesterId
  };

  const feeHistory = useQuery<FeeHistoryResponse, Error>({
    queryKey: ['studentDues', queryParams],
    queryFn: (context) =>
      fetchFeeBreakUpHistory(context as QueryFunctionContext<readonly [string, any]>),
    placeholderData: (previousData) => previousData,
    enabled: open
  });

  const handleDialogClose = () => {
    setOpen(false);
    setShowAll(false);
  };

  const feeHistoryData = feeHistory.data?.feeUpdateHistory.slice().reverse() || [];
  const visibleHistory = showAll ? feeHistoryData : feeHistoryData.slice(0, 3);
  const shouldShowToggle = feeHistoryData.length > 3;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog.Trigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </Dialog.Trigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>More</p>
        </TooltipContent>
      </Tooltip>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-30 inset-0 bg-black/30" />
        <Dialog.Content className="bg-white sm:min-w-[500px] z-40 p-6 rounded-xl shadow-xl w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-500" />
              Fee Update History
            </Dialog.Title>
            <Dialog.Close
              className="text-gray-500 hover:text-black text-xl font-bold cursor-pointer"
              onClick={handleDialogClose}
            >
              &times;
            </Dialog.Close>
          </div>

          {feeHistory.isLoading ? (
            <div className="w-full flex justify-center items-center h-32">
              <Loader className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          ) : (
            <>
              <div
                className={`${showAll ? 'max-h-[400px] overflow-y-auto' : ''} space-y-4 px-3 py-2`}
              >
                {visibleHistory.length ? (
                  visibleHistory.map((entry) => (
                    <div
                      key={entry.updatedAt}
                      className="border rounded-lg p-4 shadow-sm bg-slate-50/[0.2] flex flex-col gap-2"
                    >
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{format(new Date(entry.updatedAt), 'MMMM d, yyyy, h:mm a')}</span>
                        <span className="italic">
                          By: <strong>{entry.updatedBy ?? '--'}</strong>
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Net Change:</span>
                          <br />
                          {entry.extraAmount ? (
                            <span
                              className={
                                entry.extraAmount >= 0
                                  ? 'text-green-600 font-medium'
                                  : 'text-red-600 font-medium'
                              }
                            >
                              {entry.extraAmount >= 0 ? '+' : '-'}₹{' '}
                              {Math.abs(entry.extraAmount).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-800 font-medium">--</span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Updated Fee:</span>
                          <br />
                          <span className="text-gray-800 font-medium text-right">
                            ₹ {entry.updatedFee.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-20 flex items-center justify-center text-gray-500">
                    No fee history available.
                  </div>
                )}
              </div>

              {shouldShowToggle && (
                <div className="mt-4 text-center">
                  <Button variant="ghost" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'Show All'}
                  </Button>
                </div>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
