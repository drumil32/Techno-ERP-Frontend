'use client';
import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AdmissionCardProps {
    heading: string;
    subheading: string;
    color?: string;
    children?: ReactNode
}

export default function AdmissionCard({
    heading,
    subheading,
    color = 'text-gray-900',
    children
}: AdmissionCardProps) {
    return (
        <Card className="p-0 w-[353px] shadow-sm border-[1px] rounded-[10px] border-gray-200 ">
            <CardContent className="flex flex-col gap-[24px] p-[24px]">
                <div className='  mt-[8px] flex w-max flex-col gap-[4px] '>
                    <div className={`h-[30px] leading-[100%] font-[700] text-[16px] text-[#4E4E4E]`}>{heading}</div>
                    <div className="text-[12px] h-[15px] font-[400] text-[#4E4E4E] ">{subheading}</div>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}
