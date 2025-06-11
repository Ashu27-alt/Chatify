import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new Schema({
    users: [
        {
            type: Object
        }
    ]
}, {
    timestamps: true
})

export const Chat = mongoose.model("Chat", chatSchema)