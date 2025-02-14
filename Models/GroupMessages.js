const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupMessageSchema = new Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);