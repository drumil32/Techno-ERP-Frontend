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
    <Card className="p-0 w-[150px] h-[88px] shadow-sm border border-gray-200 pt-0 ">
      <CardContent  className="px-[8px]">
        <div className='flex flex-col gap-[6px]'>
        <h1 className={`text-[25px] font-bold ${color}`}>{heading}</h1>
        <p className="text-[12px] text-gray-500 ">{subheading}</p>
        </div>
        <h2 className={`text-[12px] font-semibold  ${color}`}>{title}</h2>
      </CardContent>
    </Card>
  );
}
