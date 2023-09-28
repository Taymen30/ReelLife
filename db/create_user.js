const pg = require('pg')

const db = new pg.Pool({
    database: 'reellife'
})
const bcrypt = require('bcrypt')
const user_name = 'xX_Billy_Xx'
const email = 'taymen@iinet.net.au'
const password = 'hello'
const saltRounds = 10;

const sql = `INSERT INTO users (user_name, email, password_digest) VALUES ($1, $2, $3)`

bcrypt.genSalt(saltRounds, function(err, salt) {
    
    bcrypt.hash(password, salt, function(err, hash) {
        
        db.query(sql, [user_name, email, hash], (err, result) => {
            if(err){
                console.log(err)
            }else {
                console.log('user created')
            }

        });

    });


})

