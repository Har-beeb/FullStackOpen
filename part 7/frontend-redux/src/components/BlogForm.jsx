import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { logoutUser } from '../reducers/userReducer'
import Togglable from './Togglable'

const BlogForm = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  const handleBlogCreate = async (event) => {
    event.preventDefault()

    const newBlog = { title, author, url }
    console.log('creating blog with', newBlog)

    try {
      await dispatch(createBlog(newBlog))

      setTitle('')
      setAuthor('')
      setUrl('')

      blogFormRef.current.toggleVisibility()
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
        ),
      )
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        // 1. Clear the invalid storage
        handleLogout()
        // 2. Tell the user
        dispatch(
          setNotification('Session expired. Please log in again.', 'error'),
        )
        return
      }
      dispatch(setNotification('Failed to create blog', 'error'))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <form onSubmit={handleBlogCreate}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </Togglable>
  )
}

export default BlogForm
