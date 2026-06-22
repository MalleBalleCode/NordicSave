// middleware.ts – Skyddar routes som kräver inloggning
//
// Placeras i projektets rot (bredvid package.json).
// Next.js kör middleware.ts INNAN en sida renderas – perfekt för
// att kolla om användaren är inloggad.
//
// Utan middleware kan vem som helst besöka /dashboard direkt i URL-fältet.
// Med middleware omdirigeras de automatiskt till /login.

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // Skyddade routes – lägg till fler här i Fas 2 och 3
  const protectedRoutes = ["/dashboard"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Omdirigera till login om användaren inte är inloggad
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    // Spara dit de försökte gå, så vi kan skicka dem dit efter login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Omdirigera inloggade användare bort från login/register
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

// Kör middleware på dessa routes (inte på statiska filer, bilder etc.)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
