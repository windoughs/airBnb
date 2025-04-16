const Listing = require("../models/listing")
//const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//const mapToken = process.env.MAP_TOKEN;
//const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req,res)=>{
    let allListing = await Listing.find({});
    res.render("listings/index.ejs" , {allListing});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",
            populate:{
                path:"author",
            }}).populate("owner");

    if(!listing){
        req.flash("error","List does not exists !!");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs" , {listing});
}


module.exports.createListing = async (req,res,next)=>{
    console.log("_______API CALL")
    // let response =await geocodingClient
    // .forwardGeocode({
    //     query: req.body.listing.location,
    //     limit: 1
    //   }).send()
    //     console.log()
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url , "...." , filename)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
   // newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","List successfully created !!")
    res.redirect("/listings");
      
};

module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","List does not exists !!");
        res.redirect("/listings")
    }
    let origImageUrl = listing.image.url;
    origImageUrl  =  origImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs" , {listing , origImageUrl});
};


module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save();
    }
    res.redirect(`/listings/${id}`)
};


module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success","List successfully deleted !!")
    res.redirect("/listings")
};
