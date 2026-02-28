import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailsStyle = {
    paddingLeft: 15,
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div style={detailsStyle}>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button onClick={updateLikes}>like</button>
          </p>
          <p>Added by: {blog.user?.name}</p>
          {/* <button onClick={deleteBlog}>remove</button> */}
          {blog.user?.username === user.username && (
             <button onClick={deleteBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog