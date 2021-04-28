const express = require('express');
const router = express.Router();
const groceryController = require('./grocery-controller');
const authServices = require('../../services/auth-service');

router.post('/grocery', authServices.requireLogin, groceryController.addGrocery);
// router.get('/recipe', recipeController.index);
router.get('/grocery',authServices.requireLogin, groceryController.fetchAllGroceries);
router.delete('/grocery/:id', authServices.requireLogin, groceryController.deleteGrocery)
// router.put('/recipe', authServices.requireLogin, recipeController.update);
// router.delete(
// 	'/recipe/:id',
// 	authServices.requireLogin,
// 	recipeController.remove
// );

module.exports = router;