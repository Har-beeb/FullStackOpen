import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import contactService from './services/contacts'
import './index.css'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const deleteContact = (id) => {
    const person = persons.find(n => n.id === id)
    if (!person) {
      alert("Contact not found")
      return
    }

    if (window.confirm(`Delete ${person.name} ?`)) {
      contactService.deleteContact(id)
      .then(returnedContact => {
        setPersons(persons.filter(n => n.id !== id))
        console.log('deleted contact', returnedContact)
        setSuccessMessage(`Contact deleted successfully`)
        setTimeout(() => setSuccessMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage(`Error deleting ${person.name}: ${error.message}`)
        setTimeout(() => setErrorMessage(null), 5000)
        setPersons(persons.filter(n => n.id !== id))
      })
    }

  }

  const hook = () => {
    console.log('effect in progress')
    contactService.getAll()
    .then(initialPersons => {
      console.log('promise fulfilled')
      setPersons(initialPersons)
    })
  }

  useEffect(hook,[])


  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const capitalizedNewName = newName
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    console.log(capitalizedNewName)

    // Check if the name already exists in the phonebook
    if (persons.some(person => person.name === capitalizedNewName)) {
      if (window.confirm(`${capitalizedNewName} is already added to phonebook, replace the old number with a new one?`)) {
        // update the number
        const personToUpdate = persons.find(person => person.name === capitalizedNewName)
        const updatedPerson = { ...personToUpdate, number: newNumber }

        contactService.update(personToUpdate.id, updatedPerson)
        .then((returnedPerson) => {
          console.log('contact updated', returnedPerson)
          setPersons(
            persons.map(person => (person.id === personToUpdate.id ? returnedPerson : person))
          )
          setNewName('')
          setNewNumber('')
          // Updated successfully
          setSuccessMessage(`Updated ${capitalizedNewName} successfully`)
          setTimeout(() => setSuccessMessage(null), 5000)
        })
        .catch((error) => {
          setErrorMessage(`Error updating ${capitalizedNewName}: ${error.message}`)
          setTimeout(() => setErrorMessage(null), 5000);
          setPersons(persons.filter(person => person.id !== personToUpdate.id))
        })
      }
      return
    }

    const nameObject = {
      name: capitalizedNewName,
      number: newNumber
    }

    contactService.create(nameObject)
    .then(returnedPerson => {
      console.log('response', returnedPerson)
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    // Added successfully
    setSuccessMessage(`Added ${capitalizedNewName}`)
    setTimeout(() => setSuccessMessage(null), 5000)
    })
    .catch(error => { 
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000);
      console.log(error.response.data.error) })
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons
  
  console.log(personsToShow)



  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} type= 'success'/>
      <Notification message={errorMessage} type= 'error' />

      <Filter value = {filter} onChange = {handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm 
        onSubmit={addPerson} valueName={newName} valueNum={newNumber} onChangeName={handleNameChange} 
        onChangeNum={handleNumberChange} text={'add'}
      />

      <h3>Numbers</h3>

      <Persons persons = {personsToShow} deleteContact={deleteContact} />
    </div>  
  )
}

export default App