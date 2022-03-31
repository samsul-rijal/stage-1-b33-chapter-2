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

let blogs = [
    {
        title: 'Title Data Dummy',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, quae ab esse deleniti in consectetur obcaecati placeat consequuntur delectus aut illo accusantium adipisci et natus unde facere! Quam, cupiditate explicabo.,',
        postAt: '31 Maret 2022',
        author: 'Samsul Rijal'
    }
]

let isLogin = true

app.get('/blog', function(req, res) {
    console.log(blogs);

    let dataBlogs = blogs.map(function(item){
        return {
            ...item,
            isLogin: isLogin,
        }
    })

    console.log(dataBlogs);

    console.log(blogs);

    res.render('blog', {isLogin, blogs: dataBlogs})
})

app.post('/blog', function(req, res) {    
    // console.log(req.body);
    let data = req.body

    data = {
        title: data.inputTitle,
        content: data.inputContent,
        author: 'Samsul Rijal',
        postAt: getFullTime(new Date()),
        duration: getDistanceTime(new Date())
    }


    blogs.push(data)
    // console.log(blogs);

    res.redirect('/blog')
})

app.get('/blog-detail/:index', function(req, res) {
    console.log(req.params);

    // let index = req.params.index
    let blog = blogs[req.params.index]

    res.render('blog-detail', blog)
})

// let data = ['avanza','xenia','jazz']
// console.log(data[1]);


app.get('/delete-blog/:index', function(req, res) {

    let index = req.params.index

    console.log(index);
    blogs.splice(index, 1)

    res.redirect('/blog')
})







app.get('/contact', function(req, res) {
    res.render('contact')
})

function getFullTime(waktu) {
    
    let month = ['Januari', 'Febuari', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'October', 'December']
    
    let date = waktu.getDate()
    console.log(date);

    let monthIndex = waktu.getMonth()
    console.log(month[monthIndex]);

    let year = waktu.getFullYear()
    console.log(year);

    let hours = waktu.getHours()
    let minutes = waktu.getMinutes()

    let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`

    return fullTime
}

function getDistanceTime(waktu) {
    let timeNow = new Date()
    let timePost = waktu
    console.log(timePost);

    let distance = timeNow - timePost
    console.log(distance);

    let miliseconds = 1000 // 1000 miliseconds dalam 1 detik
    let secondInHours = 3600 // 1 jam sama dengan 3600 detik
    let hoursInDay = 24 // 24 jam dalam 1 hari

    let distanceDay = Math.floor(distance / (miliseconds * secondInHours * hoursInDay))
    let distanceHours = Math.floor(distance / (miliseconds * 60 * 60))
    let distanceMinutes = Math.floor(distance / (miliseconds * 60))
    let distanceSeconds = Math.floor(distance / miliseconds)
    
    // console.log(distanceDay, 'day ago');
    // console.log(distanceHours, 'hours ago');
    // console.log(distanceMinutes, 'minutes ago');
    // console.log(distanceSeconds, 'detik ago');
    

    if (distanceDay > 0) {
        return `${distanceDay} day ago`
    } else if(distanceHours > 0) {
        return `${distanceHours} hours ago`
    } else if(distanceMinutes > 0) {
        return `${distanceMinutes} minutes ago`
    } else {
        return `${distanceSeconds} detik ago`
    }
}


app.listen(port, function(){
    console.log(`Server listen on port ${port}`);
})