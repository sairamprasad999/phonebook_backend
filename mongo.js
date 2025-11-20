const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ss2644_db_user:${password}@learningcluster.sbjvvu4.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=LearningCluster`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
    return
}

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log('Person saved!')
  mongoose.connection.close()
})