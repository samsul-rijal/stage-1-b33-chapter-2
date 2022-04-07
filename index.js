const express = require('express')

const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')

const app = express()
const port = 5000

const db = require('./connection/db')
const upload = require('./middlewares/fileUpload')

app.set('view engine', 'hbs') // set view engine hbs
app.use('/public', express.static(__dirname + '/public')) // set path folder public
app.use('/uploads', express.static(__dirname + '/uploads')) // set path folder public

app.use(express.urlencoded({extended: false}))

app.use(flash())

app.use(session({
    secret: 'ksfkfsahjfsahuafshjsafjksafjh',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 2 * 60 * 60 * 1000 // 2 jam
    }
}))

// let isLogin = true

app.get('/', function(req, res){
    
    res.render('index')
})

app.get('/add-blog', function(req, res){

    console.log(req.session.isLogin);

    if(!req.session.isLogin){
        req.flash('danger', 'Login dulu!!')
        res.redirect('/login')
    }

    res.render('add-blog')
})

app.get('/blog', function(req, res){

    const query = `SELECT tb_blog.id, tb_user.name as author, tb_user.email, tb_blog.title, tb_blog.content, tb_blog.image, tb_blog.post_at
	FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id`

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query(query, function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 

            // console.log(result.rows);
            let data = result.rows

            data = data.map(function(item){
                return {
                    ...item,
                    isLogin: req.session.isLogin,
                    post_at: getFullTime(item.post_at),
                    duration: getDistanceTime(item.post_at),
                    content: item.content.slice(0,125) + '.....'
                }
            })

            console.log(data);

            res.render('blog', {isLogin: req.session.isLogin, user: req.session.user ,blogs: data})
        })


    })

})

app.post('/blog', upload.single('inputImage'), function(req, res){

    let data = req.body
    // console.log(data);
    const authorId = req.session.user.id
    const image = req.file.filename


    const query = `INSERT INTO tb_blog(title, content, author_id, image) 
    VALUES ('${data.inputTitle}', '${data.inputContent}', '${authorId}', '${image}')`

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

app.get('/register', function(req, res){
    res.render('register')
})

app.post('/register', function(req, res){

    // let data = req.body
    let {inputName, inputEmail, inputPassword} = req.body

    const hashedPassword = bcrypt.hashSync(inputPassword, 10) // 10 hashed/second

    // console.log('password asli', inputPassword);
    // console.log('sudah bcrypt', hashedPassword)

    const query = `INSERT INTO public.tb_user(name, email, password) VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}');`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function(err, result){
            if (err) throw err
            done()

            res.redirect('/login') // untuk berpindah halaman
        })

    })

})



app.get('/login', function(req, res){
    res.render('login')
})

app.post('/login', function(req, res){
    
    const {inputEmail, inputPassword} = req.body

    const query = `SELECT * FROM tb_user WHERE email='${inputEmail}'`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function(err, result){
            if (err) throw err
            done()

            // melakukan kondisi jika email belum terdaftar
            if(result.rows.length == 0){
                // console.log('Email not found!!');
                req.flash('danger', 'Email belum terdaftar!')
                return res.redirect('/login')
            }

            const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password )
            // console.log(isMatch);

            if(isMatch){
                // console.log('Login Berhasil');

                // Memasukan data kedalam session
                req.session.isLogin = true,
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }

                req.flash('success', 'Login Success')
                res.redirect('/blog')
            } else {
                // console.log('Password salah');
                req.flash('danger', 'Password tidak cocok!')
                res.redirect('/login')
            }        
        })
    })
})


app.get('/logout', function(req, res){
    req.session.destroy()

    res.redirect('/blog')
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
