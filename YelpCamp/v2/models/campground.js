const mongoose = require("mongoose");
 
const campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
	//make comments as an array of comment's id
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema);