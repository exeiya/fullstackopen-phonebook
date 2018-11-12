const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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
  res.json(persons)
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
  } else if (persons.find(person => person.name === name)) {
    return res.status(400).json({ error: 'name must be unique '})
  } else {
    const id = Math.floor(Math.random() * 1000000)
    const newPerson = { name, number, id }
    persons = persons.concat(newPerson)
    
    res.json(newPerson)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`)
})