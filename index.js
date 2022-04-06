const express = require('express')

const bcrypt = require('bcrypt')
const session= require('express-session')
const flash = require('express-flash')

const app = express()
const port = 5000

const db = require('./connection/db')

app.set('view engine', 'hbs') // set view engine hbs
app.use('/public', express.static(__dirname + '/public')) // set path folder public
app.use(express.urlencoded({extended: false}))

app.use(flash())

app.use(session({
    secret: 'bebasapaaja',
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
    if(!req.session.isLogin){
        req.flash('danger', 'Silahkan login!!')
        return res.redirect('/login')
    }

    res.render('add-blog')
})

app.get('/blog', function(req, res){
    console.log(req.session);

    db.connect(function(err, client, done) {
        if (err) throw err // kondisi untuk menampilkan error koneksi database

        client.query('SELECT * FROM tb_blog', function(err, result) {
            if (err) throw err // kondisi untuk menampilkan error query 

            // console.log(result.rows);
            let data = result.rows

            data = data.map(function(item){
                return {
                    ...item,
                    isLogin: req.session.isLogin,
                    post_at: getFullTime(item.post_at),
                    content: item.content.slice(0,5) + '.....'
                }
            })

            res.render('blog', {isLogin: req.session.isLogin, user: req.session.user , blogs: data})
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

app.get('/register', function(req, res){
    res.render('register')
})

app.post('/register', function(req, res)
{
    // let data = req.body
    const {inputName, inputEmail, inputPassword} = req.body
    const hashedPassword = bcrypt.hashSync(inputPassword, 10)
    // console.log('data asli', inputPassword);
    // console.log('data encrypt', hashedPassword)

    const query = `INSERT INTO tb_user(name, email, password) VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}');`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            if(err) throw err
            done()

            res.redirect('/register') // berpindah halaman ke route /blog
        })  
    })
})


app.get('/login', function(req, res){
    res.render('login')
})

app.post('/login', function(req, res){
    const {inputName, inputEmail, inputPassword} = req.body

    const query = `SELECT * FROM tb_user WHERE email='${inputEmail}';`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            if(err) throw err
            done()
            console.log(result.rows[0]);

            if(result.rows.length == 0){
                // console.log('Email belum terdaftar!!');
                req.flash('danger', 'Email belum terdaftar!!')

                return res.redirect('/login') // berpindah halaman ke route /blog
            } 

            const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)
            // console.log(isMatch);

            if(isMatch) {
                // console.log('Login Berhasil');
                //memasukan data kedalam session
                req.session.isLogin = true,
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }

                req.flash('success', 'Login Success')
                res.redirect('/blog')
                
            } else {
                // console.log('Password salah!!');
                req.flash('danger', 'Password salah')
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

app.listen(port, function(){
    console.log(`Listening server on port ${port}`);
})
