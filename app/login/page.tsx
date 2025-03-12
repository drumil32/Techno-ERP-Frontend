"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL
            console.log(apiUrl)
            const res = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Invalid credentials");

            return res.json();
        },
        onSuccess: (data) => {
            console.log(data)
            Cookies.set("authToken", data.token)
            router.push("/");
        },
        onError: () => {
            setError("Invalid email or password");
        },
    });


    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
                className="p-6 bg-white rounded-xl shadow-lg w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label>Email</label>
                    <Input type="email" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <label>Password</label>
                    <Input type="password" {...register("password")} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    )
}
