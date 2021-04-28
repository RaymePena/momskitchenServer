const express = require('express')
const router = express.Router();
const ratingController = require('./rating-controller')
const authServices = require('../../services/auth-service')


router.post('/rating', authServices.requireLogin ,ratingController.addReview)
router.get('/rating/:id', ratingController.getReview)


module.exports = router;