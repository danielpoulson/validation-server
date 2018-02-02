const taskRouter = require('./tasks');
const userRouter = require('./users');
const projectRouter = require('./projects');
const validationRouter = require('./validations');
const fileRouter = require('./files');
const auth = require('../config/auth');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);
    next();
  });

  app.post('/login', auth.authenticate);
  // router.post('/login', passport.authenticate('local', {
  //     successRedirect: '/',
  //     failureRedirect: '/login',
  //     failureFlash: true
  // }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
  });

  app.use('/api/projects', projectRouter);
  app.use('/api/validations', validationRouter);
  app.use('/api/users', userRouter);
  app.use('/api/tasks', taskRouter);
  app.use('/api/files', fileRouter);
};
