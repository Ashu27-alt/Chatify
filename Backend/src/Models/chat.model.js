import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
})

export const Chat = mongoose.model("Chat", chatSchema)