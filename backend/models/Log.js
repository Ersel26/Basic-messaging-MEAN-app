const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LogSchema = new Schema({
    optype : {
        type : String,
        enum : ['login', 'logout', 'message-sent', 'delete-message', 'create-user', 'update-user', 'delete-user']
    },
    username : {
        type : String,
    },
    date : {
        type : Date,
    }
}, {
    collection: 'logs'
})

module.exports = mongoose.model('LOG', LogSchema);