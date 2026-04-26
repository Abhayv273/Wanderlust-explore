
import "dotenv/config";  
import { storage } from "./cloudConfig.js";
import multer from "multer";
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 
}});
import express from "express";
import mongoose from "mongoose";
// import Listing from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from"method-override";
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js"; 
// import { listingSchema ,reviewSchema } from "./schema.js";
// import Review from "./models/review.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import{isLoggedIn,
  isOwner,
  isReviewAuthor,
  validateListing,
  validateReview,
  saveRedirectUrl} from "./middleware.js";
// import {saveRedirectUrl} from "./middleware.js"
import * as listingController from "./controllers/listings.js";
import * as reviewController from "./controllers/reviews.js";
import * as userController from "./controllers/users.js";


//app init
const app = express();

// static files acessing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//used or intialise 
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate );
//static file ,public (css,java)
app.use(express.static(path.join(__dirname,"/public")));  


//db server created

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
 const dbUrl = process.env.ATLASDB_URL;
 async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


  
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error",(err)=>{
  console.log("Error in MONGO SESSION STORE",err);
});


//session create
const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }

};


//session middleware
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals define
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



// *****users router******

//1.signup route
app.get("/signup", userController.renderSignupForm);
// controllers/users-signupform get

app.post("/signup", wrapAsync(userController.signup));
// controllers/users-signup post


//2.login route
app.get("/login",userController.renderLoginForm);
// controllers/users-signup get 


app.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
  }),
 userController.login
);








// async function main() {
//   await mongoose.connect(dbUrl);
// }
// main();


// const validateListing =(req,res,next)=>{

//   let {error}=listingSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400,errMsg);
//     }else{
//       next();
//     }
// };



   //*******index route******
  app.get("/listings",wrapAsync(listingController.index)
  // controllers/listings-index
   );
   
  //*******reveiw route ********

  //1.  review post route
  app.post("/listings/:id/reviews",
  isLoggedIn,
  validateReview ,
   wrapAsync(reviewController.createReview));
     // controllers/reviews-createreview


 //2. delete review route,
  app.delete("/listings/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));
    //controllers/reviews-destroyreview


  //*******new route********(keep always on before of show route)
  app.get("/listings/new",isLoggedIn, listingController.rendernewform);
    //controllers/listing-rendernewform


   //*******Show Route********
   app.get("/listings/:id", wrapAsync(listingController.showListing)
      // controllers/listings-showlisting 
    );

//*******create route ( new listing /request vai hoppscotch )********
app.post("/listings",validateListing,
   isLoggedIn,
   upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
 // controllers/listings-createlisting 
);


//*******Edit Route********
app.get("/listings/:id/edit",
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.renderEditForm)
   // controllers/listings-rendereditform
);


//*******Update Route*******
app.put("/listings/:id",validateListing,
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingController.updateListing)
// controllers/listings-upadatelisting
);


//******Delete Route********
app.delete("/listings/:id",
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.destroyListing)
   // controllers/listings-destroylisting
);


//********Users-logout route***************
app.get("/logout",userController.logout);
// controllers/user-logout

//*****Seach route */
app.get("/search",wrapAsync(listingController.searchListings))
// controllers/listings-searchlisting



//######for all unknown/ route v5express
//root page
app.get("/", (req, res,next) => {
  res.redirect("/listings");

});

//  404 handler (ONLY FOR UNKNOWN ROUTES)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


//######error handling 
app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something Went Wrong"}=err;
  console.log(err);
   res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
  

  
})



// server stabalise
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});