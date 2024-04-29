'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <nav className="flex justify-between items-center py-4">
      <Link href="/">
        <a className="text-lg font-bold">Home</a>
      </Link>
      {user && (
        <div className="flex items-center">
          <Image src={user.picture} alt={user.name} width={32} height={32} className="rounded-full mr-2" />
          <span className="text-lg">{user.name}</span>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() => {
              // Logout using Auth0
              fetch('/api/auth/logout');
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}