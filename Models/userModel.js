const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    is_online: { type: Boolean, default: false }

})

module.exports = mongoose.model('User', userSchema);