import React, { useContext } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/authContext.jsx';

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [authUser,setAuthUser] = useContext(AuthContext)
    const handleLogin = async (e) => {
        e.preventDefault()

        if (email.trim() !== "" && password.trim() !== "") {
            try {
                const data = { email, password }
                const info = await fetch("http://localhost:8080/api/v1/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    credentials: "include"
                })
                const res = await info.json()
                console.log(res)
                localStorage.setItem("user", JSON.stringify(res.userInfo))
                setAuthUser(res)

                setEmail("")
                setPassword("")
            } catch (error) {
                console.log(error)
            }
        }
        else {
            alert("All the fields are required.")
        }
    }

    return (
        <div className="flex flex-col justify-center items-center mx-auto min-h-screen px-4">
            <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
                <h1 className="text-3xl font-semibold text-slate-800 mb-6 text-center">Login</h1>

                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-4"
                >
                    <input
                        className="p-3 border border-gray-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="p-3 border border-gray-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white py-3 rounded font-medium hover:bg-indigo-600 transition-colors"
                    >
                        Login
                    </button>
                </form>
                <span>Don't have an account? <Link to='/signup' className='text-indigo-500'>SignUp</Link></span>
            </div>
        </div>
    );
};

export default Login;
