import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/database/prisma"
import Credentials from "next-auth/providers/credentials"
import bcriptHash from "./app/core/helpers/bcript"
import UserModel from "./database/db-model/user-model"
import { signInSchema } from '@/lib/zod'


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers:[
    Credentials({
      credentials: {
        email: {type:'email'},
        password: {type:'password'},
      },

      authorize: async (credentials) => {
        let user= null

        const { email, password } = await signInSchema.parseAsync(credentials)
        const getUser= await UserModel.findByEmail(email)
        
        if (!getUser) return user                
        const pwHash = await bcriptHash.compare(password, getUser.password)
        
        if (!pwHash ) {
          return null
        }

        user= {...getUser}        
        return user        
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 6 * 60 * 60 },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;  
        token.role = user.role;
        token.expires = Math.floor(Date.now() / 1000) + 6 * 60 * 60;        
      }
  
      if (Date.now() / 1000 > token.expires) {
        console.log("Token expirado, removendo sessão...");
        return null; 
      }
      return token;
    },
    
    async session({ session, token }: any) {
      if (Object.keys(token).length === 0) {
        return null;
      }
  
      if (!session.user) {
        session.user = null;
      }
      session.user.id = token.id;
      session.user.role = token.role;
  
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/"
  },

  secret: process.env.NEXTAUTH_SECRET
})