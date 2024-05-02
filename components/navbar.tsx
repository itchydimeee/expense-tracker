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
      <Link href="/" className="text-2xl font-bold">
        Home
      </Link>
      {user && (
        <div className="flex items-center">
          {user && user.picture && (
            <div className="pr-1">
              <Image
                src={user.picture}
                alt="Profile picture"
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
          )}
          <span className="text-lg pr-3">{user.name}</span>
          <a
            href="/api/auth/logout"
            className="flex bg-red-600 hover:bg-red-700 text-white justify-center font-bold text-lg py-2 px-2 rounded-2xl w-24"
          >
            {' '}
            Logout
          </a>
        </div>
      )}
    </nav>
  );
}
