import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })
  
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh the session
    const { data: { session } } = await supabase.auth.getSession();

    // If we have a session, set the Authorization header
    if (session) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${session.access_token}`);

      // Create new response with the auth header
      supabaseResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  
    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
  
    // IMPORTANT: DO NOT REMOVE auth.getUser()
  
    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/sign-in') &&
      !request.nextUrl.pathname.startsWith('/forgot-password')
    ) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone()
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }
  
    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
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
  
    return supabaseResponse

    // // Create an unmodified response
    // let response = NextResponse.next();

    // const supabase = createServerClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //   {
    //     cookies: {
    //       getAll() {
    //         return request.cookies.getAll();
    //       },
    //       setAll(cookiesToSet) {
    //         cookiesToSet.forEach(({ name, value }) =>
    //           request.cookies.set(name, value),
    //         );
    //         response = NextResponse.next({
    //           request,
    //         });
    //         cookiesToSet.forEach(({ name, value, options }) =>
    //           response.cookies.set(name, value, options),
    //         );
    //       },
    //     },
    //   },
    // );

    // const { data: { session } } = await supabase.auth.getSession();

    // // Clone the request headers
    // const requestHeaders = new Headers(request.headers);
    
    // // Add the Authorization header if we have a session
    // if (session?.access_token) {
    //   requestHeaders.set('Authorization', `Bearer ${session.access_token}`);
    // }

    // // Create a new response with the modified headers
    // response = NextResponse.next({
    //   request: {
    //     headers: requestHeaders,
    //   },
    // });

    // const publicPaths = ['/sign-in', '/sign-up', '/forgot-password']

    // // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    // const path = request.nextUrl.pathname

    // // Check if the path is in the public paths array
    // const isPublicPath = publicPaths.includes(path)

    // // This will refresh session if expired - required for Server Components
    // // https://supabase.com/docs/guides/auth/server-side/nextjs
    // const user = await supabase.auth.getUser();

    // // protected routes
    // if (request.nextUrl.pathname.startsWith("/") && user.error && !isPublicPath) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    // // if (request.nextUrl.pathname === "/" && !user.error) {
    // //   return NextResponse.redirect(new URL("/protected", request.url));
    // // }

    // return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
