if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing");
const path = require("path");
app.use(express.urlencoded({extended:true}));
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
// const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// routes files
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

const dburl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dburl);
}

const store = new MongoStore({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60, 
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 100,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student02@gmail.com",
//         username:"Student02",
//     });
//     let registeredUser = await User.register(fakeUser,"student01");
//     res.send(registeredUser);
// });

// using router for listings :
app.use("/listings", listingRouter);
// using router for reviews :
app.use("/listings/:id/reviews", reviewRouter);
// using router for user signup 
app.use("/",userRouter);

// app.get("/testlisting",async (req,res) => {
//     const testlisting = new Listing({
//         title: "Cozy Cottage",
//         description: "A cozy cottage in the countryside.",
//         image: "",
//         price: 150,
//         location: "Countryside",
//         country: "Wonderland",
//     });
//     await testlisting.save();
//     console.log("test sample was saved");
//     res.send("test sample was created");
// });

//sending a 404 error for all other routes -----
app.all("*path", (req,res,next) => {
    // res.send("404! page not found");
    next(new ExpressError("Page Not Found", 404));
});

//middleware for error handling-----
app.use((err, req, res, next) => {
    // console.log("something went wrong");
    // res.send("oops! something went wrong");
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

