import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faChartBar } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  const pathname = usePathname()

  return (
    <footer className='fixed bottom-0 left-0 w-full flex justify-around bg-secondary h-[70px]'>
      <nav className='flex justify-around items-center gap-4'>
        <Link
          href='/home'
          className={`px-4 py-3 mx-16 text-white rounded-xl ${
            pathname === '/home' ? 'bg-background text-white' : 'text-white'
          }`}
        >
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link
          href='/stats'
          className={`px-4 py-3 mx-16 rounded-xl text-white ${
            pathname === '/stats' ? 'bg-background text-white' : 'text-white'
          }`}
        >
          <FontAwesomeIcon icon={faChartBar} />
        </Link>
      </nav>
    </footer>
  )
}

export default Footer
