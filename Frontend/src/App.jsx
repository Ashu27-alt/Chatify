import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat.jsx";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/authContext.jsx";
import { ThemeContext } from "./Context/ThemeContext.jsx";

function App() {
  const [authUser, setAuthUser] = useContext(AuthContext);
  const [dark, setDark] = useContext(ThemeContext);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/user/currentuser", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        setAuthUser(data.user);
        setDark(data.user.darkTheme);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
  }, []);

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
