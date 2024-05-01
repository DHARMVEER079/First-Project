const mongoose= require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
title:{
    type : String,
    required : true,
    },
description: String,
// image: {
//     url: {
//     type: String,
//     // default:"https://images.unsplash.com/photo-1575936123452-b67c3203c357"
//   }
// },

image: {
    type: String,
    default:"https://www.istockphoto.com/photo/silhouette-of-coconut-palm-trees-at-sun-set-at-colva-beach-in-goa-inda-gm1272962000-375079143",
    set:(v)=> v === "" ? "https://www.istockphoto.com/photo/silhouette-of-coconut-palm-trees-at-sun-set-at-colva-beach-in-goa-inda-gm1272962000-375079143" 
    : v,
},

// image: {
//     filename: String,
//     // url: String
// }, 


price : Number,
location : String,
country : String,

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;