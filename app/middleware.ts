import { SITE_MAP } from '@/common/constants/frontendRouting';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === SITE_MAP.AUTH.LOGIN;

  if (!token && !isAuthPage) {
    const loginUrl = new URL(SITE_MAP.AUTH.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    const homeUrl = new URL(SITE_MAP.HOME.DEFAULT, request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)']
};
