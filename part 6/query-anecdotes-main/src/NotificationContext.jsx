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

  return (
    <NotificationContext.Provider value={[ notification, notificationDispatch ]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext