const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  seedDB = require("./seeds");

seedDB();
//connect to the mongodb
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Landing Page route
app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
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

//convention name to create a campground
app.post("/campgrounds", function(req, res){
	//can use postman to see the post, get's results
	
	//get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let newCampground = {name: name, image: image, description: desc};
	//save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	})
});

//convention name to show the form that would send data to post route.
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//SHOW- shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided id
	//to populate a database means to add data to it.
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render the show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//Comments Routes
app.get("/campgrounds/:id/comments/new", function(req, res){
	//find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
});

app.post("/campgrounds/:id/comments", function(req, res){
	//lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//create new comment
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					//redirect campground to show page
					res.redirect('/campgrounds/' + campground._id);
				//req.body.comment gives e.g.:{text: 'aaa', author: 'Alice'};
				//name="comment[text]" format allow us to access data this way
				}
			});
		}
	});
});

app.listen(3000, function(){
	console.log("YelpCamp Server Has Started")
})