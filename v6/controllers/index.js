const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function(req,res){
    res.render("landing");
});
//Auth Routes
//show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handle signup logic
router.post("/register",function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to Vegan, eat what? " + user.username);
            res.redirect("/recipes");
        });
    });
});

//show login form
router.get("/login", function(req,res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {   
        successRedirect:"/recipes",
        failureRedirect:"/login"
    }), function(req,res){
});

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/recipes");
});

module.exports = router;