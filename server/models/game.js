const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        minLength: 1
    },
    genre: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A game must have at least one genre.'
        }
    },
    plateforme: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A game must have at least one platform.'
        }
    },
    editeur: {
        type: String,
        required: false
    },
    developpeur: {
        type: String,
        required: false
    },
    annee_sortie: {
        type: Number,
        min: 1970,
        max: new Date().getFullYear() + 5
    },
    metacritic_score: {
        type: Number,
        min: 0,
        max: 100
    },
    temps_jeu_heures: {
        type: Number,
        min: 0
    },
    termine: {
        type: Boolean,
        default: false
    },
    date_ajout: {
        type: Date,
        default: Date.now
    },
    date_modification: {
        type: Date,
        default: Date.now
    }
});
gameSchema.pre('save', function (next) {
    this.date_modification = Date.now();
    next();
});

module.exports = mongoose.model('Game', gameSchema);
