const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
  const { category,search } = req.query;

  let filter = {};


if (search) {
  filter.$or = [
    { title: new RegExp(search, "i") },
    { location: new RegExp(search, "i") },
    { country: new RegExp(search, "i") }
  ];
}

  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);

  res.render("./listings/index.ejs", { allListings,search, category });
};


//create new listing form route ------
module.exports.renderNew = (req,res) => {
    res.render("./listings/new.ejs");
};


//show route-------
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { listing });
};


//create listing route -----
module.exports.createListing = async (req,res,next) => {
    // try{
    // if(!req.body.listing) throw new ExpressError("Invalid Listing Data", 400);
    // let {tittle, description, image, price, location, country} = req.body;
   
    // if(!req.body.listing.title) throw new ExpressError("title is missing", 400);
    //  if(!req.body.listing.description) throw new ExpressError("description is missing", 400);
    //   if(!req.body.listing.country) throw new ExpressError("country is missing", 400);
    //    if(!req.body.listing.price) throw new ExpressError("price is missing", 400);
    //     if(!req.body.listing.location) throw new ExpressError("location is missing", 400);
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //     throw new ExpressError(result.error.details[0].message, 400);
    // }
    // extracting the info of image uploaded by user at the cloud
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"...", filename)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    // console.log(listing);
    // }catch(err){
    //     next(err);
    // }
};

//edit route for listings
module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }else{
         let originalImageUrl = listing.image.url;
        originalImageUrl=originalImageUrl.replaceAll("/upload","/upload/h_300,w_250");
        res.render("./listings/edit.ejs", {listing,originalImageUrl});
    }
    
};


// update listings
module.exports.updateListing = async (req,res) => {
    //  if(!req.body.listing) throw new ExpressError("Invalid Listing Data", 400);
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","Only the owner can edit this listing!");
    //     return res.redirect(`/listings/${id}`);
    // }
    if (!req.body.listing.category) {
    req.body.listing.category = [];
  }else if (!Array.isArray(req.body.listing.category)) {
    req.body.listing.category = [req.body.listing.category];
  }


    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators:true, new:true});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    console.log(req.body.listing);
    req.flash("success","List Updated");
    res.redirect(`/listings/${id}`);
};


//delete listings
module.exports.deleteListing = async (req,res) => {
    const {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    req.flash("success","Listing Deleted Successfuly!");
    res.redirect("/listings");
};