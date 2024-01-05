const  Listing = require("./models/listing.js")
const  Review = require("./models/review.js")
const {reviewSchema,listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in first to create a list !");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","It seems you aren't the owner , so you can't edit or delete")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log(review);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","It seems you aren't the author of this review , so you can't delete it ")
        return res.redirect(`/listings/${id}`)
    }
    next()

}



module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
   }else{
    next()
   }
}
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
   }else{
    next()
   }
}