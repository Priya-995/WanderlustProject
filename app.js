const express=require('express');
const mongoose = require("mongoose");
const Listing = require('./models/listing.js');
const app=express();
const path = require('path');
const PORT =  3000;
const methodOverride=require('method-override')
const ejsMate=require("ejs-mate")
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js')
const {listingSchema}=require('./schema.js')
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the directory where the views are located
app.set('views', path.join(__dirname, 'views'));
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"))
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
// Middleware to serve the public folder
app.use(express.static(path.join(__dirname, '/public')));


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log('connected to DB');
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
   


app.get("/",(req,res)=>{
  res.send("res send")
})
const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body)
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg )
  }else{
    next();
  }
}

//⁡⁢⁢⁣index route⁡
app.get("/listings",wrapAsync(async (req,res)=>{
  //⁡⁣⁣⁢For printing the whole data⁡
  // Listing.find({}).then((res)=>{
  //   console.log(res)
  // })
  
  const listingsData= await Listing.find({})
  res.render("listings/index.ejs",{listingsData});

}))

//NEW 
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs")
})

//CREATE
//⁡⁢⁢⁣A POST request is a way for a client (like your browser or app) to send data to a server.
//Purpose: Usually to create new data or submit information.
//Data goes in the body of the request (not the URL).⁡
app.post("/listings",validateListing, wrapAsync(async(req, res, next) => {

  
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));
// SHOW ROUTE
app.get("/listings/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params
  let listing=await Listing.findById(id)
  res.render("listings/show.ejs",{listing})
}))

//EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
  let {id}=req.params
  const listing=await Listing.findById(id)
  res.render("listings/edit.ejs",{listing})
   
}))

// UPDATE ROUTE
app.put("/listings/:id",wrapAsync(async(req,res)=>{
   if(!req.body||!req.body.listing){
    throw new ExpressError(400, "Send valid data for listing");
    
  }
  let {id}=req.params
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`)
}))

//DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings")

}))

app.use((req,res,next)=>{
   next(new ExpressError(404,"Page not Found!"))
})

app.use((err, req, res, next) => {
 
  let {status=500, message="Something went wrong!"} = err;
  res.status(status).render("error",{message}); 
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})
