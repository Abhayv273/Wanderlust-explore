import User from "../models/user.js";

// signup route get cb
export const renderSignupForm =(req,res)=>{
  res.render("users/signup.ejs");
}

// signup route post cb
export const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
         req.flash("success", "Welcome to Wanderlust!");
         return res.redirect("/listings");
    })
    
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
}

// login route get cb
export const renderLoginForm =(req,res)=>{
  res.render("users/login.ejs");
}

//login route post cb
export const login = async(req,res)=>{
    req.flash("success","Welcome Back To Wanderlust!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
  }

  // logout route cb
  export const logout =(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out!");
    res.redirect("/listings");
  });
};