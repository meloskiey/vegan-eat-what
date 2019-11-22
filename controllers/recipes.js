const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const middleware = require("../middleware/index.js");


//Index -show all recipes
router.get("/", function(req,res){
    // res.render("recipes",{recipes:recipes});
    Recipe.find({}, function(err, allRecipes){
        if(err){
            console.log(err);
        } else {
            res.render("recipe/index",{recipes:allRecipes, currentUser: req.user});
        }
    });
});

//Create route
router.post("/", middleware.isLoggedIn, function(req,res){
const name = req.body.name;
const image = req.body.image;
const desc =  req.body.description;
const author = {
     id: req.user._id,
     username: req.user.username
}
const newRecipe = {name:name, image:image, description:desc, author:author}
Recipe.create(newRecipe, function(err, newlyCreated){  
    if(err){
        console.log(err);
    } else {
        console.log(newlyCreated);
        res.redirect("/recipes")
        }
    });
});

//new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("recipe/new");
});

//Show route
router.get("/:id", function(req,res){
    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
        if(err){
            console.log(err);
        } else {
            console.log(foundRecipe)
            res.render("recipe/show.ejs",{recipe: foundRecipe});
        }
    });
});

//edit recipe route
router.get("/:id/edit", middleware.checkRecipeOwnership, function(req,res){
        Recipe.findById(req.params.id, function(err, foundRecipe){
            res.render("recipe/edit.ejs", {recipe: foundRecipe});
    });
});

//update recipe route
router.put("/:id", middleware.checkRecipeOwnership, function(req,res){
    //find and update the correct recipe
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
        if(err){
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
    //redirect somewhere(show page)
});

//destroy recipe route
router.delete("/:id", middleware.checkRecipeOwnership, function(req,res){
     Recipe.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/recipes");
         } else{
             res.redirect("/recipes");
         }
     });
});




module.exports = router;