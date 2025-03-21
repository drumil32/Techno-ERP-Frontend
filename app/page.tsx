'use client';

import useAuth from '@/hooks/useAuth';

import AppLayout from '@/components/layout/app-layout';

export default function Home() {
    const user = useAuth();

    if (!user) return null;
    return (
        <AppLayout/>
    );
}
