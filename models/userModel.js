const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Please add the user name']
    },
    email: {
        type: String,
        require: [true, 'Please add the user email address'],
        unique: [true, 'Email address already taken'],
    },
    password: {
        type: String,
        require: [true, 'Please add your suitable password']
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('user', userSchema);