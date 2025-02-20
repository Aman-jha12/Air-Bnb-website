const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-Mate");

main().then(()=>{
    console.log("Connected to the database");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }

  app.set("view engine","ejs");
  app.set("views",path.join(__dirname,"views"));
  app.use(express.urlencoded({extended:true}));
  app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
res.send("Hi i am root");
});

//Index route
app.get("/listings",async(req,res)=>{
  const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    });

    //new
    // Route to fetch listings
app.get('/listings', async (req, res) => {
  try {
      const allListings = await Listing.find(); // Replace with your actual model fetch
      res.render('listings', { allListings });
  } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).send("Internal Server Error");
  }
});

//Create a new listing
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

app.post("/listings/new",async (req,res)=>{
  const newListing= new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
   });
 

    //show route
    app.get("/listings/:id", async (req, res) => {
      let { id } = req.params;
      console.log("Incoming ID:", id); // Log the incoming ID
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send("Invalid ID format");
      }
  
      let listing = await Listing.findById(id);
      if (!listing) {
          return res.status(404).send("Listing not found");
      }
  
     await res.render("listings/show.ejs", { listing });
  });

  //edit route
 // Route to render the edit form
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  console.log("Incoming ID:", id); // Should log the incoming ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
  }

  // Fetch the listing from the database
  let listing = await Listing.findById(id);
  if (!listing) {
      return res.status(404).send("Listing not found");
  }

  console.log("Fetched listing:", listing); // Log the fetched listing
  res.render("listings/edit", { listing }); // Render the edit view
});


//update route
// Update route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params; // Destructure id from the request parameters

  try {
      // Update the listing with the provided data
      await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true }); 
      
      // Redirect to the updated listing page
      res.redirect(`/listings/${id}`); // Use backticks for template literals
  } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).send("An error occurred while updating the listing."); // Send an error response
  }
});

//Delete route
app.delete("/listings/:id", async (req,res)=>{
  let{id}=req.params;
 let deleteListing=await Listing.findByIdAndDelete(id);
 console.log(deleteListing);
 res.redirect("/listings");
});
// The edit.ejs file should have the correct form inputs as discussed previously
// app.get("/testlisting",async (req,res)=>{
//     let sampleListing= new Listing ({
//         title:"Wonder sky",
//         descripton:"By the beach",
//         price:1200,
//         location:"kolkata",
//         country:"India",
//     });
//    awa sampleListing.save();
//     console.log("Succesful testing");
//     res.send("Sample was saved");
// });
app.listen(port,()=>{
console.log("app is listening in port 8080");
});


//write a code to generate numbers from 1 to 1oo 
//how to close comments terminals on vs code
