import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Twitter from '@/components/Twitter';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <Layout>
      <Seo />

      <main>
        <Twitter />
      </main>
    </Layout>
  );
}
