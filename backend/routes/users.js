var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate')
const cors = require('./cors');

const usersRouter = express.Router();
usersRouter.use(bodyParser.json());

/* GET users listing. */
usersRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
usersRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
    .then((users)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(users);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

usersRouter.post('/signup',cors.corsWithOptions, (req, res, next)=> {
  User.register(new User({username: req.body.username}), 
  req.body.password, (err,user) =>{
    if(err){
     res.statusCode = 500;
     res.setHeader('Content-Type', "application/json");
     res.json({err:err});
    }
    else{
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err,user)=>{
        if (err){
          res.statusCode = 500;
          res.setHeader('Content-Type', "application/json");
          res.json({err:err});
        }
        passport.authenticate('local')(req, res, ()=>{
          res.statusCode=200;
          res.setHeader('Content-Type', "application/json");
          res.json({success: true, status: 'Registration Succesful !'}
          )}
     )
      });
    }
  });
});

usersRouter.post('/login',cors.corsWithOptions, (req,res, next)=>{

  passport.authenticate('local', (err, user, info) => {
    if (err){
      return next(err);
    }
    //user dont exist/other infos
    if (!user){
      res.statusCode=401;
      res.setHeader('Content-Type', "application/json");
      res.json({success: false, status: "Login Unsuccesful!",
        err: info});
    }
    //user exist but cant log in 
    req.logIn(user, (err)=>{
      if(err){
        res.statusCode=401;
        res.setHeader('Content-Type', "application/json");
        res.json({success: false, status: "Login Unsuccesful!",
          err: 'Could not log in user'});
      }
    //succesful login
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode=200;
          res.setHeader('Content-Type', "application/json");
          res.json({success: true, status: "Login Succesful!",
            token: token});
    })

  }) (req,res,next);

});


usersRouter.get('/logout', (req,res, next) => {
  if (req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err =  new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

//check if json web token is still valid if not login again
usersRouter.get('/checkJWTToken', cors.corsWithOptions, (req,res,next)=>{
  passport.authenticate('jwt', {session: false}, (err,user, info)=>{
    if (err){
      return next(err);
    }
    if (!user){
        res.statusCode=401;
        res.setHeader('Content-Type', "application/json");
        return res.json({status:'JWT valid!', success:true, user:user });
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
}) (req,res);
})

module.exports = usersRouter;
