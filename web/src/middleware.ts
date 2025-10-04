import { getToken } from "next-auth/jwt"
import { NextResponse, NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const path = req.nextUrl.pathname
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (path === "/") return NextResponse.next()

  if (path === "/auth/login" && token) {
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (path.startsWith("/admin") && token?.role !== "admin") {
    url.pathname = "/" 
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/", "/auth/login"],
}
