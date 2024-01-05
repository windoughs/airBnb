if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const  ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
//DB
// let mongoURL = 'mongodb://127.0.0.1:27017/wanderlist';
let dbUrl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected to db!!")
}).catch(err => console.log(err));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 * 60 * 60,
})

store.on("error" , ()=>{
    console.log("ERROR IN SESSION STORE")
})


const sesssionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

//root
// app.get("/",(req,res)=>{
//     res.send("Hi,I am a root");
// })

//express router and flash
app.use(flash());
app.use(session(sesssionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

// app.get("/demouser",async (req,res)=>{
//     const fakeUser = new User({
//         username:"Anjali",
//         email:"abc@gmail.com",
//     });
//     let registeredUser = await User.register(fakeUser,"abrakadabra");
//     res.send(registeredUser);
// })




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




//Error Handler

app.all("*" , (req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})
app.use((err,req,res,next)=>{
    let {status=500, message = "Something wen wrong"} = err;
    console.log("____error handler____")
    res.status(status).render("./err.ejs",{err});
    // res.status(status).send(message);

})
app.listen(8080,()=>{
    console.log("Server is listening to port : 8080");
})





// app.get("/testListing",async (req,res)=>{
//     let sampleList = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Chandigarh",
//         country:"India",
//     })
//     await sampleList.save();
//     console.log("SampleSaved");
//     res.send("successful testing");
// })