import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './Context/authContext.jsx'
import { SocketContextProvider } from './Context/SocketContext.jsx'
import { ThemeContextProvider } from './Context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <SocketContextProvider>
                    <ThemeContextProvider>
                        <App />
                    </ThemeContextProvider>
                </SocketContextProvider>
            </AuthContextProvider>
        </BrowserRouter >
    </StrictMode>
)
