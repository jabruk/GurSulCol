const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'This field is required.'
    },
    password: {
        type: String,
        required: 'This field is required.'
    }
});

userSchema.index({ username: 'text' });

module.exports = mongoose.model('user', userSchema);