import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { UserAnalyticsData } from '@/types/marketing';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { ChartBar, ChartPie } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { fetchUserAnalytics, updateAnalyticsRemarks } from './helpers/fetch-data';
import CountUp from 'react-countup';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneOff,
  Footprints,
  GraduationCap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function UserAnalytics() {
  const [open, setOpen] = useState(false);
  const [analyticsRemark, setAnalyticsRemark] = useState('');


  const userAnalyticsQuery = useQuery<UserAnalyticsData>({
    queryKey: ['user-analytics', open],
    queryFn: (context) =>
      fetchUserAnalytics(context as QueryFunctionContext<readonly [string, any]>),
    placeholderData: (previousData) => previousData
  });

  const handleSave = async () => {
    console.log('Analytics Remark:', analyticsRemark);
    try {
      setOpen(false);
      await updateAnalyticsRemarks({analyticsRemark: analyticsRemark})
      toast.success("Successfully saved remarks.")
    } catch (e) {
      toast.error("Error in the saving remarks.")
    } finally {

    }
  };

  const userAnalyticsData = userAnalyticsQuery.data;

  useEffect(() => {
    if(userAnalyticsData){
    setAnalyticsRemark(userAnalyticsData?.analyticsRemark)
    }
  }, [userAnalyticsData])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-colors duration-200 text-base px-4 py-2 rounded-[10px]"
          >
            <ChartPie className="size-5" />
            <span>My Analytics</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <h3 className="flex gap-3 text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-gray-100">
                <ChartBar className="size-6 text-purple-700" />
                My Analytics
              </h3>
            </DialogTitle>
          </DialogHeader>

          {userAnalyticsQuery.isLoading ? (
            <div className="text-sm text-gray-500 py-4">Loading analytics...</div>
          ) : userAnalyticsData ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Call Analytics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Total Calls" value={userAnalyticsData.totalCalls} />
                  <StatCard label="New Lead Calls" value={userAnalyticsData.newLeadCalls} />
                  <StatCard label="Active Lead Calls" value={userAnalyticsData.activeLeadCalls} />
                  <StatCard
                    label="Non-Active Lead Calls"
                    value={userAnalyticsData.nonActiveLeadCalls}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Admissions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Total Footfall" value={userAnalyticsData.totalFootFall} />
                  <StatCard label="Total Admissions" value={userAnalyticsData.totalAdmissions} />
                </div>
              </div>

              <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Remark</h4>
                  <Input
                    type="text"
                    value={analyticsRemark}
                    onChange={(e) => setAnalyticsRemark(e.target.value)}
                    placeholder="Enter your analytics remark..."
                  />
                </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <FaCircleExclamation className="text-red-500" />
              Failed to load analytics data.
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 sm:justify-end mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="font-inter text-sm ring ring-purple-400 text-purple-600 px-10" onClick={handleSave}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const iconsMap: Record<string, any> = {
  'Total Calls': <Phone className="size-5 text-purple-600" />,
  'New Lead Calls': <PhoneIncoming className="size-5 text-green-600" />,
  'Active Lead Calls': <PhoneOutgoing className="size-5 text-blue-600" />,
  'Non-Active Lead Calls': <PhoneOff className="size-5 text-red-600" />,
  'Total Footfall': <Footprints className="size-5 text-amber-600" />,
  'Total Admissions': <GraduationCap className="size-5 text-fuchsia-600" />
};

const bgMap: Record<string, string> = {
  'Total Calls': 'bg-purple-50',
  'New Lead Calls': 'bg-green-50',
  'Active Lead Calls': 'bg-blue-50',
  'Non-Active Lead Calls': 'bg-red-50',
  'Total Footfall': 'bg-amber-50',
  'Total Admissions': 'bg-fuchsia-50'
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className={`rounded-lg p-4 shadow-sm border ${bgMap[label] ?? 'bg-gray-50'} flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2">
        {iconsMap[label]}
        <p className="text-sm font-medium text-gray-700">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        <CountUp end={value} duration={1} separator="," />
      </p>
    </div>
  );
}
