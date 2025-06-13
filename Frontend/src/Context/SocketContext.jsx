import { createContext,useState,useEffect,useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "./authContext.jsx";

export const SocketContext = createContext();

export const useContextSocket = () => useContext(SocketContext);

export const  SocketContextProvider = ({children}) => {
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [authUser,setAuthUser] = useContext(AuthContext);

    useEffect(() => {
      if(authUser){
        const socket = io("http://localhost:8080",{
            query: {
                userId: authUser._id
            }
        });
        setSocket(socket)

        socket.on("Onlineusers", (users) => {
            setOnlineUsers(users);
        });

        return () => socket.close();
      }
      else{
        if(socket){
          socket.close();
          setSocket(null);
        }
      }
    }, [])
    

    return (
        <SocketContext.Provider value={{socket,onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}