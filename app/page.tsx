'use client';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.roles?.length) {
      redirect('/auth/login'); // or your default fallback route
    }

    // Find first role that has a valid home page
    for (const role of user.roles) {
      const homePage = getHomePage(role);
      console.log(homePage)
      if (homePage) {
        redirect(homePage);
      }
    }

    // If no valid home page found for any role
    redirect('/auth/login'); // or your default fallback route
  }, [user]);

  return null; // or a loading spinner
}
