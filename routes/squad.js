const express = require('express');
const Squad = require('../models/Squad');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's squad
router.get('/', auth, async (req, res) => {
    try {
        const squad = await Squad.find({ userId: req.userId }).populate('playerId');
        res.json(squad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add player to squad
router.post('/:playerId', auth, async (req, res) => {
    try {
        // Check if already in squad
        const existing = await Squad.findOne({ userId: req.userId, playerId: req.params.playerId });
        if (existing) {
            return res.status(400).json({ message: 'Player already in squad' });
        }

        const squad = new Squad({
            userId: req.userId,
            playerId: req.params.playerId
        });

        await squad.save();
        await squad.populate('playerId');
        
        res.status(201).json(squad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove player from squad
router.delete('/:playerId', auth, async (req, res) => {
    try {
        await Squad.findOneAndDelete({ userId: req.userId, playerId: req.params.playerId });
        res.json({ message: 'Player removed from squad' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
