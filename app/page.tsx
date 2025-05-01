'use client';
import useAuthRedirect from '@/lib/useAuthRedirect';
import { redirect } from 'next/navigation';

export default function Home() {
  useAuthRedirect();
  redirect('/c/marketing/all-leads');
}
