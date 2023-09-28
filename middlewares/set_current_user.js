const pg = require('pg')
const db = new pg.Pool({
    database: 'reellife'
})

function setCurrentUser(req, res, next){
    res.locals.userId = req.session.userId
    
    if (!req.session.userId){
        return next()
    } 
    const sql = `SELECT * FROM users WHERE id = $1`
    const values = [req.session.userId]
    db.query(sql, values, (err, result) => {
        if(err){
            console.error(err)
            process.exit(1)
        } else {
            const user = result.rows[0]
            res.locals.user = user
        }
        next()
    })
}

module.exports = setCurrentUser