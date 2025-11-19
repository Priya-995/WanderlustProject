
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require('./review.js')

const listingSchema = new Schema({
  title: {
    type:String,
    required:true
    },
  description: String,
 image: {
  type: String,
  default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
},
  price:Number,
  location:String,
  country:String,
   category: {
    type: String,
    enum: ["Beachfront", "Mountains", "Countryside", "Urban"],
    required: true
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:
    {
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  
  
});
/*This code is a Mongoose middleware (also called a “hook”) that automatically runs after a listing document is deleted using findOneAndDelete(). */
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})
/*This code ensures when a listing is deleted, all its associated reviews are automatically deleted too.

post("findOneAndDelete") → runs after a listing is deleted.

if(listing) → checks if the listing existed.

Review.deleteMany({_id: {$in: listing.reviews}}) → deletes all reviews whose IDs are stored in that listing’s reviews array.

✅ Prevents orphaned reviews and keeps your database clean. */


const Listing = mongoose.model('Listing', listingSchema);
module.exports=Listing