const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index=async (req,res)=>{
  //⁡⁣⁣⁢For printing the whole data⁡
  // Listing.find({}).then((res)=>{
  //   console.log(res)
  // })
  const {category,search}=req.query;
  let filter={}
  if(category&&category!='all'){
    filter.category=category
  }
   // Search filter - searches across title, location, country, category, description
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i'); // case-insensitive regex
    // If category is also selected, combine both filters
    if (filter.category) {
      filter.$and = [
        { category: filter.category },
        {
          $or: [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { description: searchRegex }
          ]
        }
      ];
      delete filter.category; // Remove since it's now in $and
    } else {
      // Search only (no category filter)
      filter.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }
  }
  const listingsData= await Listing.find(filter)
  res.render("listings/index.ejs",{listingsData,selectedCategory:category||'all',
  search:search || '' });
}


module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs")
}


module.exports.create=async(req, res, next) => {
  let response =await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
  }).send();
 
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename}
  newListing.geometry=response.body.features[0].geometry; // adding coordinates
  let savedListing=await newListing.save();
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

