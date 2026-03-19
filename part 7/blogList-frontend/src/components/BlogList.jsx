import { Link } from 'react-router-dom'
import blogService from '../services/blogs'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography, Button
} from '@mui/material'

import { useQuery } from '@tanstack/react-query'


const BulkInsertButton = () => {
  const seedData = []

  const handleBulkInsert = async () => {
    if (window.confirm('Are you sure you want to bulk insert blogs?')) {
      try {
        for (const blog of seedData) {
          await blogService.create(blog)
          console.log(`Successfully added: ${blog.title}`)
        }
        alert('All blogs seeded! Refresh the page.')
      } catch (error) {
        console.error('Bulk insert failed', error)
        alert('Something went wrong. Check the console.')
      }
    }
  }

  return (
    <Button
      variant="contained"
      color="warning"
      onClick={handleBulkInsert}
      sx={{ mb: 4 }}
    >
      Seed Database
    </Button>
  )
}


const BlogList = () => {

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  })


  if (result.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh', // Takes up half the screen height to push it to the middle
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

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {/* <BulkInsertButton /> */}
      <Typography variant="h4" sx={{ marginBottom: 2, marginTop: 2 }}>
        Blogs
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow key={blog.id} hover>
                <TableCell>
                  <Link
                    to={`/blogs/${blog.id}`}
                    style={{ textDecoration: 'none', color: '#1976d2' }}
                  >
                    {blog.title}
                  </Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
