"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useAuth = () => {
    const [user, setUser] = useState<{ isAuthenticated: boolean } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("authToken");

        if (!token) {
            router.replace("/auth/login");
        } else {
            try {
                setUser({ isAuthenticated: true });
                if (window.location.pathname === "/auth/login") {
                    router.replace("/");
                }
            } catch (error) {
                console.log(error)
                Cookies.remove("authToken");
                router.replace("/auth/login");
            }
        }
    }, [router]);

    return user;
};

export default useAuth;

