import { NextResponse, type NextRequest } from 'next/server';
import { API_ENDPOINTS } from './common/constants/apiEndpoints';
import { SITE_MAP } from './common/constants/frontendRouting';
import { UserRoles } from './types/enum';
import { getHomePage } from './lib/enumDisplayMapper';
import useAuthStore from './stores/auth-store';

// Define routes that require specific roles
const PROTECTED_ROUTES: Record<string, UserRoles[]> = {
  // Marketing routes
  // [SITE_MAP.MARKETING.DEFAULT]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.LEAD_MARKETING, UserRoles.EMPLOYEE_MARKETING],
  // [SITE_MAP.MARKETING.ALL_LEADS]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.LEAD_MARKETING, UserRoles.EMPLOYEE_MARKETING],
  // [SITE_MAP.MARKETING.ACTIVE_LEADS]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.LEAD_MARKETING, UserRoles.EMPLOYEE_MARKETING],
  // [SITE_MAP.MARKETING.ADMIN_TRACKER]: [UserRoles.ADMIN, UserRoles.LEAD_MARKETING],

  // // Admissions routes
  // [SITE_MAP.ADMISSIONS.DEFAULT]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.FINANCE, UserRoles.REGISTAR],
  // [SITE_MAP.ADMISSIONS.RECENT_ADMISSIONS]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.FINANCE, UserRoles.REGISTAR],
  // [SITE_MAP.ADMISSIONS.CREATE_ADMISSION]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.REGISTAR],
  // [SITE_MAP.ADMISSIONS.ONGOING_ADMISSION]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.FINANCE, UserRoles.REGISTAR],
  // '/c/admissions/application-process/ongoing': [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.FINANCE, UserRoles.REGISTAR], // Base path for dynamic routes
  // [SITE_MAP.ADMISSIONS.ADMIN_TRACKER]: [UserRoles.ADMIN],

  // // Finance routes
  // [SITE_MAP.FINANCE.DEFAULT]: [UserRoles.ADMIN, UserRoles.FINANCE],
  // [SITE_MAP.FINANCE.STUDENT_DUES]: [UserRoles.ADMIN, UserRoles.FINANCE],
  // '/c/finance/student-dues': [UserRoles.ADMIN, UserRoles.FINANCE], // Base path for student dues ID
  // [SITE_MAP.FINANCE.COURSE_DUES]: [UserRoles.ADMIN, UserRoles.FINANCE],
  // '/c/finance/course-dues': [UserRoles.ADMIN, UserRoles.FINANCE], // Base path for selected course dues
  // [SITE_MAP.FINANCE.ADMIN_TRACKER]: [UserRoles.ADMIN],

  // // Student Repository
  // [SITE_MAP.STUDENT_REPOSITORY.DEFAULT]: [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.FINANCE, UserRoles.REGISTAR],
  // '/c/student-repository': [UserRoles.ADMIN, UserRoles.FRONT_DESK, UserRoles.FINANCE, UserRoles.REGISTAR], // Base path for dynamic student routes

  // // Faculty
  // [SITE_MAP.FACULTY.DEFAULT]: [UserRoles.ADMIN],

  // // Academics
  // [SITE_MAP.ACADEMICS.DEFAULT]: [UserRoles.ADMIN, UserRoles.SYSTEM_ADMIN],
  // [SITE_MAP.ACADEMICS.COURSES]: [UserRoles.ADMIN, UserRoles.SYSTEM_ADMIN],
  // [SITE_MAP.ACADEMICS.SUBJECTS]: [UserRoles.ADMIN, UserRoles.SYSTEM_ADMIN],

  // // Auth - only special cases would be protected (like admin-only auth features)
  // [SITE_MAP.AUTH.DEFAULT]: [], // Typically auth routes are unprotected
  // [SITE_MAP.AUTH.LOGIN]: []    // Login should be accessible to all
};

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('is-authenticated')?.value === 'true';
  const userRoles = request.cookies.get('user-roles')?.value?.split(',') || [];
  let homeurl = "/";
  for (const role of userRoles) {
    const homePage = getHomePage(role as UserRoles);
    if (homePage) {
      homeurl = homePage;
    }
  }
  // Redirect authenticated users away from login page
  if (isAuthenticated && request.nextUrl.pathname === SITE_MAP.AUTH.LOGIN) {
    return NextResponse.redirect(new URL(homeurl, request.url));
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && request.nextUrl.pathname !== SITE_MAP.AUTH.LOGIN) {
    const loginUrl = new URL(SITE_MAP.AUTH.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for protected routes
  if (isAuthenticated) {
    const requestedPath = request.nextUrl.pathname;
    const requiredRoles = PROTECTED_ROUTES[requestedPath];

    if (requiredRoles) {
      const hasRequiredRole = userRoles.some((role) => requiredRoles.includes(role as UserRoles));

      if (!hasRequiredRole) {
        // Redirect to home or show unauthorized
        return NextResponse.redirect(new URL(homeurl, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|images|_next/static|_next/image|favicon.ico|assets).*)']
};
