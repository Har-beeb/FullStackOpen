import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, deleteBlog, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Blog from './Blog'

const BlogList = () => {
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const increaseLikesOf = async (id) => {
      const blogToUpdate = blogs.find((b) => b.id === id)
      try {
        await dispatch(likeBlog(blogToUpdate))
      } catch (error) {
        dispatch(
          setNotification(`Error liking blog: ${blogToUpdate.title}`, 'error'),
        )
      }
    }

  const deletedBlog = async (id) => {
      const blogToDelete = blogs.find((b) => b.id === id)
      if (!blogToDelete) {
        alert('Blog not found')
        return
      }
  
      if (window.confirm(`Remove blog ${blogToDelete.title} ?`)) {
        try {
          await dispatch(deleteBlog(id))
          dispatch(
            setNotification(`Deleted blog: ${blogToDelete.title}`, 'success'),
          )
          console.log('deleted blog with id', id)
        } catch (exception) {
          if (exception.response && exception.response.status === 401) {
            handleLogout()
            dispatch(
              setNotification('Session expired. Please log in again.', 'error'),
            )
          } else if (exception.response && exception.response.status === 404) {
            dispatch(removeBlog(id)) // Sync UI
            dispatch(
              setNotification(
                'This blog was already deleted from the server',
                'error',
              ),
            )
          } else {
            dispatch(
              setNotification(
                `Failed to delete blog ${blogToDelete.title}`,
                'error',
              ),
            )
          }
        }
      }
    }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div className="blog-list">
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={() => increaseLikesOf(blog.id)}
          deleteBlog={() => deletedBlog(blog.id)}
          user={user}
        />
      ))}
    </div>
  )
}

export default BlogList
