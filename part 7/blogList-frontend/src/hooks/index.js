// src/hooks/index.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

export const useCommentBlog = (notifyWith) => {
  const queryClient = useQueryClient()

  return useMutation({
   mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: (returnedBlog) => { queryClient.setQueryData(['blogs'], (oldBlogs) => {
        return oldBlogs.map((blog) =>
          blog.id !== returnedBlog.id ? blog : returnedBlog,
        )
      })
      notifyWith('Comment added successfully!', 'success')
    },
    onError: () => {
      notifyWith('Failed to add comment.', 'error')
    },
  })
}

export const useUpdateBlog = (notifyWith, logoutUser) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.update,
    // This click feels faster using onMutate, rather than waiting for the server response in onSuccess.
    onMutate: (changedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) => {
        return oldBlogs.map((blog) =>
          blog.id !== changedBlog.id ? blog : changedBlog,
        )
      })
    },
    onError: (exception) => {
      if (exception.response && exception.response.status === 401) {
        logoutUser()
        notifyWith('Session expired. Please log in again.', 'error')
        
      } else if (exception.response && exception.response.status === 404) {
        notifyWith('Blog not found. It may have been removed.', 'error')
        queryClient.setQueryData(['blogs'], (oldBlogs) => {
          return oldBlogs.filter(
            (blog) => blog.id !== exception.response.data.id,
          )
        })
      } else {
        // If our optimism was wrong and the server crashes, we force a refresh to fix the UI
        queryClient.invalidateQueries({ queryKey: ['blogs'] })
        notifyWith('An error occurred while updating the blog.', 'error')
      }
    },
  })
}

export const useDeleteBlog = (notifyWith, logoutUser) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: (severResponse, deletedId) => {
      queryClient.setQueryData(['blogs'], (oldBlogs = []) => {
        return oldBlogs.filter((blog) => blog.id !== deletedId)
      })
      notifyWith('Blog deleted successfully', 'success')
    },
    onError: (exception) => {
      // 401 means the token is invalid, likely due to expiration
      if (exception.response && exception.response.status === 401) {
        logoutUser()
        notifyWith('Session expired. Please log in again.', 'error')
      }
      // 404 means the blog was already deleted, so we can just remove it from the UI
      else if (exception.response && exception.response.status === 404) {
        notifyWith('Blog not found. It may have been removed.', 'error')
        queryClient.setQueryData(['blogs'], (oldBlogs) => {
          return oldBlogs.filter(
            (blog) => blog.id !== exception.response.data.id,
          )
        })
      } else {
        notifyWith('An error occurred while deleting the blog.', 'error')
      }
    },
  })
}
