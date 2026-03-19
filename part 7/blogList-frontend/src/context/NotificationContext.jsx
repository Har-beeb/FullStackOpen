import { createContext, useReducer } from 'react'

const NotificationContext = createContext()

const notifReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
  
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notifReducer, null)

  const notifyWith = (message, type = 'success') => {
    notificationDispatch({
      type: 'SET',
      payload: { message, type },
    })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={[ notification, notifyWith ]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext