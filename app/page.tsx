'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading..</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    console.log(user);
    router.push('/Home'); // Navigate to homepage after login
    return null;
  }

  return (
    <main>
      <div className="flex h-screen justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">
          {' '}
          <a
            href="/api/auth/login"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {' '}
            Login
          </a>
        </h1>
      </div>
    </main>
  );
}
