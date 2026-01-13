import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const url = `${process.env.ISEEMY_API_URL}/iseemy/login`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ISEEMY_API_KEY}`,
          },
          body: JSON.stringify({ data: credentials }),
        });

        if (!response.ok) {
          return null;
        }

        const userData = await response.json();
        if (!userData || !userData.success || !userData.user) {
          return null;
        }

        const user = userData.user;

        // check the password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendId = user.id; // Store the backend ID in the token
      }
      return token;
    },
    async session({ session, token }) {
      // This happens whenever getServerSession is called
      if (session.user) {
        session.user.backendId = token.backendId; // Map the token value to the session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
