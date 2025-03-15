import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      <p className="ml-2 text-xl font-semibold">Loading...</p>
    </div>
  );
}
