import { createSlice } from '@reduxjs/toolkit'

// const initialState = 'Hello! This is the initial notification.'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
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

export const setNotification = (message, type = 'success') => {
  return async (dispatch) => {
    dispatch(showNotification({ message, type }))
    setTimeout(() => {
      dispatch(hideNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer