import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function useTwitterAuth() {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const updateData = async () => {
      if (session?.twitter?.profile.data.id) {
        try {
          setLoading(true);

          const res = await fetch(
            `https://pixels-data.xyz/twitter?id=${session?.twitter?.profile.data.id}`
          );
          if (!res.ok) throw new Error(res.statusText);

          setCompleted(true);
        } catch (e: any) {
          setError(e?.message ?? e);
        } finally {
          setLoading(false);
        }
      } else {
        setCompleted(false);
        setError('');
        setLoading(false);
      }
    };

    updateData();
  }, [session?.twitter?.profile.data.id]);

  return { loading, completed, error, session };
}
