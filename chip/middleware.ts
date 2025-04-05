//export { auth as middleware } from "@/auth"

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  
  try {    
    // Verifica o token JWT
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    //console.log('Middleware - Token:', token);
    const isAuthPage = nextUrl.pathname.startsWith('/auth/login') || nextUrl.pathname.startsWith('/auth/register');
    const isProtectedRoute = nextUrl.pathname.startsWith('/admin');
    const isPublicRoute = nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/api/auth');
   

    // Permite acesso a rotas públicas
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Se estiver em uma rota protegida e não tiver token, redireciona para login
    if (isProtectedRoute && !token) {
      //console.log('Middleware - Redirecting to login (protected route)');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Se estiver na página de login e tiver token, redireciona para dashboard
    if (isAuthPage && token) {
      //console.log('Middleware - Redirecting to dashboard (authenticated user)');
      const callbackUrl = nextUrl.searchParams.get('callbackUrl') || '/admin/dashboard';
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Em caso de erro, redireciona para a página de login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}