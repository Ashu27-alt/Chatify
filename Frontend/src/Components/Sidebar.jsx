import React, { useState, useEffect,useContext } from 'react';
import ErrorPage from '../Pages/ErrorPage';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useContextSocket } from '../Context/SocketContext.jsx';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../Context/ThemeContext.jsx';
import { AuthContext } from '../Context/authContext.jsx';

function Sidebar() {
    const [results, setResults] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [userChats, setUserChats] = useState([]);
    const navigate = useNavigate();
    const { socket } = useContextSocket();
    const [dark] = useContext(ThemeContext)
    const [authUser,setAuthUser] = useContext(AuthContext);

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
            // console.log(res.chats)
            setUserChats(res.chats);
            // console.log(userChats)
        } catch (error) {
            console.log(error);
            setHasError(true);
        }
    };

    useEffect(() => {
        if (!socket) return;
        else {
            socket.on("newchat", (fullChat) => {
                setUserChats((prev) => [...prev, fullChat]);
            });
        }
    }, [socket]);

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

            const response = await data.json();

            if (response.success) {
                const res = response.fullChat
                const id = res._id;
                if (!id) throw new Error("Chat ID missing in response");
                setResults([]);
                setSearchParams({});
                document.getElementById("search-text").value = "";
                await getChats();
                navigate(`/chat/${id}`);
            }
            else {
                alert(response.message);
                navigate("/");
            }
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

    const logoutHandler = async () => {
        try {
            localStorage.removeItem("user");
    
            const res = await fetch("http://localhost:8080/api/v1/user/logout", {
                method: "POST",
                credentials: "include"
            });
    
            if (!res.ok) {
                console.error("Logout failed on server");
                return;
            }
    
            console.log("navigating to /login .....");
            setAuthUser(null);
            navigate("/login");
        } catch (err) {
            console.error("Error in logoutHandler:", err);
        }
    };
    

    if (hasError) return <ErrorPage />;

    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : {};
    const pfp = parsedUser.profilePicture || "https://res.cloudinary.com/dg9jziji5/image/upload/f_auto,q_auto/pgwu3ff4bacngagwzu8n";

    return (
        <div className={`${dark?'dark':'light'} h-full w-[30%] rounded-4xl p-4 shadow-2xl mx-4 relative flex flex-col justify-between`}>
            <div>
                <div className='border border-dotted p-2 mt-4 rounded-2xl flex items-center'>
                    <input
                        type='text'
                        placeholder='Create New Chat'
                        id='search-text'
                        className='text-center outline-none text-md text-bold w-full'
                        onChange={changeHandler}
                    />
                </div>

                {results.length > 0 && (
                    <ul className={`absolute shadow-xl rounded-xl w-[90%] mt-2 z-20 ${dark ? 'dark' : 'light'}`}>
                        {results.map((u, idx) => (
                            <li
                                key={idx}
                                className={`m-0.5 h-[8vh] w-full rounded-2xl flex items-center px-2 cursor-pointer hover:bg-gray-200 hover:text-gray-700 ${dark?'text-white':'text-gray-700'}`}
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
                            const otherUser = chat.users.find(user => user._id !== parsedUser._id);
                            return (
                                <li
                                    key={idx}
                                    className={`m-0.5 h-[8vh] w-full rounded-2xl flex items-center hover:bg-gray-200 hover:text-gray-700 cursor-pointer ${dark?'text-white':'text-gray-700'}`}
                                    onClick={() => clickFunction2(chat._id)}
                                >
                                    <img src={otherUser.profilePicture} alt="Profile" className='object-left-bottom h-12 w-12 rounded-full mx-3' />
                                    <p className='font-bold text-base sm:text-sm truncate max-w-[50%]'>{otherUser?.name}</p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <div className="mt-4">
                <button
                    onClick={logoutHandler}
                    className="w-full py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>

    );
}

export default Sidebar;
