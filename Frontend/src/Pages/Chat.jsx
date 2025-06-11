import React from 'react'
import Sidebar from '../Components/Sidebar'
import ChatSection from '../Components/ChatSection'
function Chat() {
    return (
        <div className='flex flex-col justify-center items-center mx-auto min-h-screen px-4 bg-blue-700 opacity-95'>
            <div className='flex h-[90vh] w-[75vw] rounded-4xl shadow-lg bg-gray-100 p-6'>
                <Sidebar />
                <ChatSection />
            </div>
        </div>
    )
}

export default Chat