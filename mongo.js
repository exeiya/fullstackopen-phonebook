const mongoose = require('mongoose')

if  (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(savedPerson => {
      console.log(`lisätään henkilö ${savedPerson.name} numero ${savedPerson.number} luetteloon`)
      mongoose.connection.close()
    })
} else {
  console.log('Puhelinluettelo:')
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}