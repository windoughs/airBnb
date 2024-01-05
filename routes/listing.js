const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const flash = require("connect-flash");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
router.use(flash());
const ListingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})




// Routes
router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.createListing))

router.get("/new",isLoggedIn , ListingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLoggedIn ,upload.single('listing[image]') ,validateListing,isOwner  ,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner , wrapAsync(ListingController.destroyListing))


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm))

module.exports = router;