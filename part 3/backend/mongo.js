// Module 3.12: Command-line database
const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3) {
  console.log('give password and contact details as argument')
  process.exit(1)
}

const password = args[2]
const name = args[3]
const number = args[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.qxjhxcn.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

// Mongoose schema/model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

person.save().then(() => {
  console.log(`added ${name} number ${number} to phonebook`)
})

Person.find({}).then(result => {
  console.log('phonebook:')
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})