import React from 'react'
import axios from 'axios'

interface Props {
  incomeId: string
  onDelete: () => void
}

const DeleteIncome: React.FC<Props> = ({ incomeId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete('/api/deleteIncome', {
        params: { incomeId: incomeId },
      })
      onDelete()
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button
      id='delete-button'
      data-testid='delete-income'
      onClick={handleDelete}
      className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 mr-2'
    >
      Delete
    </button>
  )
}

export default DeleteIncome
