const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('../tests/test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // 1. Create a root user
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  // 2. Log in as that user to get a token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginResponse.body.token

  // We map over the initial data to add the 'user' field to each one
  const blogsWithUser = helper.initialBlogs.map(blog => {
    return { ...blog, user: user.id }
  })

  // Now we can use insertMany again!
  await Blog.insertMany(blogsWithUser)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a blog\'s likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToUpdate = blogsAtStart[0]

  const newLikeCount = 312
  const updateData = {
    likes: newLikeCount
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updateData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual( response.body.likes, newLikeCount)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual( updatedBlogInDb.likes, newLikeCount)
})

test('deleting a single blog post resource', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`) 
    .expect(204)
})

test('a specific blog has a unique identifier property named id', async () => {
  const response = await api.get('/api/blogs')

  // Make sure at least one blog exists
  if (response.body.length > 0) {
    // Get the first blog
    const firstBlog = response.body[0]
  
    assert.notStrictEqual(firstBlog.id, undefined, 'id should be defined')
    assert.strictEqual(firstBlog._id, undefined, '_id should be undefined')
  }
  
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Web Development Basics",
    author: "Harbeebullah I.O",
    url: "https://www.codewithharbeeb.com/web-development-basics",
    likes: 600
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogAtndEnd = await helper.blogsInDb()
  const contents = blogAtndEnd.map(blog => blog.title)
  assert.strictEqual(blogAtndEnd.length, helper.initialBlogs.length + 1)
  assert(contents.includes('Web Development Basics'))
})

test('new blog without title is not added and responds with 400', async () => {
  const newBlogWithoutTitle = {
    author: 'Test Author',
    url: 'https://example.com',
    likes: 5
  }

  const initialBlogs = await helper.blogsInDb()
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(initialBlogs.length, blogsAtEnd.length, 'Blog count should not change')
})

test('new blog without url is not added and responds with 400', async () => {
  const newBlogWithoutUrl = {
    title: 'Test Title',
    author: 'Test Author',
    likes: 5
  }

  const initialBlogs = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(initialBlogs.length, blogsAtEnd.length, 'Blog count should not change')
})

test('default like property to 0', async () => {
  const newBlog = {
    title: "Web Development Intermediate ",
    author: "Harbeebullah I.O",
    url: "https://www.codewithharbeeb.com/web-development-intermediate",
  }

  const response =  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0, "The 'likes' property should default to 0")

})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})