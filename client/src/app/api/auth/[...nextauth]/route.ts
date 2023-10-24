import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/*
Cross Namespace Communication
--------------------------------------------------------
The api request should be in the url of this format
http://service-name.namespace.svc.cluster.local

this because the ingress controller is outside of the next app namespace in kubernetes cluster

the full url for the ingress controller is:
http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
*/

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Auth Service Login",
      credentials: {
        email: {
          label: "email:",
          type: "email",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/auth/signin",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          const accessToken = res.headers.get("set-cookie");
          const user = await res.json();
          if (res.ok && user) {
            return {
              ...user,
              accessToken
            };
          }

          return null; // means not authorized!!
        } catch (error) {
          return error;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    newUser: "/register",
  },
});

export { handler as GET, handler as POST };
