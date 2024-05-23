'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import Image from 'next/image'

import headerImg from '@/assets/headerImg.png'

export default function Navbar() {
  const { user, error, isLoading } = useUser()
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target && !target.closest('.relative')) {
        setShowMenu(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [setShowMenu])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <>
      <nav className='fixed top-0 left-0 w-full z-10  bg-background flex justify-between items-center pt-2 pb-1 px-4'>
        <Link href='/' className=' '>
          <Image src={headerImg} alt='logoImg' className='w-[140px]' />
        </Link>
        {user && (
          <div className='flex items-center'>
            <div className='relative'>
              <Image
                src={user.picture ?? ''}
                alt='Profile picture'
                width={50}
                height={50}
                className='rounded-full cursor-pointer'
                onClick={toggleMenu}
                onBlur={() => setShowMenu(false)}
              />
              {showMenu && (
                <div className='absolute right-0 mt-2 w-20 bg-[#4d4d4d] rounded-md shadow-lg'>
                  <a
                    href='/api/auth/logout'
                    className='flex justify-center px-4 py-2 text-white hover:bg-background active:bg-background'
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
  )
}
