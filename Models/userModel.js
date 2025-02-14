const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    is_online: { type: String, default: false },
    bio: { type: String, default: null },

})

module.exports = mongoose.model('User', userSchema);