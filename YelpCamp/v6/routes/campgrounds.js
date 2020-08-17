const express = require("express"),
	  router = express.Router(),
	  Campground = require("../models/campground"),
	  //below is same as require "../middleware/index.js"
	  middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
			//left is name, right is data passed in
		}
	})
});

//CREATE route: create a campground
router.post("/", middleware.isLoggedIn, function(req, res){
	//can use postman to see the post, get's results
	
	//get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let price = req.body.price;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {name: name, price: price, image: image, description: desc, author: author};
	//create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	})
});

//NEW route: show the form that would send data to post route.
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW- shows more info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided id
	//to populate a database means to add data to it.
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found")
			res.redirect("back");
		} else {
			//render the show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect to the show page	
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;