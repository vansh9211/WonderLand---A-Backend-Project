const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

async function connectToDB() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLand");
}
connectToDB().then(() => console.log("Connection Successfully")).catch((err) => console.log("error msg :" + err));

// for initialize database with basic values, not compulsory to make these file