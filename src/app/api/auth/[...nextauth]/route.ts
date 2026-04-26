// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// ⬇ Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
      image?: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    email: string;
    role: string;
    token: string;
    refreshToken: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        socialToken: { label: "Social Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },

      async authorize(credentials) {
        // CASE 1: Standard Email/Password Login
        if (credentials?.email && credentials?.password) {
          try {
            const res = await fetch(`${baseUrl}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || "Login failed");
            }

            const user = data.data.user;

            return {
              id: user.id,
              email: user.email,
              role: user.role,
              token: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              firstName: user.firstName,
              lastName: user.lastName,
              image: user.image || null,
            };
          } catch (err) {
            console.log("Authorize Error:", err);
            throw new Error("Invalid email or password");
          }
        }

        // CASE 2: Social Login (Google) - Token exchange
        if (credentials?.socialToken) {
          try {
            // Usually, after a social login, the backend has already created the user
            // and provides a token. We might just need to verify it or use it to get user info.
            // If the backend provides the full user data in the callback, we can pass it here.
            // For now, let's assume we can fetch the user profile with the token.
            const res = await fetch(`${baseUrl}/users/profile`, {
              headers: {
                Authorization: `Bearer ${credentials.socialToken}`,
              },
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error("Social login verification failed");
            }

            const user = data.data;

            return {
              id: user.id,
              email: user.email,
              role: user.role,
              token: credentials.socialToken as string,
              refreshToken: (credentials.refreshToken as string) || "",
              firstName: user.firstName,
              lastName: user.lastName,
              image: user.image || null,
            };
          } catch (err) {
            console.log("Social Authorize Error:", err);
            throw new Error("Social login failed");
          }
        }

        throw new Error("Missing credentials");
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
        firstName: token.firstName,
        lastName: token.lastName,
        image: token.image,
      };

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
