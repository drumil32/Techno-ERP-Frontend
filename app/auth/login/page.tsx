'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { redirect, useRouter } from 'next/navigation';
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
  CalendarCheck,
  BookOpen,
  Building,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import Image from 'next/image';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import useAuthStore from '@/stores/auth-store';
import { AuthResponse } from '@/types/auth';
import { useHomeContext } from '@/app/c/HomeRouteContext';
import { getHomePage } from '@/lib/enumDisplayMapper';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { setHomeRoute } = useHomeContext()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % 3);
    }, 5000);

    const handleMouseMove = (e: any) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

      document.cookie = `is-authenticated=true; path=/; max-age=${15 * 24 * 60 * 60}; secure; samesite=strict`;

      login({
        name: response.userData.name,
        email: response.userData.email,
        roles: response.roles,
        accessToken: response.token
      });

      for (const role of response.roles) {
        const homePage = getHomePage(role);
        if (homePage) {
          setHomeRoute(homePage)
          return router.push(homePage);
        }
      }

      // router.push(SITE_MAP.HOME.DEFAULT);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Phone className="w-4 h-4 text-white" />,
      text: 'Leads',
      bg: 'from-blue-500 to-blue-600',
      animDelay: 0.1
    },
    {
      icon: <UserCheck className="w-4 h-4 text-white" />,
      text: 'Admissions',
      bg: 'from-purple-500 to-purple-600',
      animDelay: 0.2
    },
    {
      icon: <Users className="w-4 h-4 text-white" />,
      text: 'Staff',
      bg: 'from-pink-500 to-pink-600',
      animDelay: 0.3
    },
    {
      icon: <CreditCard className="w-4 h-4 text-white" />,
      text: 'Payments',
      bg: 'from-indigo-500 to-indigo-600',
      animDelay: 0.4
    },
    {
      icon: <LineChart className="w-4 h-4 text-white" />,
      text: 'Analytics',
      bg: 'from-green-500 to-green-600',
      animDelay: 0.5
    },
    {
      icon: <CalendarCheck className="w-4 h-4 text-white" />,
      text: 'Scheduling',
      bg: 'from-yellow-500 to-yellow-600',
      animDelay: 0.6
    }
  ];

  const animations = [
    {
      title: 'Enhance Outreach',
      subtitle: 'Boost enrollment with intelligent lead tracking',
      color: 'text-blue-300'
    },
    {
      title: 'Streamline Admissions',
      subtitle: 'Simplify the entire application process',
      color: 'text-purple-300'
    },
    {
      title: 'Maximize Growth',
      subtitle: 'Scale your institution with data-driven insights',
      color: 'text-teal-300'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-full lg:w-1/2 p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: [
              `calc(10% + ${mousePosition.x / 100}px) calc(10% + ${mousePosition.y / 100}px)`,
              `calc(90% + ${mousePosition.x / 100}px) calc(90% + ${mousePosition.y / 100}px)`
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("/api/placeholder/1600/900")',
            backgroundSize: '120%',
            filter: 'blur(120px) opacity(0.15)',
            backgroundBlendMode: 'soft-light'
          }}
        />

        <div className="absolute inset-0">
          <motion.div
            className="absolute w-96 h-96 rounded-full filter blur-3xl opacity-20 bg-blue-400 mix-blend-multiply"
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.2, 0.8, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full filter blur-3xl opacity-20 bg-purple-400 mix-blend-multiply"
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 40, -40, 0],
              scale: [1, 0.9, 1.3, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{ bottom: '10%', right: '10%' }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full filter blur-3xl opacity-20 bg-pink-400 mix-blend-multiply"
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, -40, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
            style={{ top: '40%', left: '40%' }}
          />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-10 h-10 relative"
            >
              <Image
                src="/images/techno-logo.webp"
                alt="Techno ERP Logo"
                fill
                className="object-contain bg-white rounded-full shadow-lg"
              />
            </motion.div>
            <span className="text-xl font-bold text-white tracking-tight">Techno ERP</span>
          </motion.div>

          <div className="flex-grow flex flex-col justify-center py-6 overflow-y-auto">
            <div className="max-w-lg mx-auto">
              <motion.div
                key={currentAnimation}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                  {animations[currentAnimation].title}
                  <br />
                  <span className={animations[currentAnimation].color}>
                    {animations[currentAnimation].subtitle}
                  </span>
                </h1>

                <p className="text-base text-blue-100 mb-6">
                  An all-in-one Lead Tracking & ERP solution designed specifically for ambitious
                  educational institutions.
                </p>
              </motion.div>

              <div className="grid grid-cols-3 gap-3">
                {features.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.animDelay, duration: 0.5 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className={`bg-gradient-to-r ${item.bg} p-3 rounded-xl shadow-lg flex flex-col items-center gap-2 text-white hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">{item.icon}</div>
                    <span className="font-medium text-center text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center text-sm text-white/70 mt-4"
          >
            <div className="mb-1">
              Powered by{' '}
              <a
                className="underline hover:text-white transition-colors"
                target="_blank"
                rel="noopener"
                href="https://www.sprintup.in"
              >
                SprintUp
              </a>
            </div>
            <div className="flex justify-center mt-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Image
                  src="/images/sprintup-logo-light.png"
                  alt="SprintUp Logo"
                  width={50}
                  height={50}
                  className="object-contain shadow-lg rounded-full"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="md:w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-100 bg-white/80 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/30 to-purple-50/30 z-0"></div>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              >
                <div className="w-16 h-16 relative">
                  <Image
                    src="/images/techno-logo.webp"
                    alt="Techno ERP Logo"
                    fill
                    className="object-contain shadow-lg rounded-full"
                  />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
              <p className="text-muted-foreground text-sm">Sign in to your educational dashboard</p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-indigo-500" />
                    </div>
                    <Input
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email address"
                      className="pl-10 py-2 text-sm rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 group-hover:border-indigo-300 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-500" />
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 py-2 text-sm rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 group-hover:border-indigo-300 transition-all"
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
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
                        )}
                      </motion.div>
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* <motion.div
                className="flex justify-end mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <a
                  href="#"
                  className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Forgot password?
                </a>
              </motion.div> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                    <motion.span
                      className="flex items-center justify-center gap-2 text-sm"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      Sign In <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6 text-xs text-gray-500"
            >
              New to TechnoERP?{' '}
              <a
                href="#"
                className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
              >
                Request Access
              </a>
            </motion.div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
