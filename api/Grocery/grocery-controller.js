const User = require('../../model/user-model')
const authServices = require('../../services/auth-service')
const Grocery = require('../../model/grocery-list-model')




/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * @returns all the data from the grocery database.
 */
exports.fetchAllGroceries = async (req, res) => {
    const userId = authServices.getUserId(req)
    const user = await User.findById({_id: userId})
    
    if(!user){
        return res.status(404).json({message: 'User not Found'})
    }

    const groceries = await Grocery.find({user: userId})
    return res.status(200).json({
        success: true,
        count: groceries.length,
        data: groceries
    })

}

/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * add the grocery item to the grocery database.
 */
exports.addGrocery = async  (req, res) => {
    const userId =   authServices.getUserId(req)
    const groceryBody = {
        text: req.body.text,
        user: userId,
        completed: req.body.completed
    }
  
    const grocery = await Grocery.create(groceryBody, (error) => {
        if(error){
            return res.status(500).json()
        }
       
    })
    
    return res.status(201).json({
        success: true,
        data: grocery
    })
   
}


/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * delete items item to from the grocery database.
 */
exports.deleteGrocery = (req, res) => {
    const {id} = req.params
    console.log(id, 8888);

    Grocery.findOne({ _id: id }, (error, grocery) => {
        if (error) {
          return res.status(500).json();
        }
        if (!grocery) {
          return res.status(500).json();
        }
       
        Grocery.deleteOne({ _id: id }, (error) => {
          if (error) {
            return res.status(500).json();
          }
          return res.status(204).json();
        });
      });

}

/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * update item on grocery database.
 */
exports.update = (req, res) => {
    const groceryId = req.body.recipeId;
  
    Grocery.findOne({ _id: id }, (error, user) => {
      if (error) {
        return res.status(500).json();
      }
      if (!user) {
        return res.status(500).json({ message: "No user" });
      }
  
  
      const recipe = {
        name: req.body.recipeName,
        type: req.body.recipeType,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        servings: req.body.servings,
        share: req.body.share,
        imageUrl: imageUrl,
      };
      console.log(recipe);
      
      const recipeId = req.body._id
      recipe.author = user._id;
      
      Recipe.findByIdAndUpdate(recipeId, recipe, (error, doc) => {
       if(imageUrl !== doc.imageUrl){
         clearImage(doc.imageUrl)
       }
        if (error) {
          console.log(error);
          return res.status(500).json();
        }
        return res.status(200).json();
      });
    });
  };

    
