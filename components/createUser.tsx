'use client'

import { useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client'

function CreateUser() {
  const { user } = useUser()

  useEffect(() => {
    async function fetchUser() {
      const auth0Id = user?.sub

      try {
        const response = await axios.get(`/api/users?userId=${auth0Id}`)

        if (response.data.error) {
          const createUserResponse = await axios.post('/api/users', {
            auth0Id,
            email: user?.email,
            username: user?.name,
          })

          if (createUserResponse.data.error) {
            console.error(
              'Failed to create user:',
              createUserResponse.data.error
            )
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [user?.email, user?.name, user?.sub])
  return <div></div>
}

export default CreateUser
