const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Check if password exists and is at least 3 characters long
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password is required and must be at least 3 characters long'
    })
  }

  if (!/\d/.test(password)) {
    return response.status(400).json({ error: 'password must contain a number' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.delete('/:id', async (request, response, next) => {
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


module.exports = usersRouter