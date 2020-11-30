var User = require('../models/users');
var bcrypt = require('bcryptjs')
const passport = require('passport');

const {body, validationResult} = require('express-validator');

exports.sign_up_get = function(req, res, next){
    res.render('sign_up');
}

exports.sign_up_post = [
    body('first_name', 'First name required').trim().escape().isLength({min:1}),
    body('last_name', 'Last name required').trim().escape().isLength({min:1}),
    body('username', 'E-mail address required').trim().escape().isLength({min:3}).isEmail(),
    body('password', 'Password required').trim().escape().isLength({min:4}).withMessage('Password must be at least 4 characters long'),
    body('passwordConfirm').escape().trim().custom((value,{req})=>{
        if(value != req.body.password) throw new Error('Password confirmation does not match')
        return true
    }),
    (req, res, next) => {
        const errors = validationResult(req);

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) return next(err);
            var user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hashedPassword,
                membership: false,
                admin: false,
            });

            if(!errors.isEmpty()) res.render('sign_up',{errors:errors.array(), user: user});
            user.save(err =>{
                if(err) return next(err);
                res.redirect('/');
            })
        });
    }
]

exports.log_in_get = function(req, res, next){
    res.render('log_in');
}

exports.log_in_post = [
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
      })
]

exports.membership_get = function(req, res){
    if(req.user) res.render('membership');
    res.redirect('/');
}

exports.membership_post = [
    body('question').trim().escape().isInt({min:4, max:4}).withMessage('Wrong Answer!'),

    (req,res,next)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('membership', {errors:errors.array()});
        }else{
            // if(req.body.question != 4) res.render('membership', {wrong:true})
            var user = new User({
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                username: req.user.username,
                password: req.user.password,
                membership: true,
                admin: req.user.admin,
                _id: req.user._id,
            });
            console.log(user);
            // res.redirect('/');
            User.findByIdAndUpdate(req.user._id, user, {}, function(err, user){
                if(err) return next(err);
                res.redirect('/');
            })
        }
    }
]

exports.admin_get = function(req, res){
    if(req.user) res.render('admin');
    res.redirect('/');
}

exports.admin_post = [
    body('question').trim().escape().isInt({min:42, max:42}).withMessage('Wrong Answer!'),

    (req,res,next)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('admin', {errors:errors.array()});
        }else{
            // if(req.body.question != 4) res.render('admin', {wrong:true})
            var user = new User({
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                username: req.user.username,
                password: req.user.password,
                membership: req.user.membership,
                admin: true,
                _id: req.user._id,
            });
            console.log(user);
            // res.redirect('/');
            User.findByIdAndUpdate(req.user._id, user, {}, function(err, user){
                if(err) return next(err);
                res.redirect('/');
            })
        }
    }
]

exports.log_out = function(req, res){
    req.logout();
    res.redirect('/');
}