'use client';
import { Card, CardContent } from '@/components/ui/card';

interface TechnoAnalyticCardProps {
  number: number;
  percentage: string;
  title: string;
  color?: string;
}

// TODO: Update UI of the card to match the figma
export default function TechnoAnalyticCard({
  number,
  percentage,
  title,
  color = 'text-gray-900'
}: TechnoAnalyticCardProps) {
  return (
    <Card className="w-full shadow-md border border-gray-200">
      <CardContent className="flex flex-col">
        <h1 className={`text-4xl font-bold ${color}`}>{number}</h1>
        <p className="text-sm text-gray-500 my-2">{percentage}</p>
        <h2 className="text-lg font-semibold mt-2">{title}</h2>
      </CardContent>
    </Card>
  );
}
