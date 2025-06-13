import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from '../Pages/ErrorPage';
import { useContextSocket } from '../Context/SocketContext.jsx';

function ChatSection() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const messagesEndRef = useRef(null);
    const { socket } = useContextSocket();

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchMessages = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/message/${chatId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            console.log(data)
            setMessages(data.messages);
        } catch (err) {
            console.log(err);
            setHasError(true);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("newmessage", (fullMessage) => {
            setMessages((prev) => [...prev, fullMessage]);
        })
    }
        , [socket])
    const fetchChatUser = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/${chatId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const { chat } = await res.json();
            console.log("Chat User: ", chat)
            const other = chat.users.find((u) => u._id !== user._id);
            setChatUser(other);
        } catch (err) {
            console.log(err);
            setHasError(true);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/message/${chatId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ content: newMessage }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, data.message]);
            setNewMessage('');
        } catch (err) {
            console.log(err);
            setHasError(true);
        }
    };

    useEffect(() => {
        if (chatId) {
            fetchMessages();
            fetchChatUser();
        }
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (hasError) return <ErrorPage />;

    if (!chatId) {
        return (
            <div className='h-full w-full flex justify-center items-center rounded-4xl p-4 bg-white shadow-gray-950 shadow-2xl'>
                <h1 className='text-2xl font-semibold text-gray-600'>Hello {user?.name || 'User'} 👋</h1>
            </div>
        );
    }

    return (
        <div className='h-full w-full flex flex-col justify-between rounded-4xl p-4 bg-white shadow-gray-950 shadow-2xl'>

            {chatUser && (
                <div className="flex items-center border-b border-gray-300 pb-2 mb-2">
                    <img
                        src={chatUser.profilePicture}
                        alt="Chat User"
                        className="w-10 h-10 rounded-full mr-3 object-left-bottom"
                    />
                    <span className="font-bold text-lg text-gray-800">{chatUser.name}</span>
                </div>
            )}

            <div className='flex-1 overflow-y-auto pr-2'>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`w-full flex ${((msg.sender._id || msg.sender) === user._id) ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`my-1 px-4 py-2 rounded-2xl inline-block max-w-[70%] break-words ${(msg.sender._id || msg.sender) === user._id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className='mt-4 flex items-center'>
                <input
                    type='text'
                    placeholder='Type your message...'
                    className='flex-1 border border-gray-400 rounded-xl px-4 py-2 mr-2 outline-none'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                />
                <button
                    onClick={sendMessage}
                    className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow'
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatSection;
