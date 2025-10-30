const Persons = ({persons, deleteContact}) => {
  return (
    persons.map(person => <p key={person.id}>{person.name + ': '} {person.number}
    &ensp;
    {<button onClick={() => deleteContact(person.id)}>delete</button>}</p>)
  )
}

export default Persons;