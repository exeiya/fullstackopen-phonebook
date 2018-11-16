const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')

morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
      <p>${new Date()}</p>`)
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findOne({ _id: req.params.id })
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
    })
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if(!(name && number)) {
    return res.status(400).json({ error: 'name or number missing' })
  } else {
    const person = new Person({
      name, number
    })
    person
      .save()
      .then(savedPerson => {
        res.json(Person.format(savedPerson))
      })
      .catch(error => {
        console.log(error)
        if (error.code === 11000) {
          res.status(400).json({ error: 'name must be unique' }).end()
        }
      })
  }
})

app.put('/api/persons/:id', (req, res) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }
  Person
    .findOneAndUpdate({ _id: req.params.id }, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`)
})