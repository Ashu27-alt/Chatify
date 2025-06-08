import { Chat } from "../Models/chat.model.js";

const createChat = async (req, res) => {
    const { users } = req.body;

    if (!users || users == req.user._id.toString()) {
        throw new Error("More than one user is required");
    }

    try {
        if (!users.includes(req.user._id.toString())) {
            users.push(req.user._id);
        }

        const chat = await Chat.create({ users })
        res.status(201).json({ success: true, message: "Chat created successfully", chat })
    } catch (error) {
        console.log("Error creating chat ", error);
    }
}

const deleteChat = async (req, res) => {
    const { chatId } = req.body;

    try {
        await Chat.findByIdAndDelete(chatId)
        res.status(201).json({ success: true, message: "Chat deleted successfully" })
    } catch (error) {
        console.log("Error deleting chat ", error);
    }

}

const getAllChats = async (req, res) => {
    const user = req.user

    try {
        const chats = await Chat.find({ users: { $in: [user._id] } })
        res.status(201).json({ success: true, message: "Chats found successfully", chats })
    } catch (error) {
        console.log("Error getting chats ", error);
    }

}
export { createChat, deleteChat, getAllChats }