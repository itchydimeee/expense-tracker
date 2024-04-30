'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar () {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <nav className='flex justify-between items-center py-4'>
      <Link href='/' className='text-lg font-bold'>
        Home
      </Link>
      {user && (
        <div className='flex items-center'>
          {user && user.picture && (
            <Image
              src={user.picture}
              alt='Profile picture'
              width={48}
              height={48}
              className='rounded-full'
            />
          )}
          <span className='text-lg'>{user.name}</span>
          <a
            href='/api/auth/logout'
            className='bg-red-600 hover:bg-red-700 text-black font-bold py-2 px-4 rounded-2xl'
          >
            {' '}
            Logout
          </a>
        </div>
      )}
    </nav>
  )
}
