require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const db = require('./db/index')
const session = require('express-session')
const setCurrentUser = require('./middlewares/set_current_user')
const methodOverride = require('method-override')
const ensureLogin = require('./middlewares/ensure_login')
const bcrypt = require('bcrypt')
const app = express()
const port = process.env.PORT || 3434;

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(
    session({
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 3 },
      secret: process.env.SESSION_SECRET || "mistyrose",
      resave: false,
      saveUninitialized: true,
    })
  );
app.use(setCurrentUser)
app.use(expressLayouts)
app.use(express.urlencoded({extended: true}))
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method
      delete req.body._method
      return method
    }
}))


app.get('/', (req, res) => {
    // displaying all posts in the default order
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

app.get('/posts/new', ensureLogin, (req, res) => {

    res.render('new_post')
})

app.post('/posts/save', ensureLogin, (req, res) => {
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

app.delete('/posts/:id', ensureLogin, (req, res) => {
    const sql = 'DELETE FROM posts WHERE id = $1'
    const values = [req.params.id]

    db.query(sql, values, (err, dbres) => {
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})
//PRAY TO JESUS

app.get('/posts/:id', (req, res) => {
    const postId = req.params.id

    const postSQL = 'SELECT * FROM posts WHERE id = $1'
    const postValues = [postId]
    // callback to get the post
    db.query(postSQL, postValues, (err, postResult) => {
        if (err) {
            console.log(err)
        }

        const post = postResult.rows[0]

        if (!post) {
            return res.send('Post not found')
        }

        const userCommentsSQL = 'SELECT users.*, comments.* FROM users INNER JOIN comments ON users.id = comments.user_id WHERE comments.post_id = $1;'
        const userCommentsValues = [postId]
        // callback to get users and comments all on one table
        db.query(userCommentsSQL, userCommentsValues, (err, userCommentsResult) => {
            if (err) {
                console.log(err)
            }

            const comments = userCommentsResult.rows

            const creatorSQL = 'SELECT user_name FROM users WHERE id = $1'
            const creatorValues = [post.user_id]
            //callback to get the original creator of the post
            db.query(creatorSQL, creatorValues, (err, creatorResult) => {
                if (err) {
                    console.log(err)
                }

                const creator = creatorResult.rows[0].user_name;

                res.render('display', { post, creator, comments, user: res.locals.user })
            })
        })
    })
    // JESUS
})

app.get('/login', (req, res) => {
    // Display login.ejs
    res.render('login', { message: req.session.message })
})

app.post('/login', (req, res) => {
        // username from url.encoded
        const values = [req.body.username]
        const sql = `SELECT * FROM users WHERE user_name = $1`

        db.query(sql, values, (err, dbResult) => {
            if(err){
                console.log(err)
            }
            // if no user by that username exists will just re-show page
            if(dbResult.rows.length === 0){
                return res.render('login')
            } 

            // if username does exist, will check password
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

app.get('/logout', ensureLogin, (req, res) => {
    // logout via removing ression userId
    req.session.userId = null
    res.redirect('/login')
})

app.get('/signup', (req, res) => {
    // open signup.ejs
    res.render('signup')
})

app.post('/signup', (req, res) => {

    const user_name = req.body.user_name
    const email = req.body.email
    
    // check if user_name or email exists
    const checkSQL = 'SELECT * FROM users WHERE user_name = $1 OR email = $2';
    const checkValues = [user_name, email]
    // callback for checking if the username or email already exist
    db.query(checkSQL, checkValues, (err, checkResult) => {
        if(err){
            console.log(err)
        }
    
        if (checkResult.rows.length !== 0) {
            // user with the same user_name or email already exists
            return res.send('User with that user name or email already exists')
        }
        // if user_name and email are unique will continue
        const insertSQL = `INSERT INTO users (user_name, email, password_digest) VALUES ($1, $2, $3) RETURNING *`
        const password = req.body.password;
        const saltRounds = 10
    
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                db.query(insertSQL, [user_name, email, hash], (err, result) => {
                    if(err){
                        console.log(err)
                        return res.status(500).send('Error creating user')
                    }
    
                    console.log('User created')
                    req.session.userId = result.rows[0].id
                    res.redirect('/')
                })
            });
        });
    })
})

app.post('/posts/:id/comment/save', ensureLogin, (req, res) => {
    const commentSQL = 'INSERT INTO comments (body, user_id, post_id) VALUES ($1, $2, $3);'
    const postId = req.params.id
    const commentValues = [req.body.body, req.session.userId, postId]
    db.query(commentSQL, commentValues, (err, commentResult) => {
        if(err){
            console.log(err)
        }
        res.redirect(`/posts/${postId}`)
    })
})

app.listen(port, (req, res) => {
    console.log(`listening at ${port}`)
})

