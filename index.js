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

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
]

app.get('/info', (req, res) => {
  res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
  <p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`)
})