import Listing from "../models/listing.js";
import Review from "../models/review.js";


//review post route cb
export const createReview =async(req,res)=>{
  let listing =await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  newReview.author = req.user._id;
  // console.log(req.user);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
 req.flash("success","Review Created!");
 res.redirect(`/listings/${listing._id}`);

}

// review post destroy
export const destroyReview =async(req,res)=>{
  let {id,reviewId }= req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
  await Review.findByIdAndDelete(reviewId);
 req.flash("success","Post Deleted!");
  res.redirect(`/listings/${id}`);
};

// average calculate
