import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard'];
    const authRoutes = ['/signin', '/signup', '/forgot-password'];
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    // If user is signed in and trying to access auth routes, redirect to dashboard
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user is not signed in and trying to access protected routes, redirect to signin
    if (!session && isProtectedRoute) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // If user is signed in and accessing the home page, redirect to dashboard
    if (session && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to continue but log the error
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (OAuth callback)
     * - auth/reset-password (password reset)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|auth/reset-password).*)',
  ],
};
