import { useEffect } from 'react'

import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import UserStatus from './components/UserStatus'

import { useDispatch, useSelector } from 'react-redux'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'

const App = () => {
  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <div>
      {!user ? (
        <div>
          <h2>Welcome to the Blogs Application</h2>
          <Notification />
          <LoginForm />
        </div>
      ) : (
        <div>
          <h2>Blogs</h2>
          <Notification />
          <UserStatus />
          <h2>create new</h2>
          <BlogForm />
          <BlogList />
        </div>
      )}
    </div>
  )
}

export default App
