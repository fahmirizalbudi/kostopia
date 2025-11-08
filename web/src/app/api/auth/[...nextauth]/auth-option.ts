import { API } from "@/app/constants/api"
import { findUser } from "@/app/data-access/users"
import { jwtDecode } from "jwt-decode"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions, Session } from "next-auth"

interface MyClaims {
  id: number
  name: string
  email: string
  role: string
  exp: number
  nbf: number
  iat: number
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(API + "/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        })

        if (!res.ok) return null
        const data = await res.json()
        if (!data?.data) return null

        const token = String(data.data)
        const claims = jwtDecode<MyClaims>(token)

        return {
          id: String(claims.id),
          email: claims.email,
          name: claims.name,
          role: claims.role,
          accessToken: token,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.accessToken = user.accessToken
      }
      if (token) {
        const { ok, data } = await findUser({
          accessToken: token.accessToken as string,
          where: token.id as string,
        })

        if (!ok) {
          return null as unknown as JWT
        } else {
          token.id = data.id
          token.email = data.email
          token.name = data.name
          token.role = data.role
        }
      }
      return token
    },
    async session({ session, token }) {
      const { ok, data } = await findUser({
        accessToken: token.accessToken as string,
        where: token.id as string,
      })

      if (!ok) {
        return null as unknown as Session
      }
      session.accessToken = String(token.accessToken)
      session.user = {
        id: String(data.id),
        email: String(data.email),
        name: String(data.name),
        role: String(data.role),
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
}
