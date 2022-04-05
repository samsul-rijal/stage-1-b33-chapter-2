const express = require('express')
const { user } = require('pg/lib/defaults')

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

            // console.log(result.rows);
            let data = result.rows

            data = data.map(function(item){
                return {
                    ...item,
                    isLogin: isLogin,
                    post_at: getFullTime(item.post_at),
                    duration: getDistanceTime(item.post_at),
                    content: item.content.slice(0,125) + '.....'
                }
            })

            res.render('blog', {isLogin, blogs: data})
        })

    })

})

app.post('/blog', function(req, res){

    let data = req.body
    // console.log(data);

    const query = `INSERT INTO tb_blog(title, content) VALUES ('${data.inputTitle}', '${data.inputContent}')`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            if (err) throw err
            done();
            
            res.redirect('/blog') // berpindah halaman ke route /blog
        })
    })


})

app.get('/blog-detail/:id', function(req, res){
    // console.log(req.params.id);

    let id = req.params.id

    db.connect(function (err, client, done) {
        if (err) throw err

        client.query(`SELECT * FROM tb_blog WHERE id = ${id}`, function(err, result){
            if (err) throw err
            done()

            // console.log(result.rows[0]);
            let data = result.rows[0]
            data.post_at = getFullTime(data.post_at) 

            
            res.render('blog-detail', {blog: data})
        })
    })


})

app.get('/delete-blog/:id', function(req, res){

    // console.log(req.params.id);
    const id = req.params.id

    const query = `DELETE FROM tb_blog WHERE id=${id};`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function(err, result){
            if (err) throw err
            done()

            res.redirect('/blog') // untuk berpindah halaman
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

function getDistanceTime(waktu) {
    
    let timeNow = new Date()

    let timePost = waktu
    // console.log(timePost);

    let distance = timeNow - timePost
    // console.log(distance);

    let milisecond = 1000 // 1 detik 1000 milisecond
    let secondInHours = 3600 // 1 jam sama dengan 3600 detik
    let hoursInDay = 24 // 24 jam dalam 1 hari


    let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay))
    // console.log(distanceDay, 'days ago');

    let distanceHours = Math.floor(distance / (milisecond * 60 * 60))
    // console.log(distanceHours, 'hours ago');

    let distanceMinutes = Math.floor(distance / (milisecond * 60))
    // console.log(distanceMinutes, 'minutes ago');

    let distanceSeconds = Math.floor(distance / milisecond)
    // console.log(distanceSeconds, 'seconds ago');

    if (distanceDay > 0) {
        // console.log(distanceDay, 'days ago')
        return `${distanceDay} days ago`
    } else if (distanceHours > 0) {
        // console.log(distanceHours, 'hours ago')
        return `${distanceHours} hours ago`
    } else if (distanceMinutes > 0) {
        // console.log(distanceMinutes, 'minutes ago')
        return `${distanceMinutes} minutes ago`
    } else {
        // console.log(distanceSeconds, 'seconds ago')
        return `${distanceSeconds} seconds ago`
    }
}


app.listen(port, function(){
    console.log(`Listening server on port ${port}`);
})
