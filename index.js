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

    let data = req.body

    const query = `INSERT INTO tb_blog(title, content) VALUES ('${data.inputTitle}', '${data.inputContent}')`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            if(err) throw err
            done()

            res.redirect('/blog') // berpindah halaman ke route /blog
        })
        
    })

})

app.get('/blog-detail/:id', function(req, res){
    console.log(req.params.id);

    const id = req.params.id

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(`SELECT * FROM tb_blog WHERE id=${id}`, function(err, result){
            if (err) throw err
            done();

            // Cara pertama
            // console.log(result.rows[0])
            let data = result.rows[0]

            data = {
                title: data.title,
                content: data.content,
                post_at: getFullTime(data.post_at),
                duration: 'test apa aja'
            }

            console.log(data);

            // Cara kedua
            // let data = result.rows
            // let blog = data.map(function(item){
            //     return {
            //         ...item,
            //         post_at: getFullTime(item.post_at),
            //         duration: 'Apa aja'
            //     }
            // })

            // console.log(blog);
            // blog = blog[0]

            res.render('blog-detail', {blog: data})
        })
    })

})

app.get('/delete-blog/:id', function(req, res){

    const id = req.params.id

    const query = `DELETE FROM tb_blog WHERE id=${id}`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            if(err) throw err
            done()

            res.redirect('/blog') // berpindah halaman ke route /blog
        })  
    })
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
