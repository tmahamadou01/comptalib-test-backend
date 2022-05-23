const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

// Config server
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// First endpoint
app.get('/', (req, res) => {
    res.status(200).send('Welcome to API')
})

// Server start
app.listen(port, () => {
    console.log('app listening in port ' + port)
})