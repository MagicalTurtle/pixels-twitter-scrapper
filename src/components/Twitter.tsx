import { signIn, signOut } from 'next-auth/react';

import clsxm from '@/lib/clsxm';
import useTwitterAuth from '@/hooks/useTwitterAuth';

export default function Twitter() {
  const { completed, error, loading, session } = useTwitterAuth();
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-center justify-center gap-4'>
        {session ? (
          <p>
            Signed in as <br />
            <span className='text-xl'>
              {session.twitter?.profile.data.name} (@
              {session.twitter?.profile.data.username})
            </span>
          </p>
        ) : (
          <p>Not signed in</p>
        )}
        <button
          className='bg-purple-700 px-4 py-2'
          onClick={() => (session ? signOut() : signIn())}
        >
          {session ? 'Sign out' : 'Sign in'}
        </button>
      </div>

      <Status completed={completed} error={error} loading={loading} />
    </div>
  );
}
function Status({
  error,
  loading,
  completed,
}: {
  error?: string;
  loading: boolean;
  completed: boolean;
}) {
  return (
    <p>
      Status:{' '}
      <span
        className={clsxm(
          'font-bold',
          !loading && (error || !completed) && 'text-red-500',
          completed && 'text-green-500'
        )}
      >
        {loading
          ? 'Checking...'
          : error
          ? error
          : completed
          ? 'Completed'
          : 'Not Complete'}
      </span>
    </p>
  );
}
