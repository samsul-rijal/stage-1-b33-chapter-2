const express = require('express')

const app = express()
const port = 5000

const db = require('./connection/db')

app.set('view engine', 'hbs') // set view engine hbs
app.use('/public', express.static(__dirname + '/public')) // set path folder public
app.use(express.urlencoded({extended: false}))

let isLogin = true

app.get('/', function(req, res){
    res.render('index')
})

app.get('/add-blog', function(req, res){
    res.render('add-blog')
})

app.get('/blog', function(req, res){

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query('SELECT * FROM tb_blog', function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 

            console.log(result.rows);
            let data = result.rows

            data = data.map(function(item){
                return {
                    ...item,
                    isLogin: isLogin,
                    post_at: getFullTime(item.post_at),
                    content: item.content.slice(0,5) + '.....'
                }
            })

            res.render('blog', {isLogin, blogs: data})
        })

    })

})

app.post('/blog', function(req, res){

    res.redirect('/blog') // berpindah halaman ke route /blog
})

app.get('/blog-detail/:index', function(req, res){
    
    res.render('blog-detail')
})

app.get('/delete-blog/:index', function(req, res){

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
