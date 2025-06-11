import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat.jsx";
import { useContext } from "react";
import { AuthContext } from "./Context/authContext.jsx";

function App() {
  const [authUser] = useContext(AuthContext); 

  return (
    <Routes>
      <Route
        path="/login"
        element={authUser ? <Navigate to="/chat" /> : <Login />}
      />
      <Route
        path="/signup"
        element={authUser ? <Navigate to="/chat" /> : <SignUp />}
      />
      
      <Route
        path="/chat"
        element={authUser ? <Chat /> : <Navigate to="/login" />}
      />
      <Route
        path="/chat/:chatId"
        element={authUser ? <Chat /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
