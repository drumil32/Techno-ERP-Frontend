'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  Microscope,
  Atom,
  TestTube2,
  Calculator,
  Library,
  Home
} from 'lucide-react';
import { Rocket, Satellite, Orbit, Ghost, WifiOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function TechnoNotFound() {
  const router = useRouter();

  const particles = Array.from({ length: 30 });
  const academicIcons = [BookOpen, GraduationCap, Microscope, Atom, TestTube2, Calculator, Library];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((_, i) => {
          const IconComponent = academicIcons[Math.floor(Math.random() * academicIcons.length)];
          return (
            <motion.div
              key={i}
              className="absolute text-white/20"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                rotate: Math.random() * 360,
                opacity: Math.random() * 0.3 + 0.1
              }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                rotate: Math.random() * 360,
                transition: {
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              <IconComponent size={Math.random() * 24 + 16} />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full bg-gradient-to-br from-gray-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/30 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/30 rounded-full filter blur-3xl"></div>

        <div className="relative z-10 text-center">
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative bg-white rounded-full w-32 h-32">
              <Image
                src="/images/techno-logo.webp"
                alt="Techno ERP Logo"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center bg-red-500/20 border border-red-500/50 rounded-full p-4"
            >
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </motion.div>
          </div> */}

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold  text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 mb-4"
          >
            Something Went Wrong
          </motion.h1>

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-white mb-6"
          >
            Lost in Digital Space
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 mb-8 max-w-lg mx-auto"
          >
            The page you're looking for has been abducted by aliens, drifted into a black hole, or
            never existed in the first place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="mr-2" /> Return Home
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center"
            >
              <Satellite className="w-8 h-8 text-white mb-2" />
              <span className="text-xs text-gray-300">Satellite Lost</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center"
            >
              <WifiOff className="w-8 h-8 text-white mb-2" />
              <span className="text-xs text-gray-300">Signal Dropped</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center"
            >
              <Ghost className="w-8 h-8 text-white mb-2" />
              <span className="text-xs text-gray-300">Ghost Page</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
