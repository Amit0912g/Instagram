import mongoose, { Schema,model } from "mongoose";

const conversationSchema= new Schema({
    participants:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    messages:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        }
    ]
})

export const Conversation =model("Conversation",conversationSchema)