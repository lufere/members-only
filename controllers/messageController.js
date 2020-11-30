var Message = require('../models/messages');
var mongoose = require('mongoose');

const {body, validationResult} = require('express-validator');


exports.new_message_get = function(req,res){
    res.render('new_message');
}

exports.new_message_post = [
    body('title', 'Message title required').trim().escape().isLength({min:1}),
    body('message', 'Message content required').trim().escape().isLength({min:1}),

    (req,res,next)=>{
        const errors = validationResult(req);

        var message = new Message({
            title:req.body.title,
            message:req.body.message,
            user:req.user,
            timestamp: new Date(),
        });

        if(!errors.isEmpty()) res.render('new_message', {errors:errors.array(), message:message});
        message.save(function(err){
            if(err) return next(err);
            res.redirect('/');
        })
    }
]