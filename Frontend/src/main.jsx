import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './Context/authContext.jsx'
import { SocketContextProvider } from './Context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthContextProvider>
            <SocketContextProvider>
                <App />
            </SocketContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
)
