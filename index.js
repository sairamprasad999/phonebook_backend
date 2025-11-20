
require('dotenv').config()
const express = require('express')
const Person = require('./models/persons')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// Add a token that stringifies the body (only for logging)
morgan.token('body', (req) => {
  // Avoid logging undefined; return empty string instead
  return req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : '';
});

// Use a format that includes the :body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('<h1>Hello from persons svc</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((person) => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person) => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const nameExists = persons.find((person) => person.name === body.name)
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: String(Math.floor(Math.random() * 10000)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

// app.get('/api/notes/:id', (request, response) => {
//   const id = request.params.id
//   const note = notes.find((note) => note.id === id)

//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }
// })

// const generateId = () => {
//   const maxId =
//     notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0
//   return String(maxId + 1)
// }

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({
//       error: 'content missing',
//     })
//   }

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

// app.delete('/api/notes/:id', (request, response) => {
//   const id = request.params.id
//   notes = notes.filter((note) => note.id !== id)

//   response.status(204).end()
// })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})