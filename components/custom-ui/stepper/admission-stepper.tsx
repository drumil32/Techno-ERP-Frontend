'use client';

import * as React from 'react';
import { Check, Circle, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdmissionStep } from '@/common/constants/admissionSteps';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function AdmissionStepper({
  steps,
  currentStepPath,
  applicationCurrentStatus,
  className,
  applicationId
}: AdmissionStepperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isNewApplicationPath = pathname.includes('/c/admissions/application-process/new');
  const currentStepIndex = steps.findIndex((step) => step.path === currentStepPath) || 0;
  const maxAccessibleStep = Math.max(applicationCurrentStatus - 1, 0);

  const handleStepClick = (stepPath: string, index: number) => {
    if (isNewApplicationPath) return;
    if (index <= maxAccessibleStep) {
      router.push(`/c/admissions/application-process/ongoing/${applicationId}/${stepPath}`);
    }
  };

  const maxStepNameHeight = steps.reduce((max, step) => {
    const lineCount = step.name.split(' ').length > 3 ? 2 : 1;
    return Math.max(max, lineCount);
  }, 1);

  return (
    <nav aria-label="Admission Process Steps" className={cn('w-full', className)}>
      <ol className="flex items-end">
        {steps.map((step, index) => {
          const isCompleted = index < applicationCurrentStatus;
          const isCurrent = index === currentStepIndex;
          const isAccessible = !isNewApplicationPath && index <= maxAccessibleStep;
          const isUpcoming = index > maxAccessibleStep;
          const isApplicationCurrent = index === applicationCurrentStatus - 1;

          return (
            <li key={step.id} className="relative w-full">
              {index > 0 && (
                <div className="absolute left-0 top-[calc(50%+20px)] -translate-x-1/2 -translate-y-1/2 h-[2px] w-full pointer-events-none">
                  <div
                    className={cn(
                      'absolute h-full w-full',
                      isCompleted ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                </div>
              )}

              <div className="relative z-30 flex flex-col items-center">
                <div
                  className={cn(
                    'text-xs font-medium text-center min-h-[40px] flex items-end pb-1',
                    isCurrent
                      ? 'text-primary font-bold'
                      : isCompleted
                        ? 'text-primary'
                        : 'text-muted-foreground',
                    isAccessible && 'cursor-pointer hover:text-primary',
                    isNewApplicationPath && 'cursor-default'
                  )}
                >
                  <span>{step.name}</span>
                </div>

                <motion.div
                  className="relative mt-1"
                  whileHover={isAccessible ? { scale: 1.1 } : {}}
                  whileTap={isAccessible ? { scale: 0.95 } : {}}
                  onClick={() => handleStepClick(step.path, index)}
                  style={{
                    cursor: isAccessible ? 'pointer' : 'default',
                    pointerEvents: isNewApplicationPath ? 'none' : 'auto'
                  }}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center rounded-full text-xs font-medium relative',
                      isCompleted && 'bg-primary text-white',
                      isCurrent &&
                        'bg-primary text-white border-4 border-white dark:border-gray-900 shadow-lg',
                      isApplicationCurrent &&
                        'bg-white text-primary border-4 border-primary shadow-lg',
                      isUpcoming &&
                        'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600',
                      'h-10 w-10'
                    )}
                    style={{
                      boxShadow: isCurrent ? '0 4px 20px -5px rgba(0, 100, 255, 0.3)' : 'none'
                    }}
                  >
                    {isCompleted ? (
                      isApplicationCurrent ? (
                        <Circle className="h-5 w-5 text-primary" strokeWidth={3} />
                      ) : (
                        <Check className="h-5 w-5" strokeWidth={3} />
                      )
                    ) : isCurrent ? (
                      <ChevronRight className="h-5 w-5" strokeWidth={3} />
                    ) : isUpcoming ? (
                      <Lock className="h-4 w-4 text-gray-400" strokeWidth={2.5} />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{step.id}</span>
                    )}
                  </span>
                </motion.div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface AdmissionStepperProps {
  steps: AdmissionStep[];
  currentStepPath?: string;
  applicationCurrentStatus: number;
  className?: string;
  applicationId: string;
}
