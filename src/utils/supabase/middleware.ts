import { RootPath } from '@/constants/enum';
import { Database } from '@/types/supabase';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const authRoutes = [RootPath.Login, RootPath.Register] as string[];
const privateRoutes = [RootPath.Profile] as string[];

const apiAuthPrefix = '/api/auth';

export async function updateSession(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPrivateRoute = privateRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // save current pathname to cookies for redirect after authenticate
  if (!isAuthRoute && !isApiAuthRoute) supabaseResponse.cookies.set('stored-pathname', pathname);

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // redirect previous route if user logged in when accessing auth routes
  if (isAuthRoute && user) {
    const storedPathname = request.cookies.get('stored-pathname')?.value;

    return storedPathname
      ? NextResponse.redirect(new URL(storedPathname, request.url))
      : NextResponse.redirect(new URL(RootPath.Home, request.url));
  }

  // not allow access to private routes if not authenticated
  if (isPrivateRoute && !user) {
    let callbackUrl = pathname;
    if (search) {
      callbackUrl += search;
    }

    return NextResponse.redirect(
      new URL(`${RootPath.Login}?callbackUrl=${callbackUrl}`, request.url),
    );
  }

  //   if (!user && !pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
  //     // no user, potentially respond by redirecting the user to the login page
  //     const url = request.nextUrl.clone();
  //     url.pathname = '/login';
  //     return NextResponse.redirect(url);
  //   }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
