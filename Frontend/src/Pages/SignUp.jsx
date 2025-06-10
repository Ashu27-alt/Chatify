import React, { useContext } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/authContext.jsx';

const SignUp = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [previewImage, setPreviewImage] = useState("https://res.cloudinary.com/dg9jziji5/image/upload/f_auto,q_auto/pgwu3ff4bacngagwzu8n")
    const [authUser,setAuthUser] = useContext(AuthContext)

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (name.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("photo", image);
            try {
                const info = await fetch("http://localhost:8080/api/v1/user/register", {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                })
                const res = await info.json()
                console.log(res)
                localStorage.setItem("user", JSON.stringify(res.userInfo))
                setAuthUser(res)

                setEmail("")
                setPassword("")
                setName("")
                setPreviewImage("https://res.cloudinary.com/dg9jziji5/image/upload/f_auto,q_auto/pgwu3ff4bacngagwzu8n")
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            alert("All the fields are required.")
        }
    }

    return (
        <div className="flex flex-col justify-center items-center mx-auto min-h-screen px-4">
            <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
                <h1 className="text-3xl font-semibold text-slate-800 mb-6 text-center">Create an Account</h1>

                <form
                    onSubmit={handleSignUp}
                    className="flex flex-col gap-4 jutify-center items-center"
                >
                    <div className='relative'>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-left-bottom"
                        />
                        <input type="file" name="image" id="fileInput" className='hidden' onChange={(e) => { setImage(e.target.files[0]); setPreviewImage(URL.createObjectURL(e.target.files[0])) }} />
                        <button type="button" className='absolute top-[65%] left-[75%] transform -translate-x-1/6 -translate-y-1/12 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-2xl' onClick={() => document.getElementById("fileInput").click()}>+</button>
                    </div>
                    <input
                        className="p-3 w-full border border-gray-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 mt-3"
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        className="p-3 w-full border border-gray-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="p-3 w-full border border-gray-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-indigo-500 w-1/4 text-white py-3 rounded font-medium hover:bg-indigo-600 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>
                <span>Already have an account? <Link to='/login' className="text-indigo-500">Login</Link></span>
            </div>
        </div>
    );
};

export default SignUp;
