const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect to originalUrl means after login rendering the page user wanted to use before login
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to perform any action");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Only the owner can delete this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
//validation middleware
module.exports.validateListing = (req,res,next) => {
    const {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    else{
        next();
    }
}

//validation middleware for reviews
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    else{
        next();
    }
}

// review autherization for users
module.exports.isReviewAuthor  = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Only the author can edit this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}