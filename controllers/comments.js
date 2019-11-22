const express = require("express");
const router = express.Router({mergeParams: true});
const Recipe = require("../models/recipe");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

//Comments Routes
//New
router.get("/new", middleware.isLoggedIn, function(req,res){
    Recipe.findById(req.params.id, function(err, recipe){
        if(err){
            console.log(err);
        } else {
            res.render("comment/new", {recipe: recipe});
        }
    })
});

//Create
router.post("/", middleware.isLoggedIn, function(req,res){
    Recipe.findById(req.params.id, function(err,recipe){
        if(err){
            console.log(err);
            res.redirect("/recipes");
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    recipe.comments.push(comment);
                    recipe.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/recipes/" + recipe._id);
                }
            });
        }
    });
});

//edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else { 
            res.render("comment/edit.ejs", {recipe_id: req.params.id, comment: foundComment});
        }
    }); 
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

//Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/recipes/" + req.params.id);
        }
    });
});




module.exports = router;