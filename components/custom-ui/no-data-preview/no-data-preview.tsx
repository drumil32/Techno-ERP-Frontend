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
        <Bird className="h-20 w-20 text-muted-foreground" />
        <Search className="absolute -right-2 -bottom-2 h-10 w-10 text-primary" />
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
