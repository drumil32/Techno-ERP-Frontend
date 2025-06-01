'use client';

export function DevBadge() {
  if (process.env.NEXT_ENV !== 'development') return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[1000] backdrop-blur-md bg-red-500/80 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-pulse font-medium">
      DEV MODE
    </div>
  );
}
