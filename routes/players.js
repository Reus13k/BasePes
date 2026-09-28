const express = require('express');
const Player = require('../models/Player');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all players with filters
router.get('/', async (req, res) => {
    try {
        const { position, nation, club, rarity, minOverall, search } = req.query;
        
        const filter = {};
        
        if (position) filter.position = position;
        if (nation) filter.nation = nation;
        if (club) filter.club = club;
        if (rarity) filter.rarity = rarity;
        if (minOverall) filter.overall = { $gte: parseInt(minOverall) };
        if (search) filter.name = { $regex: search, $options: 'i' };

        const players = await Player.find(filter).sort({ overall: -1 });
        
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single player
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add player (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        const { name, club, nation, position, overall, rarity, pace, shooting, passing, dribbling, defense, physical, price } = req.body;
        
        const player = new Player({
            name,
            club,
            nation,
            position,
            overall,
            rarity,
            pace,
            shooting,
            passing,
            dribbling,
            defense,
            physical,
            price: price || 50000
        });

        await player.save();
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete player (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
