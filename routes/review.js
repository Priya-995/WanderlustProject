const express=require('express');
const Listing = require('../models/listing.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const {reviewSchema}=require('../schema.js')
const Review=require("../models/review.js")
const router=express.Router({mergeParams:true});

const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body)
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg )
  }else{
    next();
  }
}

//REVIEW
//POST ROUTE
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review)
  listing.reviews.push(newReview)
  await newReview.save()
  await listing.save()
  req.flash("success","Thanks for sharing your thoughts!");
  res.redirect(`/listings/${listing._id}`)

}))
//REVIEW
//DELETE  ROUTE
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
  // ⁡⁢⁢⁢The $pull operator removes from an existing array all instances of a value or values that match a specific condition.⁡
  await Review.findByIdAndDelete(reviewId)
  req.flash("success","Review removed successfully!");
  res.redirect(`/listings/${id}`)

}))

module.exports=router;

