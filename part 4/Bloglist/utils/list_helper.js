const _ = require('lodash')

const dummy = (blogs) => {
return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let favorite = blogs[0]
    for (let blog of blogs) {
        if (blog.likes > favorite.likes) {
            favorite = blog
        }
    }
    return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCount = blogs.reduce( (totalBlogs, currentBlog) => {
    const {author} = currentBlog
    if (totalBlogs[author]) {
        totalBlogs[author] += 1
    } else {
        totalBlogs[author] = 1
    }

    console.log('totoal blog:', totalBlogs)
    return totalBlogs

    }, {})
    
    let maxBlogs = 0
    let topAuthor = ''

  for (const author in blogCount) {
    const count = blogCount[author]
    console.log('count', count)
    if (count > maxBlogs) {
        maxBlogs = count
        topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }


}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = blogs.reduce( (getLikes, currentBlog) => {
    const {author, likes} = currentBlog
    if (getLikes[author]) {
        getLikes[author] += likes
    } else {
        getLikes[author] = likes
    }
    return getLikes
  }, {})

  let maxLikes = 0
  let topAuthor = ''

  for (const author in authorLikes) {
    const likes = authorLikes[author]
    if (likes > maxLikes) {
        maxLikes = likes
        topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

const mostLikesLodash = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // We chain a series of commands together
  const topAuthor = _.chain(blogs).groupBy('author')
  .map((authorBlogs, authorName) => ({
      author: authorName,
      likes: _.sumBy(authorBlogs, 'likes') 
    }))
    .maxBy('likes').value()

  return topAuthor
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostLikes, mostLikesLodash, mostBlogs
}