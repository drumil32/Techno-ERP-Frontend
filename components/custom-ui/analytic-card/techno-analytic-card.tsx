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
    <Card className="w-full shadow-sm border border-gray-200">
      <CardContent className="flex flex-col">
        <h1 className={`text-4xl font-bold ${color}`}>{heading}</h1>
        <p className="text-sm text-gray-500 my-2">{subheading}</p>
        <h2 className={`text-lg font-semibold mt-2 ${color}`}>{title}</h2>
      </CardContent>
    </Card>
  );
}
