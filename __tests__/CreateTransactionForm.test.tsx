import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CreateTransactionForm from '@/components/createTransactionForm'

describe('CreateTransactionForm', () => {
  const userId = '123'
  const onClose = jest.fn()
  const onSubmit = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly for Expense transaction', () => {
    const { getByText, getByRole } = render(
      <CreateTransactionForm
        userId={userId}
        onClose={onClose}
        onSubmit={onSubmit}
        transactionType='Expense'
      />
    )

    expect(getByText('Date')).toBeInTheDocument()
    expect(getByRole('combobox', { name: 'Category' })).toBeInTheDocument()
    expect(getByText('Description')).toBeInTheDocument()
    expect(getByText('Amount')).toBeInTheDocument()
    expect(getByText('Create Expense')).toBeInTheDocument()
    expect(getByText('Cancel')).toBeInTheDocument()
  })

  it('renders correctly for Income transaction', () => {
    const { getByText, getByRole } = render(
      <CreateTransactionForm
        userId={userId}
        onClose={onClose}
        onSubmit={onSubmit}
        transactionType='Income'
      />
    )

    expect(getByText('Date')).toBeInTheDocument()
    expect(getByRole('combobox', { name: 'Category' })).toBeInTheDocument()
    expect(getByText('Description')).toBeInTheDocument()
    expect(getByText('Amount')).toBeInTheDocument()
    expect(getByText('Create Income')).toBeInTheDocument()
    expect(getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onSubmit with correct data when form is submitted for Expense', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <CreateTransactionForm
        userId={userId}
        onClose={onClose}
        onSubmit={onSubmit}
        transactionType='Expense'
      />
    )

    const dateInput = getByLabelText('Date')
    const categoryIdInput = getByRole('combobox', { name: 'Category' })
    const descriptionInput = getByLabelText('Description')
    const amountInput = getByLabelText('Amount')
    const submitButton = getByText('Create Expense')

    fireEvent.change(dateInput, {
      target: { value: '2024-05-25' },
    })
    fireEvent.change(categoryIdInput, { target: { value: '1' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Test description' },
    })
    fireEvent.change(amountInput, { target: { value: '10.99' } })

    console.log('Category ID value: ', categoryIdInput.getAttribute('value'))

    fireEvent.click(submitButton)

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).toHaveBeenCalledWith({
      userId: '123',
      date: new Date('2024-05-25'),
      categoryId: '1',
      description: 'Test description',
      amount: 10.99,
    })
  })

  it('calls onSubmit with correct data when form is submitted for Income', async () => {
    const { getByText, getByLabelText, getByRole } = render(
      <CreateTransactionForm
        userId={userId}
        onClose={onClose}
        onSubmit={onSubmit}
        transactionType='Income'
      />
    )

    const dateInput = getByLabelText('Date')
    const categoryIdInput = getByRole('combobox', { name: 'Category' })
    const descriptionInput = getByLabelText('Description')
    const amountInput = getByLabelText('Amount')
    const submitButton = getByText('Create Income')

    fireEvent.change(dateInput, { target: { value: '2024-05-25' } })
    fireEvent.change(categoryIdInput, { target: { value: '1' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Test description' },
    })
    fireEvent.change(amountInput, { target: { value: '500.00' } })

    fireEvent.click(submitButton)

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))

    expect(onSubmit).toHaveBeenCalledWith({
      userId: '123',
      date: new Date('2024-05-25'),
      categoryId: '1',
      description: 'Test description',
      amount: 500.0,
    })
  })

  it('displays error message when form is submitted with invalid data', async () => {
    const { getByText } = render(
      <CreateTransactionForm
        userId={userId}
        onClose={onClose}
        onSubmit={onSubmit}
        transactionType='Expense'
      />
    )

    const submitButton = getByText('Create Expense')

    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(
        getByText('Please fill in all necessary fields')
      ).toBeInTheDocument()
    )
  })
})
