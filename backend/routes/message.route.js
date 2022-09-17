const express = require('express');
const app = express();
const messageAppRoute = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


//models
let User = require('../models/User');
let Message = require('../models/Message');
let Log = require('../models/Log');


messageAppRoute.route('/').get((req, res) => {
    User.find((error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
})



// Authenticate
messageAppRoute.route('/authenticate').post((req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err
            if(isMatch) {
                const token = jwt.sign({ user }, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                return res.json({
                    success: true,
                    token: token,
                    user: {
                        id: user._id,
                        usertype: user.usertype,
                        username: user.username,
                        name: user.name,
                        surname: user.surname,
                        birthdate: user.birthdate,
                        gender: user.gender,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'User not found'});
            }
        })
    })

})

// Create User
messageAppRoute.route('/user').post((req, res, next) => {
    let newUser = new User({
        usertype: req.body.usertype,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        email: req.body.email
    })

    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, msg: 'failed to register user'});
        } else {
            res.json({success: true, msg: 'user registered successfully'});
        }
    })
})

// Get Profile
messageAppRoute.route('/user').get(passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({user: req.user});
})

// Get All Users
messageAppRoute.route('/user/:itemnum/:page/:sorttype').get(passport.authenticate('jwt', {session: false}), (req, res) => {
    if(req.user.usertype === 'admin') {
        let itemnum = req.params.itemnum;
        let page = req.params.page;
        let sorttype = `${req.params.sorttype}`;
        User.find((error, data) => {
            if(error) {
                return next(error);
            }
            else {
                res.json(data);
            }
        }).limit(itemnum).skip(itemnum * (page - 1)).sort(sorttype);
    } else {res.sendStatus(401)}
    

})

// Get Single User
messageAppRoute.route('/user/:username').get(passport.authenticate('jwt', {session: false}), (req, res) => {
    User.getUserByUsername(req.params.username, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Update User
messageAppRoute.route('/user/:username').put(passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if(req.user.usertype === 'admin') {
        User.findOneAndUpdate({username : req.params.username}, {
        $set: req.body
        }, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data)
                console.log('Data updated successfully')
            }
        })
    } else {res.sendStatus(401)}
})

// Delete User
messageAppRoute.route('/user/:username').delete(passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if(req.user.usertype === 'admin') {
        User.findOneAndDelete({username: req.params.username}, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                msg: data
                })
            }
        })
    } else {res.sendStatus(401)}
})

// Save Message
messageAppRoute.route('/message').post(passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Message.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Get All Messages
messageAppRoute.route('/message/:itemnum/:page/:sorttype').get(passport.authenticate('jwt', {session: false}), (req, res) => {
    if(req.user.usertype === 'admin') {
        let itemnum = req.params.itemnum;
        let page = req.params.page;
        let sorttype = `${req.params.sorttype}`;
        Message.find((error, data) => {
            if(error) {
                return next(error);
            }
            else {
                res.json(data);
            }
        }).limit(itemnum).skip(itemnum * (page - 1)).sort(sorttype);
    } else {res.sendStatus(401)}
})

// Get Inbox
messageAppRoute.route('/get-inbox/:itemnum/:page/:sorttype').get(passport.authenticate('jwt', {session: false}), (req, res) => {
    let itemnum = req.params.itemnum;
    let page = req.params.page;
    let sorttype = `${req.params.sorttype}`;
    Message.getInbox(req.user.username, itemnum, page, sorttype, (error, data) => {
        if(error) {
            return next(error);
        }
        else {
            res.json(data);
        }
    });
})

// Get Outbox
messageAppRoute.route('/get-outbox/:itemnum/:page/:sorttype').get(passport.authenticate('jwt', {session: false}), (req, res) => {
    let itemnum = req.params.itemnum;
    let page = req.params.page;
    let sorttype = `${req.params.sorttype}`;
    Message.getOutbox(req.user.username, itemnum, page, sorttype, (error, data) => {
        if(error) {
            return next(error);
        }
        else {
            res.json(data);
        }
    });
})

// Delete Message
messageAppRoute.route('/message/:id').delete(passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if(req.user.usertype === 'admin') {
        Message.findOneAndDelete({_id: req.params.id}, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                msg: data
                })
            }
        })
    } else {res.sendStatus(401)}
})

// Create Log
messageAppRoute.route('/log').post(passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if(req.user.usertype === 'admin') {
        Log.create(req.body, (error, data) => {
            if (error) {
                return next(error)
            } else {
                res.json(data)
            }
        })
    } else {res.sendStatus(401)}
})

// Get All Logs
messageAppRoute.route('/log/:itemnum/:page/:sorttype').get(passport.authenticate('jwt', {session: false}), (req, res) => {
    if(req.user.usertype === 'admin') {
        let itemnum = req.params.itemnum;
        let page = req.params.page;
        let sorttype = req.params.sorttype;
        Log.find((error, data) => {
            if(error) {
                return next(error);
            }
            else {
                res.json(data);
            }
        }).limit(itemnum).skip(itemnum * (page - 1)).sort(sorttype);
    } else {res.sendStatus(401)}
})




module.exports = messageAppRoute