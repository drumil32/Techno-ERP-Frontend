'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.isAuthenticated, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (data &&
          data.MESSAGE === "User is authenticated" &&
          data.SUCCESS === true) {
          console.log("User is authenticated, redirecting to home");
          router.replace("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuthStatus();

  }, [router]);
};

export default useAuthRedirect;