var User = require('../models/users');
var bcrypt = require('bcryptjs')

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