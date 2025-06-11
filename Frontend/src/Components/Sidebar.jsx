// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import ErrorPage from '../Pages/ErrorPage';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Sidebar() {
    const [results, setResults] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [userChats, setUserChats] = useState([]);
    const navigate = useNavigate();

    const query = searchParams.get("q") || "";

    const changeHandler = (e) => {
        const text = e.target.value;
        setSearchParams({ q: text });
    };

    const getChats = async () => {
        try {
            const data = await fetch(`http://localhost:8080/api/v1/chat/`, {
                method: "GET",
                credentials: 'include'
            });
            const res = await data.json();
            console.log(res);
            setUserChats(res.chats);
        } catch (error) {
            console.log(error);
            setHasError(true);
        }
    };

    const fetchUser = async () => {
        try {
            const data = await fetch(`http://localhost:8080/api/v1/chat/search?q=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const res = await data.json();
            return res.users;
        } catch (error) {
            console.log(error);
            setHasError(true);
        }
    };

    useEffect(() => {
        if (query.trim() !== "") {
            fetchUser().then((users) => setResults(users));
        } else {
            setResults([]);
        }
    }, [query]);

    const clickFunction = async (e) => {
        const name = e.currentTarget.getAttribute("data-username");

        try {
            const data = await fetch(`http://localhost:8080/api/v1/chat/createchat`, {
                method: "POST",
                body: JSON.stringify({ name }),
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });

            const res = await data.json();
            const id = res.chatId || res._id || res.chat?._id || res.chatId;
            if (!id) throw new Error("Chat ID missing in response");
            setResults([]);
            setSearchParams({});
            document.getElementById("search-text").value = "";
            await getChats();
            navigate(`/chat/${id}`);
        } catch (error) {
            console.log(error);
            setHasError(true);
        }
    };

    const clickFunction2 = async (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    useEffect(() => {
        getChats();
    }, []);

    if (hasError) return <ErrorPage />;

    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : {};
    const pfp = parsedUser.profilePicture || "https://res.cloudinary.com/dg9jziji5/image/upload/f_auto,q_auto/pgwu3ff4bacngagwzu8n";

    return (
        <div className='h-full w-[30%] rounded-4xl flex-col p-5 bg-white shadow-2xl mx-4 relative'>
            <div className='border border-dotted p-2 mt-4 rounded-2xl flex items-center'>
                <img src={pfp} alt="User profile" className='object-left-bottom h-15 w-20 rounded-full' />
                <input
                    type='text'
                    placeholder='Create New Chat'
                    id='search-text'
                    className='text-center outline-none text-md text-bold'
                    onChange={changeHandler}
                />
            </div>

            {results.length > 0 && (
                <ul className="absolute bg-white shadow-xl rounded-xl w-[90%] mt-2 z-20">
                    {results.map((u, idx) => (
                        <li
                            key={idx}
                            className="text-gray-700 m-0.5 h-[8vh] w-full rounded-2xl flex items-center px-2 cursor-pointer hover:bg-gray-200"
                            onClick={clickFunction}
                            data-username={u.name}
                        >
                            <img src={u.profilePicture} alt="Profile" className='object-left-bottom h-12 w-12 rounded-full mx-3' />
                            <p className='font-bold'>{u.name}</p>
                        </li>
                    ))}
                </ul>
            )}

            {userChats.length > 0 && (
                <ul className="mt-4">
                    {userChats.map((chat, idx) => {
                        const otherUser = chat.users.find(u => u._id !== parsedUser._id);
                        return (
                            <li
                                key={idx}
                                className="text-gray-700 m-0.5 h-[8vh] rounded-2xl flex items-center hover:bg-gray-200 cursor-pointer"
                                onClick={() => clickFunction2(chat._id)}
                            >
                                <img src={otherUser.profilePicture} alt="Profile" className='object-left-bottom h-12 w-12 rounded-full mx-3' />
                                <p className='font-bold'>{otherUser?.name}</p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default Sidebar;
