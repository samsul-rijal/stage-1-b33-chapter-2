const express = require('express')

const app = express()
const port = 5000

app.set('view engine', 'hbs') // set view engine hbs

app.use('/public', express.static(__dirname + '/public')) // set public path/folder

app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
    res.render('index')
})

app.get('/add-blog', function(req, res) {
    res.render('add-blog')
})

let isLogin = true

app.get('/blog', function(req, res) {
    res.render('blog', {isLogin})
})

app.post('/blog', function(req, res) {
    
    console.log(req.body);
    console.log(req.body.inputTitle);
})

app.get('/blog-detail/:id', function(req, res) {

    console.log(req.params);

    let id = req.params.id


    res.render('blog-detail', {
        blog: {
            id: id,
            title: 'Selamat Datang di Personal Web',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident accusantium beatae numquam expedita at et a earum temporibus impedit animi.',
            author: 'Samsul Rijal',
            postAt: '29 Maret 2022 10:00 WIB'
        }
    })
})

app.get('/contact', function(req, res) {
    res.render('contact')
})

app.listen(port, function(){
    console.log(`Server listen on port ${port}`);
})