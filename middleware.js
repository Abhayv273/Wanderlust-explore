import Listing from "./models/listing.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema ,reviewSchema } from "./schema.js";
import Review from "./models/review.js"; 

//logged user check middleware function
export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
     req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};
// stay current page after login 
export const saveRedirectUrl =(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next();
};

//owner check middleware fnx
export const isOwner = async(req,res,next)=>{
  let{id}=req.params;
  let listing = await Listing.findById(id);
 if(!listing.owner.equals(res.locals.currUser._id)){
  req.flash("error","You are not owner of this listing");
 return  res.redirect(`/listings/${id}`);
 }
 next()
};

//*****validation middleware functions******

// 1.listings

export const validateListing =(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
    }else{
      next();
    }
};
//2.for  review schema
export const validateReview =(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
    }else{
      next();
    }
};

//......delete post middleware
export const isReviewAuthor = async(req,res,next)=>{
  let{id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
next();
};
