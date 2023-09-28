function ensureLogin(req, res, next){
    if(req.session.userId){
        return next()
    } 
    
    req.session.message = 'Please Login or Sign-Up'
    res.redirect('/login')
}
module.exports = ensureLogin