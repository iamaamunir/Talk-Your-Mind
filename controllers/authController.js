const jwt = require("jsonwebtoken");
const passport = require("passport");
require('dotenv').config()

exports.signUp = async (req,res,next)=>{
    const body = {_id:req.user._id, email:req.user.email, password:req.user.password}
    try{
        // const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
    res.json({
       message: "Signup successful",
       user: req.user,
    //    token
     });
    }
    catch(err){
        return next(err)
    }
}

exports.login = async (req,res,next)=>{
    passport.authenticate('login', async (err,user,info)=>{
        try{
            if(err){
                return next(err)
            }
            if(!user){
                const error = new Error('Username or password is incorrect')
                return next(error)
            }
            req.login(user, {session:false}, async (error)=>{
                if(error) return next(error)
                const body = {_id:user._id, email:user.email, password:user.password}
                const token = jwt.sign({user:body}, 'Stack', {expiresIn: '1hr'}, process.env.JWT_SECRET )
                return res.json({token})
            })
        }
        catch(err){
            return next(err)
        }
    })
    (req,res,next)
}