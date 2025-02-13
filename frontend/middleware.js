import { NextResponse } from 'next/server';

// Add paths that should be accessible without authentication
const publicPaths = ['/auth', '/', '/privacy', '/terms', '/guide'];

// Add paths that should be protected (require authentication)
const protectedPaths = ['/dashboard', '/ai', '/home'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('sessionToken')?.value;

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  // If authenticated and trying to access auth page, redirect to dashboard
  // if (token && pathname === '/auth') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // If not authenticated and trying to access protected route, redirect to auth
  // if (!token && isProtectedPath) {
  //   return NextResponse.redirect(new URL('/auth', request.url));
  // }

  // If path is neither public nor protected (404 case)
  if (!isPublicPath && !isProtectedPath) {
    if (token) {
      // If authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      // If not authenticated, redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (your static image folder)
     * - public files (robots.txt, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
}; 