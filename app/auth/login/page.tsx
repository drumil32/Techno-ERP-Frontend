'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import loginSchema from './login-form-schema';
import { apiRequest } from '@/lib/apiClient';
import {
  Mail,
  Lock,
  ArrowRight,
  Phone,
  UserCheck,
  BookOpen,
  LineChart,
  CalendarCheck,
  CreditCard,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthRedirect from '@/lib/useAuthRedirect';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import Image from 'next/image';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';

export default function LoginPage() {
  useAuthRedirect();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest(API_METHODS.POST, API_ENDPOINTS.login, data);
      if (!response) return;
      router.push(SITE_MAP.HOME.DEFAULT);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <div className="lg:w-1/2 p-6 lg:p-12 bg-gradient-to-br from-indigo-900 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 lg:mb-12">
            <div className="w-10 h-10 lg:w-12 lg:h-12 relative">
              <Image
                src="/images/techno-logo.png"
                alt="Techno ERP Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-white">Techno ERP</span>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <div className="max-w-lg mx-auto">
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                Simplify Telecalling.
                <br />
                Boost Admissions.
                <br />
                <span className="text-blue-300">Grow Your College.</span>
              </h1>

              <p className="text-sm lg:text-lg text-blue-100 mb-6 lg:mb-8">
                An all-in-one Lead Tracking & ERP solution designed for aspirational colleges.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 lg:mb-12">
                {[
                  {
                    icon: <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-white" />,
                    text: 'Leads',
                    bg: 'from-blue-500 to-blue-600'
                  },
                  {
                    icon: <UserCheck className="w-4 h-4 lg:w-5 lg:h-5 text-white" />,
                    text: 'Admissions',
                    bg: 'from-purple-500 to-purple-600'
                  },
                  {
                    icon: <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />,
                    text: 'Staff',
                    bg: 'from-pink-500 to-pink-600'
                  },
                  {
                    icon: <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-white" />,
                    text: 'Payments',
                    bg: 'from-indigo-500 to-indigo-600'
                  },
                  {
                    icon: <LineChart className="w-4 h-4 lg:w-5 lg:h-5 text-white" />,
                    text: 'Analytics',
                    bg: 'from-green-500 to-green-600'
                  },
                  {
                    icon: <CalendarCheck className="w-4 h-4 lg:w-5 lg:h-5 text-white" />,
                    text: 'Scheduling',
                    bg: 'from-yellow-500 to-yellow-600'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    className={`bg-gradient-to-r ${item.bg} p-3 rounded-lg shadow-md flex flex-col items-center gap-2 text-white text-xs lg:text-sm`}
                  >
                    <div className="p-1.5 lg:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      {item.icon}
                    </div>
                    <span className="font-medium text-center">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-white text-indigo-800 hover:bg-gray-100 font-semibold text-sm py-2 px-4 lg:py-3 lg:px-6 rounded-lg">
                  Get Started
                </Button>
                <a target="_blank" href="https://www.sprintup.in">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10 font-semibold text-sm py-2 px-4 lg:py-3 lg:px-6 rounded-lg"
                  >
                    Live Demo
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100"
        >
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/images/techno-logo.png"
                  alt="Techno ERP Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {error && (
              <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-xs lg:text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="your@email.com"
                    className="pl-10 py-2 lg:py-2.5 text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className="pl-10 py-2 lg:py-2.5 text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* <div className="mt-4 text-center text-xs lg:text-sm text-gray-600">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Forgot password?
            </a>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
}
