import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    fullname:{
        type:String,
        required:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

userSchema.pre("save",async function(next){
     if(!this.isModified("password")){
        return next();
     }
     this.password=await bcrypt.hash(this.password,10);
     next();
})

userSchema.methods.isPasswordCorrect= async function (password) {
    return bcrypt.compare(password, this.password);
    
}

userSchema.methods.generateAccessToken=function(){
    const token= jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
     console.log("✅ access token generated.");
    return token;

}
userSchema.methods.generateRefreshToken=function(){
    const token= jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })

     console.log("✅ Refresh token generated.");
  return token;

}



export const User=mongoose.model("User",userSchema);