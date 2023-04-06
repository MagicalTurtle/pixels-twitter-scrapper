import { DefaultSession } from 'next-auth';

type TwitterProfile = {
  profile_image_url: string;
  id: string;
  name: string;
  username: string;
};

type TwitterInfo = {
  accessToken: string;
  refreshToken: string;
  profile: {
    data: TwitterProfile;
  };
};

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    twitter?: TwitterInfo;
    user: {
      /** The user's postal address. */
      address: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    twitter?: TwitterInfo;
  }
}
