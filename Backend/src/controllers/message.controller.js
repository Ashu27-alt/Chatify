import { Message } from "../Models/message.model.js";

const sendMessage = async (req, res) => {
    const { content } = req.body;
    const { chatId } = req.params;

    try{
        const message = await Message.create({ content, chat: chatId, sender: req.user._id })
        res.status(201).json({ success: true, message: "Message sent successfully", message })
    }
    catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const getAllChatMessages = async (req, res) => {
    const { chatId } = req.params;

    try{
        const messages = await Message.find({ chat: chatId })
        res.status(201).json({ success: true, message: "Messages found successfully", messages })
    }
    catch(error){
        console.log(error)
        throw new Error(error)
    }
}

export { 
    sendMessage,
    getAllChatMessages
}