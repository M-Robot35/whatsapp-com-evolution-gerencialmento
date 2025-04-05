import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
        id: string;
        role: 'ADMIN'| "SUPER_ADMIN" | "USER";
        id: string
        name: string
        email: string
        image: string
    };
  } 

  interface JWT {
    id: string;
    role: string;
    expires: number;
  }
}

