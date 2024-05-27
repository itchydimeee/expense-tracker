import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import IncomeStats from '@/components/incomeStats'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'
import { act } from 'react-dom/test-utils'

jest.mock('axios')
jest.mock('@auth0/nextjs-auth0/client')

const mockUser = {
  email: 'hotdogwithrice@example.com',
}

const mockIncomes = [
  { category: { name: 'Salary' }, amount: 5000 },
  { category: { name: 'Business' }, amount: 2000 },
  { category: { name: 'Bonus' }, amount: 1000 },
]

;(useUser as jest.Mock).mockReturnValue({ user: mockUser })
;(axios.get as jest.Mock).mockImplementation((url: string) => {
  if (url === '/api/users') {
    return Promise.resolve({ data: { id: '123' } })
  } else if (url === '/api/fetchIncomes') {
    return Promise.resolve({ data: mockIncomes })
  }
  return Promise.reject(new Error('not found'))
})

describe('IncomeStats', () => {
  afterEach(cleanup)

  it('renders loading state initially', () => {
    render(<IncomeStats />)

    expect(
      screen.getAllByText('Loading Income Statistics...').length
    ).toBeGreaterThan(0)
  })

  it('renders income statistics after data is fetched', async () => {
    await act(async () => {
      render(<IncomeStats />)
    })

    await waitFor(() => {
      expect(screen.getByText('Income Statistics')).toBeInTheDocument()
    })

    expect(screen.getByText('Salary - 5000 (63%)')).toBeInTheDocument()
    expect(screen.getByText('Business - 2000 (25%)')).toBeInTheDocument()
    expect(screen.getByText('Bonus - 1000 (13%)')).toBeInTheDocument()
  })
})
