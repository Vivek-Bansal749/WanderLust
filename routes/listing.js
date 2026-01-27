const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
// const {listingSchema} = require("../schema.js");
// const ExpressError = require("../utils/ExpressError");
// const Listing = require("../models/listing");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//router.route for /listing route for get and post method
router.route("/").get(wrapAsync(listingController.index)).post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing));


//create new listing form route ------
router.get("/new", isLoggedIn,listingController.renderNew);


//router.route for /:id route for get, post and delete method
router.route("/:id").get(wrapAsync(listingController.showListings)).put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing)).delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


//edit listing form route -----
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));


// // index route
// router.get("/",wrapAsync(listingController.index));


// //show route-------
// router.get("/:id", wrapAsync(listingController.showListings));


// //create listing route -----
// router.post("/",validateListing, isLoggedIn,wrapAsync(listingController.createListing));


// //update listing route -----
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));


// //delete listing route -----
// router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;