import { createContext, useReducer } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  const initializeUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
    }
  }

  const loginUser = async (loginDetails) => {
    const user = await loginService.login(loginDetails)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    userDispatch({ type: 'SET_USER', payload: user })
  }

  const logoutUser = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    userDispatch({ type: 'CLEAR_USER' })
  }

  return (
    <UserContext.Provider
      value={{ user, userDispatch, loginUser, logoutUser, initializeUser }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
