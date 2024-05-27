import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, waitFor } from '@testing-library/react'
import DeleteExpense from '@/components/deleteExpenses'
import axios from 'axios'

jest.mock('axios')

describe('DeleteExpense', () => {
  const expenseId = '1'
  const onDelete = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the delete button', () => {
    const { getByTestId } = render(
      <DeleteExpense expenseId={expenseId} onDelete={onDelete} />
    )

    expect(getByTestId('delete-expense')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', async () => {
    ;(axios.delete as jest.Mock).mockResolvedValueOnce({})

    const { getByTestId } = render(
      <DeleteExpense expenseId={expenseId} onDelete={onDelete} />
    )

    const deleteButton = getByTestId('delete-expense')

    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1)
      expect(axios.delete).toHaveBeenCalledWith('/api/deleteExpenses', {
        params: { expenseId: expenseId },
      })
      expect(onDelete).toHaveBeenCalledTimes(1)
    })
  })

  it('handles delete error gracefully', async () => {
    ;(axios.delete as jest.Mock).mockRejectedValueOnce(
      new Error('Delete failed')
    )

    const { getByTestId } = render(
      <DeleteExpense expenseId={expenseId} onDelete={onDelete} />
    )

    const deleteButton = getByTestId('delete-expense')

    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1)
      expect(axios.delete).toHaveBeenCalledWith('/api/deleteExpenses', {
        params: { expenseId: expenseId },
      })
      expect(onDelete).not.toHaveBeenCalled()
    })
  })
})
