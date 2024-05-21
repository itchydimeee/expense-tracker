import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faChartBar } from '@fortawesome/free-solid-svg-icons'

import { FooterProps } from '@/lib/types'

import { CreateTransactionCard } from './createTransactionCard'

const Footer: React.FC<FooterProps> = ({
  userId,
  onSubmitExpense,
  onSubmitIncome,
}) => {
  const pathname = usePathname()

  return (
    <footer className='fixed bottom-0 left-0 w-full flex justify-center items-center bg-secondary h-[70px]'>
      <nav className='flex justify-between items-center gap-4'>
        <Link
          href='/home'
          className={`px-4 py-3 text-white rounded-xl ${
            pathname === '/home' ? 'bg-background text-white' : 'text-white'
          }`}
        >
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <CreateTransactionCard
          userId={userId}
          onSubmitExpense={onSubmitExpense}
          onSubmitIncome={onSubmitIncome}
        />
        <Link
          href='/stats'
          className={`px-4 py-3 rounded-xl text-white ${
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
