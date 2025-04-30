import mongoose, { Schema,model } from "mongoose";

const messageSchema=new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
        type:String,
        required:true
    }
})

export const Message=model("Message",messageSchema)