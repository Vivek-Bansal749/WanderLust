const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"69709c2b9d49b00d66b99114"}));
    console.log("Cleared existing listings");
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();