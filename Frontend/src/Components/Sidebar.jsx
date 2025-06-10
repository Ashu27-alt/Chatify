import React from 'react'
import { useState, useEffect } from 'react'
import ErrorPage from '../Pages/ErrorPage';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const [results, setResults] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("q") || "";
    const changeHandler = (e) => {
        const text = e.target.value;
        setSearchParams({ q: text });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch(`http://localhost:8080/api/v1/chat/search?q=${encodeURIComponent(query)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials:"include"
                })
                const res = await data.json()
                console.log(res)
                if(res.error){
                    console.log(res.error)
                }
                setResults(res.users)

            } catch (error) {
                console.log(error);
            }
        }

        fetchData()
        console.log(results.lenght)
    }, [searchParams]);


    return (
        <div className=' h-full w-[35%] rounded-4xl flex-col p-5 bg-white shadow-2xl mx-4'>
            <div className='border border-dotted p-4 mt-4 rounded-2xl w-full flex gap-2'>
                <button className='h-15 w-15 text-2xl text-center bg-blue-200 rounded-full text-blue-600'>+</button>
                <input type='text' placeholder='Create New' className='text-center outline-none text-xl text-bold' onChange={changeHandler} />
            </div>
            {results.length > 0 ? (
                <ul className="mt-4">
                    {results.map((u, idx) => (
                        <li key={idx} className="text-gray-700 py-1">{u.name}</li>
                    ))}
                </ul>
            ):
            <div></div>
            }
        </div>
    )
}

export default Sidebar