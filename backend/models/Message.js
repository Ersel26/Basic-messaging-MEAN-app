const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSch = new Schema({
    sender : {
        type : String,
    },
    receiver : {
        type : String,
    },
    date : {
        type : Date,
    },
    content : {
        type : String,
    }
}, {
    collection: 'messages'
 })

const Message = module.exports = mongoose.model('Message', MessageSch)

module.exports.getMessageById = function(id, callback) {
    Message.findById(id, callback)
}

module.exports.getInbox = function(username, itemnum, page, sorttype, callback) {
    let query = {receiver: username}
    Message.find(query, callback).limit(itemnum).skip(itemnum * (page - 1)).sort(sorttype);
}

module.exports.getOutbox = function(username, itemnum, page, sorttype, callback) {
    let query = {sender: username}
    Message.find(query, callback).limit(itemnum).skip(itemnum * (page - 1)).sort(sorttype);
}