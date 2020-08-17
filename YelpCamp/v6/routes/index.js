const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user");

//Landing Page root route
router.get("/", function(req, res){
	res.render("landing");
});

//AUTH Routes

//show register format
router.get("/register", function(req, res){
	res.render("register");
})

//handle sign up logic
router.post("/register", function(req, res){
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Yelpcamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
})

//handling login logic
//format: app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
										 {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res){});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("error", "Logged you out!")
	res.redirect("/campgrounds")
})

module.exports = router;