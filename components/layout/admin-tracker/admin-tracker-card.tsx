'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminTrackerCardProps {
  heading: string;
  subheading: string;
  title: string;
  color?: string;
  trend?: 'up' | 'down';
  trendPercentage?: number;
  icon?: React.ReactNode;
}

export default function AdminTrackerCard({
  heading,
  subheading,
  title,
  color = 'text-gray-900',
  trend = 'up',
  trendPercentage = 0,
  icon
}: AdminTrackerCardProps) {
  const isUp = trend === 'up';
  const TrendIcon = isUp ? ArrowUp : ArrowDown;
  const trendColor = isUp ? 'text-emerald-500' : 'text-rose-500';

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400 }}>
      <Card className="w-[240px]  border-white/50 shadow-md hover:shadow-lg bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all">
        <CardHeader className="flex flex-row items-center justify-between  space-y-0">
          <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {subheading}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className={cn('text-3xl font-bold mb-1', color)}>
            <CountUp
              enableScrollSpy
              end={Number(heading)}
              duration={2.5}
              formattingFn={(value) => new Intl.NumberFormat().format(value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className={cn('text-sm font-medium', color)}>{title}</p>
            {trendPercentage > 0 && (
              <span className={cn('text-xs font-semibold flex items-center', trendColor)}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {trendPercentage}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
