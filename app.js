const express = require("express");
const app     = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const flash = require("connect-flash");
const passport    = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const Recipe = require("./models/recipe");
const Comment = require("./models/comment");
const User  = require("./models/user");
// const seedDB = require("./seeds");

const commentRoutes = require("./controllers/comments");
const recipeRoutes = require("./controllers/recipes");
const indexRoutes = require("./controllers/index");


mongoose.connect('mongodb+srv://meloskiey:<Whatthehell95>@cluster0-wbvpt.mongodb.net/test',
    {useNewUrlParser: true,
        useCreateIndex: true
    });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/recipes/:id/comments", commentRoutes);
app.use("/recipes", recipeRoutes);



// Recipe.create({
//     name:"salmon",
//     image:"https://www.pngkey.com/png/detail/71-715249_atlantic-salmon-salmon-atlantic.png",
//     description:"It is pink on the inside and is not vegan"
// }, function(err, recipe){
//     if(err){
//         console.log(err);
//     } else{
//         console.log(recipe);
//     }
// });




  
// app.get("/recipes/:id", function(req,res){
//     res.send("here you are mother fucker")
// });




app.listen(process.env.PORT);