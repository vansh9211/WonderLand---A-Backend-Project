const mongoose = require("mongoose");

const listingModel = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/221387/pexels-photo-221387.jpeg?cs=srgb&dl=pexels-pixabay-221387.jpg&fm=jpg",
    set: (v) =>
      v === ""
        ? "https://images.pexels.com/photos/221387/pexels-photo-221387.jpeg?cs=srgb&dl=pexels-pixabay-221387.jpg&fm=jpg"
        : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

const Listing = mongoose.model("Listing", listingModel);

module.exports = Listing;
