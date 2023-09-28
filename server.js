require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const db = require('./db/index')
const session = require('express-session')
const setCurrentUser = require('./middlewares/set_current_user')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
const app = express()
const port = 3434


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(setCurrentUser)
app.use(expressLayouts)
app.use(express.urlencoded({extended: true}))
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method
      delete req.body._method
      return method
    }
}))


app.get('/', (req, res) => {
    const sql = `SELECT * FROM posts`
    db.query(sql, (err, dbres) => {
        if(err){
            console.log(err)
        }
        // console.log(dbres.rows[0])
        const posts = dbres.rows

        res.render('home', {posts})
    })
})

app.get('/posts/new', (req, res) => {

    res.render('new_post')
})

app.post('/posts/save', (req, res) => {
    const sql = 'INSERT INTO posts (title, date, img_url, description, user_id) VALUES ($1, $2, $3, $4, $5) '
    console.log(req.body)
    
    const now = new Date()
    const values = [req.body.title, now.toDateString(), req.body.image_url, req.body.description, req.session.userId]
    db.query(sql, values, (err, dbres) => {
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})

app.delete('/posts/:id', (req, res) => {
    const sql = 'DELETE FROM posts WHERE id = $1'
    const values = [req.params.id]

    db.query(sql, values, (err, dbres) => {
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/posts/:id', (req, res) => {
    const sql = 'SELECT * FROM posts WHERE id = $1'
    const values = [req.params.id]
    db.query(sql, values, (err, dbres) => {
        if(err){
            console.log(err)
        }
        post = dbres.rows[0]

        res.render('display', {post})
    })
})

app.get('/login', (req, res) => {
    
    res.render('login')
})

app.post('/login', (req, res) => {
        const values = [req.body.username]
        const sql = `SELECT * FROM users WHERE user_name = $1`

        db.query(sql, values, (err, dbResult) => {
            if(err){
                console.log(err)
            }
            if(dbResult.rows.length === 0){
                return res.render('login')
            } 

            const userInputPassword = req.body.password
            const hashedPassword = dbResult.rows[0].password_digest

            bcrypt.compare(userInputPassword, hashedPassword, function(err,bcrResult) {
                if(bcrResult){
                    req.session.userId = dbResult.rows[0].id
                    return res.redirect('/')
                } else{
                    return res.render('login')
                }
                console.log(err)
                console.log(dbResult)
            });

        })
    })

app.listen(port, (req, res) => {
    console.log(`listening at ${port}`)
})

