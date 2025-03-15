import React from 'react';

interface TechnoIconProps {
  type?: 'button';
  children: React.ReactNode;
  className?: string;
}

export default function TechnoIcon({ type, children, className = '' }: TechnoIconProps) {
  return (
    <div
      className={`flex items-center justify-center ${type === 'button' ? 'bg-white text-primary rounded-lg p-2' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
