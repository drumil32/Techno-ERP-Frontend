import { NextResponse, type NextRequest } from 'next/server';
import { API_ENDPOINTS } from './common/constants/apiEndpoints';
import { SITE_MAP } from './common/constants/frontendRouting';
import { UserRoles } from './types/enum';

// Define routes that require specific roles
const PROTECTED_ROUTES: Record<string, UserRoles[]> = {
  // Example: '/admin': [UserRoles.ADMIN],
  // Add your protected routes and required roles here
};

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('is-authenticated')?.value === 'true';
  const userRoles = request.cookies.get('user-roles')?.value?.split(',') || [];

  // Redirect authenticated users away from login page
  if (isAuthenticated && request.nextUrl.pathname === SITE_MAP.AUTH.LOGIN) {
    return NextResponse.redirect(new URL(SITE_MAP.HOME.DEFAULT, request.url));
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
        return NextResponse.redirect(new URL(SITE_MAP.HOME.DEFAULT, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|images|_next/static|_next/image|favicon.ico|assets).*)']
};
