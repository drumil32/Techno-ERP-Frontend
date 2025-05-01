import { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  Crown,
  ArrowUpRight,
  Briefcase,
  User as BasicUser,
  MessageSquare,
  ClipboardList,
  GraduationCap,
  School,
  ChevronDown,
  Settings,
  UserCog,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserRoles } from '@/types/enum';
import useAuthStore from '@/stores/auth-store';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const RoleBadge = ({ role }: { role: UserRoles }) => {
  const roleStyles = {
    [UserRoles.ADMIN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    [UserRoles.LEAD_MARKETING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [UserRoles.EMPLOYEE_MARKETING]:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [UserRoles.BASIC_USER]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [UserRoles.COUNSELOR]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    [UserRoles.REGISTAR]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [UserRoles.HOD]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    [UserRoles.INSTRUCTOR]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
  };

  const roleIcons = {
    [UserRoles.ADMIN]: <Crown className="h-3 w-3" />,
    [UserRoles.LEAD_MARKETING]: <ArrowUpRight className="h-3 w-3" />,
    [UserRoles.EMPLOYEE_MARKETING]: <Briefcase className="h-3 w-3" />,
    [UserRoles.BASIC_USER]: <BasicUser className="h-3 w-3" />,
    [UserRoles.COUNSELOR]: <MessageSquare className="h-3 w-3" />,
    [UserRoles.REGISTAR]: <ClipboardList className="h-3 w-3" />,
    [UserRoles.HOD]: <GraduationCap className="h-3 w-3" />,
    [UserRoles.INSTRUCTOR]: <School className="h-3 w-3" />
  };

  const formattedRole = role
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyles[role]}`}
    >
      {roleIcons[role]} {formattedRole}
    </motion.span>
  );
};

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.logout, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      // Clear auth cookie
      document.cookie =
        'is-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

      const data = await res.json();
      if (data && data.SUCCESS === true) {
        useAuthStore.getState().logout();
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear cookie even if logout failed
      document.cookie =
        'is-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
      useAuthStore.getState().logout();
      router.replace('/auth/login');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) return null;

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <Avatar className="bg-gradient-to-br from-indigo-400 to-purple-600 dark:from-indigo-600 dark:to-purple-800 p-0.5 shadow-lg ring-2 ring-white dark:ring-gray-800 hover:ring-indigo-200 dark:hover:ring-indigo-700 transition-all duration-300 relative z-10">
            <AvatarFallback className="text-white font-medium bg-gradient-to-br from-indigo-500 to-purple-700 dark:from-indigo-700 dark:to-purple-900">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="hidden sm:flex flex-col max-w-[180px]">
          <span className="text-sm font-medium truncate text-gray-900 dark:text-white">
            {user?.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</span>
        </div>

        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 z-30 overflow-hidden"
          >
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                  {user?.email || 'user@example.com'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user?.roles?.map((role) => <RoleBadge key={role} role={role} />)}
                </div>
              </div>

              <div className="px-2 py-1">
                {/* // TODO: If in future we come up with profile and management settings we will be able to add it here  page */}
                {/* <motion.button
                  whileHover={{ x: 2 }}
                  className="w-full flex items-center gap-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => router.push('/settings/profile')}
                >
                  <UserCog className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Profile Settings
                </motion.button>

                <motion.button
                  whileHover={{ x: 2 }}
                  className="w-full flex items-center gap-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Account Settings
                </motion.button> */}
                <motion.button
                  whileHover={{ x: 2 }}
                  className="w-full  cursor-pointer flex items-center gap-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg transition-colors"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
