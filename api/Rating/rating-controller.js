const User = require('../../model/user-model')
const Review = require('../../model/rating-model')
const Recipe = require('../../model/recipe-model')
const authServices = require('../../services/auth-service')
const mongoose= require('mongoose')



exports.fetchRatings = async (req, res) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'user',
        select: 'username'
    })

    if(!review){
        res.status(404).json({message: 'No review found'})
    }

    res.status(200).json({
        success: true,
        data: review
    })
    
}

exports.getReview = async (req, res) => {
    const recipeId = req.params.id
    if(recipeId){
        const reviews = await Review.find({recipe: recipeId}).limit(6);
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    }else{
        console.log('No reipe Id')
    }
    
}

exports.addReview = async  (req, res) => {
    const userId =   authServices.getUserId(req)
    console.log(req.body.recipe, 8888)
    const recipeId = req.body.recipe

    req.body.recipe = req.body.recipe
    req.body.user = authServices.getUserId(req)

    console.log(req.body)


    const recipe = await Recipe.findById(recipeId);
    if(!recipe){
        return res.status(404).json({message: 'Not recipe found'})
    }
    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })

    // User.findOne({_id: userId}, (error, user) => {
    //     if(error){
    //         return res.status(500).json()
    //     }

    //     const rating = new Rating({
    //         title: req.body.title,
    //         rating: req.body.rating,
    //         comment: req.body.comment,
    //         recipeId: req.body.recipeId,
    //         author: user._id
    //     });

    //     console.log(rating)

    //     rating.save(error => {
    //         if(error){
    //             return res.status(500).json()
    //         }
    //         return res.status(200).json()
    //     })
        
    // })
    // return res.status(200).json()
    
}