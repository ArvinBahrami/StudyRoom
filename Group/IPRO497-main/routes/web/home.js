var express = require("express");
var passport = require("passport");

var User = require("../../models/user");

var router = express.Router();


router.get("/", function (req, res) {
   // console.log("hello I'm on the start page");
   res.render("home/");
});

router.get("/home", function (req, res) {
   res.render("home/home");
});

router.get("/reserve", function (req, res) {
   if(res.locals.currentUser == null) {
      res.render("home/login");
   } else {
      res.render("home/reserve");
   }
});

router.get("/login", function (req, res) {
   res.render("home/login")
});

router.get("/book", function (req, res) {
   res.render("home/book")
});

router.get("/profile", function (req, res) {
   res.render("home/profile")
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

router.post("/login", passport.authenticate("login", {
   successRedirect: "/home",
   failureRedirect: "/login",
   failureFlash: true
}));

router.get("/signup", function (req, res) {
   res.render("home/signup")
});

router.post("/signup", function (req, res, next) {

   var First_Name = req.body.First_Name;
   var Last_Name = req.body.Last_Name;
   var A_id = req.body.A_id;
   var email = req.body.email;
   var password = req.body.password;
   var repassword = req.body.repassword;

   if(password != repassword){
      return res.redirect("/signup");
   }

   User.find({$or: [{email: email},{A_id : A_id}]}, function (err, user) {
      if (err) {
         console.log("Error when creating new user in sign up") 
         return next(err); 
      }
      if (user[0]){
         req.flash("error", "There's already an account with this email or this id");
         return res.redirect("/signup");
      }
      if (user[1]){
         req.flash("error", "There's already an account with this email or this id");
         return res.redirect("/signup");
      }

      var newUser = new User({
         First_Name: First_Name,
         Last_Name: Last_Name,
         A_id: A_id,
         email: email,
         password: password
      });

      newUser.save(next);

   });

}, passport.authenticate("login", {
   successRedirect: "/home",
   failureRedirect: "/signup",
   failureFlash: true
}));

module.exports = router;
