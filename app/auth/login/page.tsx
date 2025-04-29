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
  Eye,
  EyeOff,
  Phone,
  UserCheck,
  Users,
  CreditCard,
  LineChart,
  CalendarCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthRedirect from '@/lib/useAuthRedirect';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import Image from 'next/image';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import useAuthStore from '@/stores/auth-store';
import { AuthResponse } from '@/types/auth';

export default function LoginPage() {
  useAuthRedirect();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

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
      const response = (await apiRequest(
        API_METHODS.POST,
        API_ENDPOINTS.login,
        data
      )) as AuthResponse;
      if (!response) return;

      login({
        name: response.userData.name,
        email: response.userData.email,
        roles: response.roles,
        accessToken: response.token
      });

      router.push(SITE_MAP.HOME.DEFAULT);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:w-full lg:w-1/2 p-4 md:p-8 lg:p-12 bg-gradient-to-br from-indigo-900 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8 lg:mb-12">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 relative">
              <Image
                src="/images/techno-logo.png"
                alt="Techno ERP Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg md:text-xl lg:text-2xl font-bold text-white">Techno ERP</span>
          </div>

          <div className="flex-grow flex flex-col justify-center py-4 md:py-6">
            <div className="max-w-lg mx-auto">
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 lg:mb-6 leading-tight">
                Simplify Telecalling.
                <br />
                Boost Admissions.
                <br />
                <span className="text-blue-300">Grow Your College.</span>
              </h1>

              <p className="text-sm md:text-base lg:text-lg text-blue-100 mb-4 md:mb-6 lg:mb-8">
                An all-in-one Lead Tracking & ERP solution designed for aspirational colleges.
              </p>

              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8 lg:mb-12">
                {[
                  {
                    icon: <Phone className="w-4 h-4 text-white" />,
                    text: 'Leads',
                    bg: 'from-blue-500 to-blue-600'
                  },
                  {
                    icon: <UserCheck className="w-4 h-4 text-white" />,
                    text: 'Admissions',
                    bg: 'from-purple-500 to-purple-600'
                  },
                  {
                    icon: <Users className="w-4 h-4 text-white" />,
                    text: 'Staff',
                    bg: 'from-pink-500 to-pink-600'
                  },
                  {
                    icon: <CreditCard className="w-4 h-4 text-white" />,
                    text: 'Payments',
                    bg: 'from-indigo-500 to-indigo-600'
                  },
                  {
                    icon: <LineChart className="w-4 h-4 text-white" />,
                    text: 'Analytics',
                    bg: 'from-green-500 to-green-600'
                  },
                  {
                    icon: <CalendarCheck className="w-4 h-4 text-white" />,
                    text: 'Scheduling',
                    bg: 'from-yellow-500 to-yellow-600'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    className={`bg-gradient-to-r ${item.bg} p-2 md:p-3 rounded-lg shadow-md flex flex-col items-center gap-1 md:gap-2 text-white`}
                  >
                    <div className="p-1 md:p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                      {item.icon}
                    </div>
                    <span className="font-medium text-center text-xs md:text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-row gap-2 md:gap-3">
                <Button className="bg-white text-indigo-800 hover:bg-gray-100 font-semibold text-xs md:text-sm py-1.5 md:py-2 lg:py-3 flex-1 rounded-lg">
                  Get Started
                </Button>
                <a target="_blank" href="https://www.sprintup.in" className="flex-1">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white  font-semibold text-xs md:text-sm py-1.5 md:py-2 lg:py-3 w-full rounded-lg"
                  >
                    Live Demo
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-4 md:mt-auto pt-4 md:pt-6"
          >
            <span className="text-lg text-center text-white/70">
              Powered by{' '}
              <a className="underline" target="_blank" href="https://www.sprintup.in">
                {' '}
                SprintUp{' '}
              </a>
            </span>
            <motion.div whileHover={{ scale: 1.05 }} className=" relative">
              <Image
                src="/images/sprintup-logo-light.png"
                alt="SprintUp Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="md:w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-xl shadow-lg p-4 md:p-6 lg:p-8 border border-gray-100"
        >
          <div className="text-center mb-4 md:mb-5 lg:mb-6">
            <div className="flex justify-center mb-2 md:mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 relative">
                <Image
                  src="/images/techno-logo.png"
                  alt="Techno ERP Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-3 md:space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 bg-red-50 text-red-600 rounded-lg text-xs md:text-sm flex items-center gap-2"
              >
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
              </motion.div>
            )}

            <div className="space-y-2 md:space-y-3">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email address"
                    className="pl-10 py-2 text-xs md:text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 py-2 text-xs md:text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <motion.div
                      animate={{ scale: showPassword ? 1.1 : 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </motion.div>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs md:text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-xs md:text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div> */}

            <Button
              type="submit"
              className="w-full mt-5 py-2 md:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 text-xs md:text-sm">
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
                <span className="flex items-center justify-center gap-2 text-xs md:text-sm">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <p className="text-xs md:text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up now
              </a>
            </p>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
}
