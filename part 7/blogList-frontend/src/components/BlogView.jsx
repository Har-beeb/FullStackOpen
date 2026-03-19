import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'
import { useUpdateBlog, useDeleteBlog, useCommentBlog } from '../hooks'
import UserContext from '../context/UserContext'
import { Link } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material'

const BlogView = () => {
  const navigate = useNavigate()
  const [notification, notifyWith] = useContext(NotificationContext)
  const { user, logoutUser } = useContext(UserContext)
  const { id } = useParams()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const commentBlogMutation = useCommentBlog(notifyWith)

  const handleComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    if (!comment) return

    commentBlogMutation.mutate({ id: blog.id, comment })

    event.target.comment.value = ''
  }

  const updateBlogMutation = useUpdateBlog(notifyWith, logoutUser)

  const increaseLikesOf = (id) => {
    const blogToUpdate = blogs.find((b) => b.id === id)
    updateBlogMutation.mutate({
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    })
  }

  const deleteBlogMutation = useDeleteBlog(notifyWith, logoutUser)

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)
    if (!blogToDelete) {
      alert('Blog not found')
      return
    }

    if (window.confirm(`Remove blog ${blogToDelete.title} ?`)) {
      deleteBlogMutation.mutate(id)
      navigate('/')
    }
  }

  if (result.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Fetching data...
        </Typography>
      </Box>
    )
  }

  const blogs = result.data

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return null
  }

  return (
    <div>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          {blog.title}
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          <a
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1976d2', textDecoration: 'none' }}
          >
            {blog.url}
          </a>
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="body1">{blog.likes} likes</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => increaseLikesOf(blog.id)}
          >
            Like
          </Button>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Added by {blog.user.name}
        </Typography>

        {blog.user?.username === user.username && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteBlog(blog.id)}
            sx={{ marginTop: 1, marginBottom: 3 }}
          >
            Remove Blog
          </Button>
        )}

        <Divider sx={{ marginY: 4 }} />

        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>

        <Box
          component="form"
          onSubmit={handleComment}
          sx={{
            display: 'flex',
            gap: 2,
            marginBottom: 3,
            alignItems: 'center',
          }}
        >
          <TextField
            name="comment"
            label="Write a comment..."
            variant="outlined"
            size="small"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add Comment
          </Button>
        </Box>

        {blog.comments && blog.comments.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {blog.comments.map((comment) => (
              <ListItem key={comment.id} divider>
                <ListItemText primary={comment.text} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            No comments yet. Be the first to share your thoughts!
          </Typography>
        )}
      </Paper>
    </div>
  )
}

export default BlogView
