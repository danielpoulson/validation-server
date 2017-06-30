const taskRouter = require('./tasks');
const userRouter = require('./users');
const changeRouter = require('./changes');
const fileRouter = require('./files');
const auth = require('../config/auth');

module.exports = function(app) {

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        next();
    });

    app.post('/login', auth.authenticate);
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.sendStatus(200);
    });
    
    app.use('/api/changes', changeRouter);
    app.use('/api/users', userRouter);
    app.use('/api/tasks', taskRouter);
    app.use('/api/files', fileRouter);
}