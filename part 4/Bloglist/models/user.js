const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9]+$/.test(v); // Regex: Only allows a-z, A-Z, 0-9
      },
      message: props => `${props.value} contains invalid characters! Only letters and numbers allowed.`
    }
  },
  name: String,
  passwordHash: {
    type: String,
    minlength: 3,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User