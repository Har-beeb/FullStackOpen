import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog,
      )
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (blogToUpdate) => {
  return async (dispatch) => {
    const changedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }
    dispatch(updateBlog(changedBlog))
    try {
      const returnedBlog = await blogService.update(
        blogToUpdate.id,
        changedBlog,
      )
      // dispatch(
      //   updateBlog({
      //     ...returnedBlog,
      //     user: blogToUpdate.user,
      //   }),
      // )
    } catch (error) {
      dispatch(updateBlog(blogToUpdate))
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id)) 
  }
}

export const setToken = (token) => {
  blogService.setToken(token)
}

export default blogSlice.reducer


