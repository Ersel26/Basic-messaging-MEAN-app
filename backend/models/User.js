const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const { ModuleResolutionKind } = require('typescript');
const Schema = mongoose.Schema;

let UserSch = new Schema({
    usertype : {
        type : String,
        enum : ['admin', 'regular']
    },
    username : {
        type : String,
    },
    password : {
        type : String,
    },
    name : {
        type : String,
    },
    surname : {
        type : String,
    },
    birthdate : {
        type : Date,
    },
    gender : {
        type : String,
        enum : ['male', 'female', 'others'],
    },
    email : {
        type : String,
    }
}, {
    collection: 'users'
 })

const User = module.exports = mongoose.model('User', UserSch);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback)
}

module.exports.getUserByUsername = function(username, callback) {
    let query = {username : username}
    User.findOne(query, callback)
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}