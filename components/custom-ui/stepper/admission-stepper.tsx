'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AdmissionStep } from '@/common/constants/admissionSteps'; 

interface AdmissionStepperProps {
  steps: AdmissionStep[];
  currentStepPath?: string; 
  className?: string;
}

export function AdmissionStepper({ steps, currentStepPath, className }: AdmissionStepperProps) {
  const currentStepIndex = React.useMemo(() => {
    const index = steps.findIndex(step => step.path === currentStepPath);
    return index >= 0 ? index : 0;
  }, [steps, currentStepPath]);

  return (
    <nav aria-label="Admission Process Steps" className={cn("w-full", className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <li key={step.id} className={cn("relative flex w-full items-center", { 'justify-start': index > 0 })}>
              {index > 0 && (
                <div
                  className={cn(
                    "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-full",
                    isCompleted || isCurrent ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                  )}
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 dark:ring-offset-background",
                    isUpcoming && "border border-gray-300 bg-background text-gray-500 dark:border-gray-700 dark:text-gray-400"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </span>
                <span
                  className={cn(
                    "text-xs text-center mt-1",
                     isCurrent ? "font-semibold text-primary" : "text-muted-foreground"
                  )}
                  style={{ minWidth: '80px' }} 
                >
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}