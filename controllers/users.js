const User = require("../models/user")

// redner sign up page
module.exports.renderSignupForm = (req, res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
         let { username, email, password} =req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);

    //passport login method used to login to site when new user signes up, means user no need to login after signup.
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
    }
    catch(e){
        req.flash("error","Username already existed");
        res.redirect("/signup");
    }
};

// render lgoin page for user
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};


// login page for user
module.exports.login = async(req,res)=>{
    // res.send("welcome to wanderlust you are loged in");
    req.flash("success","Welcome back to Wanderlust ! You are logged in! ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// 
module.exports.logoutUser = (req,res,next)=>{
    //passport logout method to logout the user if logged in, it requires the callback fn to deal with error.
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out of Wanderlust");
        res.redirect("/listings");
    });
};