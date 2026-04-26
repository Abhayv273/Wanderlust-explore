import Listing from "../models/listing.js";
import { listingSchema ,reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js"; 
import * as maptilersdk from '@maptiler/sdk';
// import { geocoding } from "@maptiler/client";

import { config, geocoding } from '@maptiler/client';
const mapToken =process.env.MAP_TOKEN;
config.apiKey = mapToken;



export const index = async (req, res) => {
  // console.log(req.user);

  const { category } = req.query;   // 🔥 get category from URL

  let allListings;

  if (category) {
    allListings = await Listing.find({ category });  // 🔥 filter
  } else {
    allListings = await Listing.find({});            // 🔥 all listings
  }

  res.render("listings/index.ejs", { allListings, category});
};

//new route cb
export const rendernewform= (req,res)=>{
  // console.log(req.user); 
    res.render("listings/new.ejs")
};

//show route cb
export const showListing= async(req,res)=>{
   let {id}=req.params;
   const listing = await Listing.findById(id)
  //  .populate("reviews").populate("owner"); nesting i used below// post delete whenever list del
.populate({
    path:"reviews",
      populate:{
    path:"author",
  },
  })
  .populate("owner");
   
   if(!listing){
     req.flash("error","Listing you requested does not exist!");
     return res.redirect("/listings");
   }
  //  console.log(listing);
   res.render("listings/show.ejs",{listing });
}

//create route cb
export const createListing = async(req,res)=>{
 const query= req.body.listing.location;
const response = await geocoding.forward(
  query,
  { limit: 1 }
);

  let url =req.file.path;
  let filename=req.file.filename;
const result = listingSchema.validate(req.body);
// console.log(result);
  const newListing= new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner =req.user._id; 
  newListing.image ={url,filename};
  newListing.geometry= response.features[0].geometry;
  let savedListing =await newListing.save();
  // console.log(savedListing);
  // await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}

// edit route cb
export const renderEditForm = async (req, res) => {
 let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
     req.flash("error","Listing you requested does not exist!");
     return res.redirect("/listings");
   }

   let originalImageUrl =listing.image.url;
   originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
  // console.log(listing);
}

//update route cb

export const updateListing= async(req, res) => {
  //database mismatch data input error
  if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listings")
  }
  let { id } = req.params;
  let  listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
   req.flash("success","Listings Updated!");
  res.redirect(`/listings/${id}`);
}

// delete route cb
export const destroyListing =async(req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
   req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}


//search route
export const searchListings= async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ]
  });

  res.render("listings/index.ejs", { allListings: listings });
};

