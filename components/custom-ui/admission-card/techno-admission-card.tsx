// src/components/custom-ui/admission-card/techno-admission-card.tsx (or wherever AdmissionCard is defined)
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AdmissionCardProps {
    heading: string;
    subheading: string;
    color?: string; // Note: This prop isn't currently used in the styles
    children?: ReactNode;
    icon?: ReactNode; // <-- Add this line
}

export default function AdmissionCard({
    heading,
    subheading,
    color = 'text-gray-900',
    children,
    icon 
}: AdmissionCardProps) {
    return (
        <Card className="p-0 w-[353px] shadow-sm border-[1px] rounded-[10px] border-gray-200 ">
            <CardContent className="flex flex-col gap-[24px] p-[24px]">

                <div className='mt-[8px] flex flex-col gap-[4px]'>
                    <div className="flex flex-col gap-2">
                        {icon && <span className="flex-shrink-0">{icon}</span>} {/* Conditionally render icon */}
                        <div className={`h-[30px] flex items-center leading-[100%] font-[700] text-[16px] text-[#4E4E4E]`}>{heading}</div>
                    </div>
                    <div className={`text-[12px] h-[15px] font-[400] text-[#4E4E4E] ${icon ? 'pl-[calc(icon_width+gap)]' : ''}`}> {/* Adjust pl based on icon size+gap if needed, or restructure */}
                       {subheading}
                    </div>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}