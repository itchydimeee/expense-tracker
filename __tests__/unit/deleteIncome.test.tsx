import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, waitFor } from '@testing-library/react'
import DeleteIncome from '@/components/deleteIncome'
import axios from 'axios'

jest.mock('axios')

describe('DeleteIncome', () => {
  const incomeId = '1'
  const onDelete = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the delete button', () => {
    const { getByTestId } = render(
      <DeleteIncome incomeId={incomeId} onDelete={onDelete} />
    )

    expect(getByTestId('delete-income')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked and delete request succeeds', async () => {
    ;(axios.delete as jest.Mock).mockResolvedValueOnce({})

    const { getByTestId } = render(
      <DeleteIncome incomeId={incomeId} onDelete={onDelete} />
    )

    const deleteButton = getByTestId('delete-income')

    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1)
      expect(axios.delete).toHaveBeenCalledWith('/api/deleteIncome', {
        data: { id: incomeId },
      })
      expect(onDelete).toHaveBeenCalledTimes(1)
    })
  })

  it('handles delete error gracefully', async () => {
    ;(axios.delete as jest.Mock).mockRejectedValueOnce(
      new Error('Delete failed')
    )

    const { getByTestId } = render(
      <DeleteIncome incomeId={incomeId} onDelete={onDelete} />
    )

    const deleteButton = getByTestId('delete-income')

    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1)
      expect(axios.delete).toHaveBeenCalledWith('/api/deleteIncome', {
        params: { incomeId: incomeId },
      })
      expect(onDelete).not.toHaveBeenCalled()
    })
  })
})
