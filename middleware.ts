import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Detect environment
const IS_PROD = process.env.NODE_ENV === 'production';

// Security configuration - Made less aggressive for development
const SECURITY_CONFIG = {
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  MAX_REQUESTS_PER_WINDOW: IS_PROD ? 600 : 10000, // higher in dev
  BLOCKED_IPS: new Set<string>(), // In production, use Redis or database
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'https://formcraft-ai.vercel.app',
    'https://yourdomain.com'
  ],
};

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Allow dev HMR/websocket connections; keep strict in prod
  'Content-Security-Policy': IS_PROD
    ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://sqmgfjmtxmotwbtjxywk.supabase.co https://api.openai.com; frame-ancestors 'none';"
    : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' ws: http://localhost:3000 https://sqmgfjmtxmotwbtjxywk.supabase.co; frame-ancestors 'none';",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};

// Rate limiting function - Fixed IP detection
function checkRateLimit(req: NextRequest): boolean {
  const ip = req.ip || 
             req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('x-real-ip') || 
             'unknown';
  
  const now = Date.now();
  const current = rateLimitStore.get(ip);
  
  if (!current || current.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW) {
    if (IS_PROD) {
      console.log(`Rate limit exceeded for IP: ${ip} (${current.count} requests)`);
      return false;
    } else {
      // Never block in dev
      return true;
    }
  }
  
  current.count++;
  return true;
}

// Security validation - Only enforced in production (except basic CORS for API)
function validateRequest(req: NextRequest): { valid: boolean; reason?: string } {
  if (!IS_PROD) return { valid: true };

  const ip = req.ip || 
             req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = req.headers.get('user-agent') || '';
  const origin = req.headers.get('origin');
  
  if (SECURITY_CONFIG.BLOCKED_IPS.has(ip)) {
    return { valid: false, reason: 'IP blocked' };
  }
  
  if (req.nextUrl.pathname.startsWith('/api/')) {
    if (!checkRateLimit(req)) {
      return { valid: false, reason: 'Rate limit exceeded' };
    }
    if (origin && !SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
      return { valid: false, reason: 'Invalid origin' };
    }
  }
  
  const suspiciousPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, /python/i, /java/i, /perl/i];
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    console.log(`Suspicious user agent detected: ${userAgent}`);
  }
  
  return { valid: true };
}

export async function middleware(req: NextRequest) {
  // Skip middleware for static files and Next.js internals
  if (
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/favicon.ico') ||
    req.nextUrl.pathname.startsWith('/public/') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Security validation - only for API routes, and only enforced in prod
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const securityCheck = validateRequest(req);
    if (!securityCheck.valid) {
      console.log(`Request blocked: ${securityCheck.reason} from ${req.ip}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Add security headers (always), with relaxed CSP in dev
  Object.entries(securityHeaders).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value);
  });

  // Add CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    supabaseResponse.headers.set('Access-Control-Allow-Origin', '*');
    supabaseResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    supabaseResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({ request: { headers: req.headers } });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          req.cookies.set({ name, value: '', ...options });
          supabaseResponse = NextResponse.next({ request: { headers: req.headers } });
          supabaseResponse.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  try {
    const { data: { session } } = await supabase.auth.getSession();

    const protectedRoutes = ['/dashboard', '/api/forms', '/api/analytics'];
    const authRoutes = ['/signin', '/signup', '/forgot-password'];
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!session && isProtectedRoute) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    if (session && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

  } catch (error) {
    console.error('Middleware error:', error);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclude static assets and Next internals
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
