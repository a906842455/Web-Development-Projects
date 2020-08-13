const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
let campgrounds = [
		{name: "Salmon Creek", image:"https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg"},
		{name: "Granite Hill", image: "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false"}	];

//Landing Page route
app.get("/", function(req, res){
	res.render("landing");
});

//convention name for all campgrounds
app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds:campgrounds});
	//left is name, right is data passed in
});

//convention name to create a campground
app.post("/campgrounds", function(req, res){
	//can use postman to see the post, get's results
	
	//get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	//redirect back to campgrounds page
	res.redirect("/campgrounds");
});

//convention name to show the form that would send data to post route.
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});


app.listen(3000, function(){
	console.log("YelpCamp Server Has Started")
})