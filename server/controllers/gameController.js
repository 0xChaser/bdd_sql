const Game = require('../models/game');

exports.createGame = async (req, res) => {
    try {
        console.log('Creating game:', req.body);
        const game = new Game(req.body);
        const savedGame = await game.save();
        res.status(201).json(savedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const { genre, plateforme } = req.query;
        const filter = {};

        if (genre) {
            filter.genre = genre;
        }

        if (plateforme) {
            filter.plateforme = plateforme;
        }

        const games = await Game.find(filter);
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateGame = async (req, res) => {
    try {
        console.log('Updating game:', req.params.id, req.body);
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const totalGames = await Game.countDocuments();
        const totalPlayTime = await Game.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$temps_jeu_heures" }
                }
            }
        ]);

        res.status(200).json({
            totalGames,
            totalPlayTime: totalPlayTime[0] ? totalPlayTime[0].total : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
