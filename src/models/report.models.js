import mongoose, { Schema } from "mongoose";


const reportSchema=new mongoose.Schema({
    reportImage:{
        type:String,
        required:true
    },
     title: {
        type: String,
        required: true 

    },
    description:{
         type:String,
         required:true
    },
    location:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum: ["pending", "in-progress", "resolved"],
        default: "pending"
    }
},{timestamps:true})

export const Report=mongoose.model("Report",reportSchema)