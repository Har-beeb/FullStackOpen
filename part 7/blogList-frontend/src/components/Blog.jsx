
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  return (
    <div>
      <div>
        <Link to={`/blogs/${blog.id}`}>{blog.stitle}</Link>
      </div>
    </div>
  )
}

export default Blog
