'use client';
import { Card, CardContent } from '@/components/ui/card';

interface TechnoAnalyticCardProps {
  heading: string;
  subheading: string;
  title: string;
  color?: string;
}

// TODO: Update UI of the card to match the figma
export default function TechnoAnalyticCard({
  heading,
  subheading,
  title,
  color = 'text-gray-900'
}: TechnoAnalyticCardProps) {
  return (
    <Card className="p-0 w-[145px] h-[88px] shadow-sm border-[1px] rounded-[10px] border-gray-200 ">
      <CardContent className=" px-[8px]">
        <div className="  mt-[8px] flex w-max flex-col gap-[6px] ">
          <div className={`h-[30px] mx-auto  leading-[100%] font-[700] text-[25px]   ${color}`}>
            {Intl.NumberFormat().format(Number(heading))}
          </div>
          <div className="text-[12px] h-[15px] text-[#666666] font-[400]">{subheading}</div>
        </div>
        <div className={`text-[12px] mt-[6px]  font-[600] ${color}`}>{title}</div>
      </CardContent>
    </Card>
  );
}
