const Review = require("../models/review");
const Listing = require("../models/listing.js");

//creating reviews post route
module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    req.flash("success","New Review Created");
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
};

// delete reviews
module.exports.destroyReview = async (req,res) => {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // pull operator to remove review reference from listing
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};