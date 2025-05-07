import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only run in production
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next()
  }

  // Check if the request is already using HTTPS
  const url = request.nextUrl.clone()
  const isHttps = request.headers.get("x-forwarded-proto") === "https"

  // Redirect to HTTPS if not already using it
  if (!isHttps) {
    url.protocol = "https:"
    return NextResponse.redirect(url)
  }

  // Add security headers
  const response = NextResponse.next()

  // HSTS header
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // XSS protection
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self' https://js.stripe.com 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://*.stripe.com;
      font-src 'self';
      connect-src 'self' https://api.stripe.com;
      frame-src https://js.stripe.com https://hooks.stripe.com;
      object-src 'none';
    `.replace(/\s+/g, " ").trim()
  )

  // Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )

  return response
}

// Run the middleware on all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
