const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Squad', squadSchema);
