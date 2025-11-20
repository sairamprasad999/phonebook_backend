
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
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p>${date}</p>`
    )
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then((person) => {
          response.json(person)
      }).catch((error) => {
          response.status(404).end()
      }
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndRemove(id).then(() => {
        response.status(204).end()
    }).catch((error) => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    })
    
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
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then((savedPerson) => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})