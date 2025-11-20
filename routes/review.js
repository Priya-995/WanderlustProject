const express=require('express');

const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn,validateReview,isReviewAuthor}=require('../middleware.js')

const router=express.Router({mergeParams:true});
const ReviewController=require("../controllers/reviews.js")



//REVIEW
//POST ROUTE
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createReview))


//REVIEW
//DELETE  ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview))

module.exports=router;

