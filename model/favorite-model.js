const mongoose = require('mongoose')

const favoriteModel = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    recipeId: String
})

favoriteModel.set('timestamps', true);

module.exports = mongoose.model('favorites', favoriteModel)