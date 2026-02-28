import { useState, useEffect, useRef  } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/Login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm createLogin={handleLogin} />
    </Togglable>
  )

  const handleLogin = async loginDetails => {

    console.log('logging in with', loginDetails)

    try {
      const user = await loginService.login(loginDetails)
      window.localStorage.setItem(
        'loggedBlogListUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage('Login successful')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm onBlogCreate={handleBlogCreate} />
    </Togglable>
  )

  const handleBlogCreate = async newBlog => {
    console.log('creating blog with', newBlog)

    try {
      const createdBlog = await blogService.create(newBlog)
      
      setBlogs(blogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
      setSuccessMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
      // 1. Clear the invalid storage
        handleLogout()
        // 2. Tell the user
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => setErrorMessage(null), 5000)
        return
      }
      setErrorMessage('Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const increaseLikesOf = async id => {
    const blogToUpdate = blogs.find(b => b.id === id)
    const changedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    try {
      const returnedBlog = await blogService.update(id, changedBlog)
      const blogWithUser = { ...returnedBlog, user: blogToUpdate.user }
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : blogWithUser)))
    } catch {
      setErrorMessage(
        `Blog '${blogToUpdate.title}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs(blogs.filter(n => n.id !== id))
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const deleteBlog = async id => {
    const blogToDelete = blogs.find(b => b.id === id)
    if (!blogToDelete) {
      alert('Blog not found')
      return
    }

    if (window.confirm(`Remove blog ${blogToDelete.title} ?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        console.log('deleted blog with id', id)
      } catch (exception) {
        if (exception.response && exception.response.status === 401) {
          // 1. Clear the invalid storage
          handleLogout()
          // 2. Tell the user
          setErrorMessage('Session expired. Please log in again.')
        }
        else if (exception.response && exception.response.status === 404) {
          setErrorMessage('This blog was already deleted from the server')
          setBlogs(blogs.filter(b => b.id !== id)) // Sync UI
        }
        else {
          setErrorMessage(`Failed to delete blog ${blogToDelete.title}`)
        }
        setTimeout(() => setErrorMessage(null), 5000)
      }
    }
  }

  //handle logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>

      {!user && <div>
        <h2>Log in to application</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {loginForm()}
      </div>
      }

      {user && <div>
        <h2>Blogs</h2>
        {successMessage && <div className="success">{successMessage}</div>}
        <p>{user.name} logged in
          <button onClick={() => { handleLogout() } }> logout </button>
        </p>
        <h2>create new</h2>
        {blogForm()}
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={() => increaseLikesOf(blog.id)}
            deleteBlog={() => deleteBlog(blog.id)}
            user={user} />
        )}
      </div>
      }

    </div>
  )
}

export default App