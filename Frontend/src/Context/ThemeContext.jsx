import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({children}) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const initialTheme = user ? user.darkTheme : false;
    const [dark,setDark] = useState(initialTheme);

    return (
        <ThemeContext.Provider value={[dark,setDark]}>
            {children}
        </ThemeContext.Provider>
    )
}