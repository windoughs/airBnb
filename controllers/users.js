const User = require("../models/user")

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signup = async(req,res)=>{
    try{   
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        const regUser = await User.register(newUser,password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to Wanderlist");
            res.redirect("/listings");
        })
        }
        catch(err){
            req.flash("error",err.message);
            res.redirect("/signup")
        }
    }


    module.exports.login =async(req,res)=>{
        req.flash("success","Welcome To wanderlist !!");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl)
    }


    module.exports.logout = (req,res,next)=>{
        req.logOut((err)=>{
            if(err){
                next(err)
            }
            req.flash("success","You are logged out now !!");
            res.redirect("/listings");
        })
    }