import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material'

const UserView = () => {
  const { id } = useParams()

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (result.isLoading) {
    return <div>loading user data...</div>
  }

  const users = result.data
  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          {user.name}
        </Typography>

        <Divider sx={{ marginBottom: 3 }} />

        <Typography variant="h5" gutterBottom>
          Added Blogs
        </Typography>
        {user.blogs && user.blogs.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {user.blogs.map((blog) => (
               <ListItem key={blog.id} disablePadding divider>
                <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
                  <ListItemText
                    primary={blog.title}
                    sx={{ color: '#1976d2' }} 
                    />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontStyle: 'italic', mt: 2 }}
          >
            This user hasn't added any blogs yet.
          </Typography>
        )}
      </Paper>
    </div>
  )
}

export default UserView
