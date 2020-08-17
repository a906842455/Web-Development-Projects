const mongoose = require("mongoose");
const Comment = require('./comment');


const campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   price: String,
   description: String,
	//make comments as an array of comment's id
   author: {
	   id: {
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "User"
	   },
	   username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

// PRE HOOK THE MODEL, SO IF WE DELETE CAMPGROUNDS, WE DELETE ALL COMMENTS ON THAT CAMPGROUND
campgroundSchema.pre('findByIdAndRemove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});
 
module.exports = mongoose.model("Campground", campgroundSchema);