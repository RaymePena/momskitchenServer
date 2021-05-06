const express = require('express');
const router = express.Router();
const groceryController = require('./grocery-controller');
const authServices = require('../../services/auth-service');

router.post('/grocery', authServices.requireLogin, groceryController.addGrocery);
router.get('/grocery',authServices.requireLogin, groceryController.fetchAllGroceries);
router.delete('/grocery/:id', authServices.requireLogin, groceryController.deleteGrocery)

module.exports = router;