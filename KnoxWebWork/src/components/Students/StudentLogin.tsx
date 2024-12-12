import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToken } from "../TokenContext";

export default function(){

    const {setStudentToken} = useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const {name, term, courseId} = location.state || {};


    async function handleLogin(){
    
        try{
            const response = await fetch("http://localhost:3003/student/login", {
                method: "Post",
                headers: {
                    "Content-type": "Application/json"
                },
                body: JSON.stringify({
                    username, password, courseId
                })
            });
    
            const data = await response.json();
    
            if(data.success){
                localStorage.setItem('student-token', data.token);
                setStudentToken(data.token);
                alert("Success");
                navigate("/");
            }else{
                alert(data.message)
                setError(true);
            }
        } catch(e:any){
            alert(e.message);
        }
    }


    return(
        <div className="h-screen p-10">
        <div className="font-semibold text-2xl mt-20">
        Student Login for Class {name} and term {term}
        </div>
        <div className="mt-5">
            {error == true && <div className = "bg-red-100 rounded-md p-3 mb-3" >Invalid user ID or password</div>}
            <p>
                Please enter your username and password below:
            </p>
            <div className="mt-5 flex flex-col w-1/3">
                <input className="mb-3 border rounded-xl border-gray-600 p-2 text-lg" type="text" value={username} onChange={(e)=>{
                    setUserName(e.target.value);
                }} placeholder="Username" />
                <input className="mb-3 border rounded-xl border-gray-600 p-2 text-lg" type="password" value={password} onChange={(e)=>{
                    setPassword(e.target.value);
                }} placeholder="Password" />
            </div>
            <div >
                <button className="bg-blue-800 p-2 text-white rounded-xl font-semibold hover:bg-blue-900" onClick={handleLogin}>Continue</button>
            </div>
        </div>
    </div>
       )

}