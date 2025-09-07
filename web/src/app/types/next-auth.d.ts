import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt";
import "next/server";

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user?: {
      id: string
      email: string
      name?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email?: string
    name?: string
    role?: string
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    email?: string
    name?: string
    role?: string
    accessToken?: string
  }
}
