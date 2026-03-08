import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Hello! This is the initial notification.'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload 
    },
    hideNotification() {
      return null 
    }
  }
})

const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (message, timeInSeconds) => {
  return async (dispatch) => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeInSeconds * 1000)
  }
}

export default notificationSlice.reducer