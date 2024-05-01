const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path =require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");


const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

app.set("view engine ", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
  res.send("hi, i am root");
});

//index route
app.get("/listings",wrapAsync(async(req,res)=>{
 const allListings =await Listing.find({});
//  console.log(allListings);
 res.render("listings/index.ejs",{allListings});
 
}));

//new route
app.get("/listings/new",(req,res)=>{
res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);

 
  res.render("listings/show.ejs",{listing});

}));

//create route
app.post("/listings",wrapAsync( async(req,res,next)=>{

  let result = listingSchema.validate(req.body);
  console.log(result);
  const  newListing = new Listing(req.body.listing);
  // try{
    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listings")
    // }
    // const newListing = new Listing(req.body.listing);
    // if(!newListing.title){
    //   throw new ExpressError(400,"title is misssing!");
    // }
    // if(!newListing.description){
    //   throw new ExpressError(400,"Description is misssing!");
    // }
    // if(!newListing.location){
    //   throw new ExpressError(400,"location is misssing!");
    // }
    await newListing.save();
    res.redirect("/listings");

})
);
  // }
  // catch(err){
  //   next(err);
  // }
  
  // let listing=req.body.listing;
  // console.log(listing);

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  res.render("listings/edit.ejs",{listing});

}));

//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listings")
  }
  let {id}=req.params;
 await Listing.findByIdAndUpdate(id, {...req.body.listing});
 res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  let {id} = req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));



// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "my new villa",
//     description: "by the beach",
//     price: 1200,
//     location: "calanguate , goa",
//     country: "india",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("sucessful testing");
// });

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
  // res.send("something went wrong!");
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
