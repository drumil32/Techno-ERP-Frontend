import { NextResponse, type NextRequest } from 'next/server';
import { API_ENDPOINTS } from './common/constants/apiEndpoints';
import { SITE_MAP } from './common/constants/frontendRouting';

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('is-authenticated')?.value === 'true';

  if (isAuthenticated && request.nextUrl.pathname === SITE_MAP.AUTH.LOGIN) {
    return NextResponse.redirect(new URL(SITE_MAP.HOME.DEFAULT, request.url));
  }

  if (!isAuthenticated && request.nextUrl.pathname !== SITE_MAP.AUTH.LOGIN) {
    const loginUrl = new URL(SITE_MAP.AUTH.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|images|_next/static|_next/image|favicon.ico|assets).*)']
};
