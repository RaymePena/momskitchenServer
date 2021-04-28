const mongoose = require('mongoose')
const Recipe = require('./recipe-model')

const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
   
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    createAt:{
        type: Date,
        default: Date.now
    },

    recipe: {
        type: mongoose.Schema.ObjectId,
        ref: 'recipe',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
         ref: 'user',
         required: true
        },
        

    comment: String,
    
})

//Prvent same user  from adding multiple reviews to the same recipe.
ReviewSchema.set({recipe: 1, user: 1}, {unique: true})

//static method to get the average rating save

ReviewSchema.statics.getAverageRating = async function(recipeId){
    
    const obj = await this.aggregate([
        {
            $match: {recipe: recipeId}
        },
        {
            $group: {
                _id: '$recipe',
                averageRating: {$avg: '$rating'}
            }
        }

    ]);
    // console.log(obj, 888)
    try {
        await this.model('recipe').findByIdAndUpdate({_id: recipeId}, {
            averageRating: obj[0].averageRating
        })
    }catch(err){
        console.log(err)
    }
}

ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.recipe)
})

ReviewSchema.pre('delete', function(){
    this.constructor.getAverageRating(this.recipe)
})


module.exports = mongoose.model('rating', ReviewSchema)


