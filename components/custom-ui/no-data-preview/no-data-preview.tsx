import { animate, hover, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bird, Search, RefreshCw } from 'lucide-react';
interface NoDataPreviewProps {
  message?: string;
  className?: string;
}

export function NoDataPreview({
  message = 'No data available for the selected period.',
  className = ''
}: NoDataPreviewProps) {
  return (
    <div className={`flex flex-col mx-auto items-center justify-center space-y-4 p-8 ${className}`}>
      <div className="relative">
        <motion.div>
          <Bird className="h-20 w-20 text-muted-foreground" />
        </motion.div>
        <motion.div
          className="absolute -right-2 -bottom-2"
          animate={{
            rotate: 360,
            x: [0, -5, 0, 5, 0],
            y: [0, -5, 0, 5, 0]
          }}
          transition={{
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            },
            x: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatType: 'reverse'
            }
          }}
        >
          <Search className="h-10 w-10 text-primary" />
        </motion.div>
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium text-foreground">No Data Found in the Wild</h3>
        <p className="text-muted-foreground max-w-md">
          {message} Our wise owl couldn't find any matching records. Try adjusting your filters.
        </p>
      </div>
    </div>
  );
}
