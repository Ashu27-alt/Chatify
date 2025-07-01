import React from 'react'
import Sidebar from '../Components/Sidebar'
import ChatSection from '../Components/ChatSection'
import Navbar from '../Components/Navbar'
import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext.jsx';
function Chat() {

    const [dark] = useContext(ThemeContext);
    return (
        <>
            <div className='flex flex-col justify-center items-center mx-auto min-h-screen px-4 bg-blue-700 opacity-95'>
                <div className={`h-[10vh] w-[75vw] rounded-t-4xl p-4 px-3 ${dark ? 'dark-bg' : 'light-bg'}`}>
                    <Navbar />
                </div>
                <div className={`flex h-[80vh] w-[75vw] rounded-b-4xl shadow-lg p-6 ${dark ? 'dark-bg' : 'light-bg'}`}>
                    <Sidebar />
                    <ChatSection />
                </div>
            </div>
        </>
    )
}

export default Chat