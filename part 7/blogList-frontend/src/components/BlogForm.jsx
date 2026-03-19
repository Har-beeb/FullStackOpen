import { useState, useRef } from 'react'
import Togglable from './Togglable'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import UserContext from '../context/UserContext'
import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'
import { TextField, Button, Box, Typography } from '@mui/material'

const BlogForm = () => {
  const queryClient = useQueryClient()
  const { logoutUser } = useContext(UserContext)
  const [notification, notifyWith] = useContext(NotificationContext)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  const handleBlogCreate = (event) => {
    event.preventDefault()

    const newBlog = { title, author, url }
    newBlogMutation.mutate(newBlog)
    blogFormRef.current.toggleVisibility()

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      notifyWith('Blog created successfully', 'success')
    },
    onError: (exception) => {
      if (exception.response && exception.response.status === 401) {
        logoutUser()
        notifyWith('Session expired. Please log in again.', 'error')
      }
    },
  })

  return (
    <div>
      <Box
        sx={{
          textAlign: 'center',
          marginTop: 6,
          marginBottom: 4,
          paddingX: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.5px',
            marginBottom: 1.5,
            background: 'linear-gradient(to right, #6366f1, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Contribute to the Spectrum
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Found a groundbreaking tool or wrote a new architectural guide? Drop
          the link below and spark a discussion with the community.
        </Typography>
      </Box>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <Box
          component="form"
          onSubmit={handleBlogCreate}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 400,
            marginBottom: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Create a new blog
          </Typography>

          <TextField
            label="Title"
            variant="outlined"
            size="small"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />

          <TextField
            label="Author"
            variant="outlined"
            size="small"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />

          <TextField
            label="URL"
            variant="outlined"
            size="small"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button variant="contained" color="primary" type="submit">
            Create
          </Button>
        </Box>
      </Togglable>
    </div>
  )
}

export default BlogForm
