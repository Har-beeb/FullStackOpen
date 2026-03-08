const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAnecdote)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error) 
  }
  
  return response.json()
}

export const updateVote = async (updatedVote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedVote)
  }

  const response = await fetch(`${baseUrl}/${updatedVote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update vote')
  }

  return await response.json()
}