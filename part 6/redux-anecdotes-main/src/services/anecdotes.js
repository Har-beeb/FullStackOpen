const baseUrl = 'http://localhost:3002/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return await response.json()
}

const createNew = async (content) => {

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  }

  const response = await fetch(baseUrl, options)
  
  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }
  
  return await response.json()
}

const updatedVotes = async (updatedVote) => {
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

export default { getAll, createNew, updatedVotes }