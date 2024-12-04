import { NextResponse } from "next/server";

export function middleware(req) {
  // Check for the "user_uuid" cookie
  const uuid = req.cookies.get("user_uuid");

  // If no cookie is found, redirect to the login page
  if (!uuid) {
    return NextResponse.redirect(new URL("/components/login", req.url));
  }

  // Allow the request to proceed if the cookie exists
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: ["/"], 
};
