const express = require('express')

const app = express()
const port = 5000

app.set('view engine', 'hbs') // set view engine hbs

app.use('/public', express.static(__dirname + '/public')) // set path folder public
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res){
    res.render('index')
})

app.get('/add-blog', function(req, res){
    res.render('add-blog')
})


let blogs = [
    {
        title: 'Title Data Dummy',
        content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In voluptatum praesentium eum porro libero unde neque. Doloremque porro inventore praesentium fugit ipsum commodi dicta aliquid ea ad, eveniet maiores repudiandae?,',
        author: 'Samsul Rijal',
        postAt: '31 Maret 2022 14:00 WIB',
    }
]

let isLogin = true

app.get('/blog', function(req, res){

    let dataBlogs = blogs.map(function(item){
        return {
            ...item,
            isLogin: isLogin,
        }
    })

    // console.log(blogs);
    // console.log(dataBlogs);
    res.render('blog', {isLogin, blogs: dataBlogs})
})

app.post('/blog', function(req, res){
    // console.log(req.body);
    let data = req.body // mengambil data dari tag input add blog

    data = {
        title: data.inputTitle,
        content: data.inputContent,
        author: 'Samsul Rijal',
        postAt: getFullTime(new Date()),
    }

    blogs.push(data) // memasuka data ke variabel blog []
    res.redirect('/blog') // berpindah halaman ke route /blog
})

app.get('/blog-detail/:index', function(req, res){

    console.log(req.params);

    let index = req.params.index
    // console.log(blogs[index]);

    let blog = blogs[index]
    
    res.render('blog-detail', blog)
})

app.get('/delete-blog/:index', function(req, res){

    console.log(req.params.index);

    let index = req.params.index

    blogs.splice(index, 1)

    res.redirect('/blog') // untuk berpindah halaman

})


app.get('/contact', function(req, res){
    res.render('contact')
})



function getFullTime(waktu) {
    // console.log(waktu);
    
    let month = ['Januari', 'Febuari', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'October','Nopember','December']
    
    let date = waktu.getDate()
    // console.log(date);

    let monthIndex = waktu.getMonth()
    // console.log(month[monthIndex]);

    let year = waktu.getFullYear()
    // console.log(year);

    let hours = waktu.getHours()
    // console.log(hours);

    let minutes = waktu.getMinutes()
    // console.log(minutes);

    let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
    // console.log(fullTime);

    return fullTime
}

app.listen(port, function(){
    console.log(`Listening server on port ${port}`);
})
