import { Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { Course } from '@/types/enum';

const courseOptions = [
  { id: 'ALL', label: 'All' },
  ...Object.values(Course).map((course) => ({
    id: course,
    label: course
  }))
];

export function FinanceSummary() {
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
  };

  return (
    <div className="w-full flex flex-col gap-6 px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="font-semibold text-lg">Financial Summary</div>
      <div className="flex text-sm gap-6 items-center">
        <div>
          <span className="">Timeline: </span>
          <span className="ml-4">
            Until <span className="font-semibold">5th May’25</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Course: </span>
          <span className="ml-4">
            <div className="flex items-center gap-4">
              <Select value={selectedCourse.toString()} onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {courseOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </span>
        </div>
      </div>

      <div className="w-full flex gap-4">
        <SummaryCard totalCollections={100000} percentage={10} label="Total Collections" />
        <SummaryCard totalCollections={100000} percentage={10} label="Total Expected Revenue" />
        <SummaryCard totalCollections={100000} percentage={10} label="Total Remaining Dues" />
      </div>
    </div>
  );
}

export function SummaryCard({
  totalCollections,
  percentage,
  label
}: {
  totalCollections: number;
  percentage: number;
  label: string;
}) {
  return (
    <div className="w-full bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200 py-2 px-3 flex flex-col gap-1.5">
      <p className="flex text-2xl font-bold">₹{totalCollections?.toLocaleString()}</p>
      <p className="flex gap-1.5 text-sm items-center">
        {label}
        <Info className="size-4" />
      </p>
    </div>
  );
}
