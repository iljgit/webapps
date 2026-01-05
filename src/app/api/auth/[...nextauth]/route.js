import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // This secret encrypts the session cookie
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // You can attach the user's ID or custom data here
      session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// Exporting the handler for both GET and POST requests
export { handler as GET, handler as POST };
