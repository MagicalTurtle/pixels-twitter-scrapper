import { signIn, signOut } from 'next-auth/react';

import useTwitterAuth from '@/hooks/useTwitterAuth';

export default function Twitter() {
  const { completed, error, loading, session } = useTwitterAuth();
  return (
    <div>
      {session ? (
        <>
          Signed in as {session.twitter?.profile.data.username} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      Status: {completed ? 'Completed' : 'Pending'}
    </div>
  );
}
