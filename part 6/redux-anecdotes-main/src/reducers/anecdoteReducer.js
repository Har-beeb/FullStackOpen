import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    toggleVotesOf(state, action) {
      const updated = action.payload
      return state.map(anecdote =>
        anecdote.id !== updated.id
          ? anecdote
          : updated
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { createAnecdote, setAnecdotes, toggleVotesOf } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
  
}

export const appendAnecdotes = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch(createAnecdote(newAnecdote))
  }
  
}

export const updateAnecdoteVotes = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.updatedVotes(anecdote)
    dispatch(toggleVotesOf(updatedAnecdote))
  }

}

export default anecdoteSlice.reducer
