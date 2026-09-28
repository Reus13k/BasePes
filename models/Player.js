const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true
    },
    nation: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ['GK', 'CB', 'LB', 'RB', 'CM', 'CDM', 'CAM', 'LW', 'RW', 'ST'],
        required: true
    },
    overall: {
        type: Number,
        required: true,
        min: 0,
        max: 99
    },
    rarity: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Legendary'],
        required: true
    },
    pace: {
        type: Number,
        required: true,
        min: 0,
        max: 99
    },
    shooting: {
        type: Number,
        required: true,
        min: 0,
        max: 99
    },
    passing: {
        type: Number,
        required: true,
        min: 0,
        max: 99
    },
    dribbling: {
        type: Number,
        required: true,
        min: 0,
        max: 99
    },
    defense: {
        type: Number,
        required: true,
        min: 0,
        max: 99
    },
    physical: {
        type: Number,
        required: true,
        min: 0,
        max: 99
    },
    price: {
        type: Number,
        default: 50000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Player', playerSchema);
