const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const connection = mongoose.connection

connection.on('connected', () => {
    console.log('Connection established successfully with database');
})

connection.on('error', (err) => {
    console.log(err)
})

connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
    await connection.close()
    process.exit(0)
})