const express = require('express')

const app = express()

const port = 5000

app.get('/', function(request, response){
    response.send("Hello World")
})

app.get('/about', function(request, response){
    response.send("Ini halaman about")
})

app.get('/contact', (request, response) => {
    response.send("Ini halaman contact")
})

app.listen(port, function(request, response){
    console.log(`Server starting on port ${port}`);
})