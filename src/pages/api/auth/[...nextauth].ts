import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: '2.0',
    }),
  ],
  callbacks: {
    session({ session, token }) {
      return { ...session, twitter: token.twitter }; // The return type will match the one returned in `useSession()`
    },

    async jwt({ token, account = {}, profile }) {
      if (!account?.provider) return token;

      const data: Record<string, unknown> = {};

      if (account?.access_token) {
        data.accessToken = account.access_token;
      }

      if (account?.refresh_token) {
        data.refreshToken = account.refresh_token;
      }

      data.profile = profile;

      if (!token[account.provider]) {
        token[account.provider] = data;
      }

      return token;
    },
  },
});
