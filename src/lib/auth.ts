import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// Import other providers as needed

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Add other providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
