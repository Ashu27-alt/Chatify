import React, { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext.jsx';

const Navbar = () => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : {};
  const pfp = parsedUser.profilePicture

  const [dark, setDark] = useContext(ThemeContext);
  const toggleTheme = async () => {
    fetch("http://localhost:8080/api/v1/user/toggletheme", {
      method: "POST",
      credentials: "include"
    })
    setDark(!dark);
  };

  return (
    <div className={`${dark ? 'dark-bg' : 'light-bg'} flex justify-between items-center w-full h-[10vh] pl-4`}>
      <span className='pl-4'>
        <h1 className='text-bold text-4xl tracking-wider italic'>CHATIFY 🚀</h1>
      </span>

      <div className='flex items-center'>
        <span className='mr-2 text-lg'>Dark Mode</span>
        <div className='pr-4'>
          <label className="switch">
            <input type="checkbox" onChange={toggleTheme} checked={dark} />
            <span className="slider"></span>
          </label>
        </div>

        <div className='flex items-center'>
          <img src={pfp} className='w-10 h-10 rounded-full mr-4' alt='profile' />
          <h1 className='text-bold text-xl tracking-wider'>{parsedUser.name}</h1>
        </div>
      </div>
    </div>
  )
}

export default Navbar