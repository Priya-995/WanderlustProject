const express=require('express');
const Listing = require('../models/listing.js');
const wrapAsync=require('../utils/wrapAsync.js');

const router = express.Router()
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js')




//⁡⁢⁢⁣index route⁡
router.get("/",wrapAsync(async (req,res)=>{
  //⁡⁣⁣⁢For printing the whole data⁡
  // Listing.find({}).then((res)=>{
  //   console.log(res)
  // })
  const {category}=req.query;
  let filter={}
  if(category&&category!='all'){
    filter.category=category
  }
  
  const listingsData= await Listing.find(filter)
  res.render("listings/index.ejs",{listingsData,selectedCategory:category||'all'});

}))

//NEW 
router.get("/new",isLoggedIn,(req,res)=>{
  res.render("listings/new.ejs")
})

//CREATE
//⁡⁢⁢⁣A POST request is a way for a client (like your browser or app) to send data to a server.
//Purpose: Usually to create new data or submit information.
//Data goes in the body of the request (not the URL).⁡
router.post("/",validateListing, wrapAsync(async(req, res, next) => {

  
  
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success","New listing Created!");
  res.redirect("/listings");
}));

// SHOW ROUTE
router.get("/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params
  let listing=await Listing.findById(id).populate({path:"reviews",
    populate:{
      path:"author"
    }

  }).populate("owner")

  if(!listing){
    req.flash("failure","listing you requested for doesn't exist!")
    return res.redirect("/listings")
  }
  res.render("listings/show.ejs",{listing})
}))

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
  let {id}=req.params
  const listing=await Listing.findById(id)
  if(!listing){
    req.flash("failure","listing you requested for doesn't exist!")
    return res.redirect("/listings")
  }
  res.render("listings/edit.ejs",{listing})
   
}))

// UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
   if(!req.body||!req.body.listing){
    throw new ExpressError(400, "Send valid data for listing");
    
  }
  let {id}=req.params
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
   req.flash("success","Listing updated!");
  res.redirect(`/listings/${id}`)
}))

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
  let {id}=req.params
  await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
  res.redirect("/listings")

}))
module.exports = router