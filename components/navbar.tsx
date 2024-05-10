'use client';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { user, error, isLoading } = useUser();
  const [showMenu, setShowMenu] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-10 flex justify-between items-center py-4 px-4 md:px-0 bg-gray-800">
        <Link href="/" className="text-2xl font-bold md:text-3xl text-white">
          Flexi$pend
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
            <span className="text-lg pr-3 hidden md:inline-block">
              {user.name}
            </span>
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg">
                  <a
                    href="/api/auth/logout"
                    className="block px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}