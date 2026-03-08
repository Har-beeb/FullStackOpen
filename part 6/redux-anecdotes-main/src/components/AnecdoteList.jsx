import { useDispatch, useSelector } from 'react-redux'
import { updateAnecdoteVotes } from "../reducers/anecdoteReducer"
import { setNotification } from '../reducers/notificationReducer'

const Anecdotes = ({anecdote, handleVote }) => {
    return (
        <div>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={handleVote}>vote</button>
        </div></div>
    )
    
}

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(( {filter, anecdotes} ) => {
    if (filter === '') {
      return anecdotes
    }
    return anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })

  const vote = (anecdote) => {
    const updatedAnecdote = {...anecdote, votes: anecdote.votes + 1}
    dispatch(updateAnecdoteVotes(updatedAnecdote))
    dispatch(setNotification(`you voted '${updatedAnecdote.content}'`, 5))
  }

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)


  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <Anecdotes 
          key={anecdote.id} 
          anecdote={anecdote} 
          handleVote={() => vote(anecdote)} 
        />))}
    </div>
  )
}

export default AnecdoteList