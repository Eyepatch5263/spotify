const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({

    senderId: {
        type: String,
        required: true
    },

    receiverId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message;