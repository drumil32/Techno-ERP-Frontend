'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Users,
  FileText,
  PhoneCall,
  Bookmark,
  ClipboardList,
  BarChart2,
  Mail,
  UserCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TechnoLoader() {
  const [activeIcon, setActiveIcon] = useState(0);
  const [progressText, setProgressText] = useState('Initializing system');

  const icons = [
    <GraduationCap key={0} className="w-12 h-12" />,
    <BookOpen key={1} className="w-12 h-12" />,
    <Users key={2} className="w-12 h-12" />,
    <FileText key={3} className="w-12 h-12" />,
    <PhoneCall key={4} className="w-12 h-12" />,
    <Bookmark key={5} className="w-12 h-12" />,
    <ClipboardList key={6} className="w-12 h-12" />,
    <BarChart2 key={7} className="w-12 h-12" />,
    <Mail key={8} className="w-12 h-12" />,
    <UserCheck key={9} className="w-12 h-12" />
  ];

  const progressMessages = [
    'Loading admission modules...',
    'Processing student records...',
    'Tracking telecalling leads...',
    'Generating enrollment reports...',
    'Calculating exam results...',
    'Syncing attendance data...',
    'Preparing academic dashboard...',
    'Verifying application forms...',
    'Organizing course schedules...',
    'Finalizing student portals...'
  ];

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 1200);

    const textInterval = setInterval(() => {
      setProgressText(progressMessages[Math.floor(Math.random() * progressMessages.length)]);
    }, 2000);

    return () => {
      clearInterval(iconInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="relative px-4">
        <div className="relative  w-xs h-xs  aspect-square flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <motion.div
            className="absolute w-30 h-30 rounded-full border-4 border-white/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <motion.div
            key={activeIcon}
            className="absolute z-10 text-white flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1.1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 20
            }}
          >
            {icons[activeIcon]}
          </motion.div>
        </div>

        <div className="mt-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h2
              className="text-2xl font-bold text-indigo-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text "
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              Techno ERP Loading
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                ...
              </motion.span>
            </motion.h2>

            <motion.p
              className="text-sm font-medium text-indigo-600/90 tracking-wide"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            >
              {progressText}
            </motion.p>
          </motion.div>

          <div className="mt-6 relative h-1.5 bg-indigo-100/80 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: ['0%', '30%', '70%', '100%'] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <motion.div
                className="absolute right-0 top-0 h-full w-1 bg-white"
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
