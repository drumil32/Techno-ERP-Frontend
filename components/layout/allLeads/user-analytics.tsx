import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { UserAnalyticsData } from '@/types/marketing';
import { useQuery } from '@tanstack/react-query';
import { ChartBar, ChartPie, AlertTriangle, BarChart3, UserPlus, UserCheck, UserX, UserCheck2, UserPlus2, UserX2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchUserAnalytics, updateAnalyticsRemarks } from './helpers/fetch-data';
import CountUp from 'react-countup';
import {

  Footprints,
  GraduationCap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type StatCardProps = {
  label: keyof typeof iconsMap;
  value: number;
};

const iconsMap = {
  'Total Leads Reached': BarChart3,      
  'New Lead': UserPlus2,                     
  'Active Lead': UserCheck2,                 
  'Non-Active Lead': UserX2,                 
  'Total Footfall': Footprints,          
  'Total Admissions': GraduationCap        
} as const;

const bgMap = {
  'Total Leads Reached': 'bg-purple-50',
  'New Lead': 'bg-green-50',
  'Active Lead': 'bg-blue-50',
  'Non-Active Lead': 'bg-red-50',
  'Total Footfall': 'bg-amber-50',
  'Total Admissions': 'bg-fuchsia-50'
} as const;

function StatCard({ label, value }: StatCardProps) {
  const Icon = iconsMap[label];
  const bgColor = bgMap[label] ?? 'bg-gray-50';

  return (
    <div className={`rounded-lg p-4 shadow-sm border ${bgColor} flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        <Icon className="size-5" />
        <p className="text-sm font-medium text-gray-700">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        <CountUp end={value} duration={1} separator="," />
      </p>
    </div>
  );
}

export default function UserAnalytics() {
  const [open, setOpen] = useState(false);
  const [analyticsRemark, setAnalyticsRemark] = useState('');

  const {
    data: userAnalyticsData,
    isLoading,
    isError
  } = useQuery<UserAnalyticsData>({
    queryKey: ['user-analytics'],
    queryFn: fetchUserAnalytics,
    enabled: open,
    retry: 0,
    staleTime: 0
  });

  const handleSave = async () => {
    try {
      await updateAnalyticsRemarks({ analyticsRemark });
      toast.success('Successfully saved remarks.');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to save remarks.');
    }
  };

  useEffect(() => {
    if (userAnalyticsData?.analyticsRemark) {
      setAnalyticsRemark(userAnalyticsData.analyticsRemark);
    }
  }, [userAnalyticsData]);

  return (
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

        {isLoading ? (
          <div className="text-sm text-gray-500 py-4">Loading analytics...</div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertTriangle className="text-red-500 size-5" />
            Failed to load analytics data. Please try again.
          </div>
        ) : userAnalyticsData ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Call Analytics</h4>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Leads Reached" value={userAnalyticsData.totalCalls} />
                <StatCard label="New Lead" value={userAnalyticsData.newLeadCalls} />
                <StatCard label="Active Lead" value={userAnalyticsData.activeLeadCalls} />
                <StatCard
                  label="Non-Active Lead"
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
        ) : null}

        <DialogFooter className="flex justify-end gap-2 sm:justify-end mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="font-inter text-sm ring ring-purple-400 text-purple-600 px-10"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
