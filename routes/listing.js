const express=require('express');
const wrapAsync=require('../utils/wrapAsync.js');

const router = express.Router()
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js')
const listingController=require("../controllers/listings.js")
const multer = require('multer');
const {storage}=require('../cloudConfig.js')
const upload=multer({storage})


//⁡⁢⁢⁣index route⁡
router.get("/",wrapAsync(listingController.index))

//NEW 
router.get("/new",isLoggedIn,listingController.renderNewForm)

//CREATE
//⁡⁢⁢⁣A POST request is a way for a client (like your browser or app) to send data to a server.
//Purpose: Usually to create new data or submit information.
//Data goes in the body of the request (not the URL).⁡
router.post("/",validateListing, upload.single('listing[image]'),wrapAsync(listingController.create));


// SHOW ROUTE
router.get("/:id",wrapAsync(listingController.show))

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

// UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports = router