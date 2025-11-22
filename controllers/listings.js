const Listing = require('../models/listing.js');

module.exports.index=async (req,res)=>{
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

}
module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs")
}
module.exports.create=async(req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename}
  await newListing.save();
  req.flash("success","New listing Created!");
  res.redirect("/listings");
}
module.exports.show=async (req,res)=>{
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
}
module.exports.renderEditForm=async (req,res)=>{
  let {id}=req.params
  const listing=await Listing.findById(id)
  if(!listing){
    req.flash("failure","listing you requested for doesn't exist!")
    return res.redirect("/listings")
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/c_fill,h_300,w_400")

  res.render("listings/edit.ejs",{listing,originalImageUrl})
   
}
module.exports.updateListing=async(req,res)=>{
   if(!req.body||!req.body.listing){
    throw new ExpressError(400, "Send valid data for listing");
    
  }
  let {id}=req.params
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
  if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
  }
   req.flash("success","Listing updated!");
  res.redirect(`/listings/${id}`)
}
module.exports.destroyListing=async (req,res)=>{
  let {id}=req.params
  await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
  res.redirect("/listings")

}

