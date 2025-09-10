import { API } from "@/app/constants/api"
import { jwtDecode } from "jwt-decode"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
      return token
    },
    async session({ session, token }) {
      session.accessToken = String(token.accessToken)
      session.user = {
        id: String(token.id),
        email:  String(token.email),
        name: String(token.name),
        role: String(token.role),
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
