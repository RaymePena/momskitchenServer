const mongoose = require('mongoose')

const groceryList = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: Boolean,

    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "user",
        required: true
    }
})

module.exports = mongoose.model('grocery', groceryList)