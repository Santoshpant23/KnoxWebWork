import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "./TokenContext";

export default function (){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {token, setToken} = useToken();

    const [wrongdata, setWrongData] = useState(false);

   async function handleLogin(){
        if(email.length<5){
            alert("Invalid Email, try again");
        } else if(password.length<6){
            alert("Minimum 6 letters is required");
        } else{
            const response = await fetch("http://localhost:3003/admin/login", {
                method: "Post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, password
                })
            })

            const data = await response.json();

            if(data.success){
                // alert("Success");
                setEmail("");
                setPassword("");
             localStorage.setItem("token", data.token);
              await setToken(data.token);
                // alert(localStorage.getItem("token"));
                setWrongData(false);
                navigate("/");
            } else{
                //todo
                setWrongData(true);
            }
        }
    }

    function gotoSignup(){
        navigate("/signup")
    }
    return(
        <div className="h-screen p-10">
        <div className="font-semibold text-2xl mt-20">
        Course Administration
        </div>
        <div className="mt-5">
           {wrongdata && ( <div className="bg-red-200 p-4 rounded-lg w-1/2 mb-2">Invalid user ID or password</div>)}
            <p>
                Please enter your username and password for <b>admin</b> below:
            </p>
            <div className="mt-5 flex flex-col w-1/3">
                <input className="mb-3 border rounded-xl border-gray-600 p-2 text-lg" type="text" value={email} onChange={(e)=>{
                    setEmail(e.target.value);
                }} placeholder="Email" />
                <input className="mb-3 border rounded-xl border-gray-600 p-2 text-lg" type="password" value={password} onChange={(e)=>{
                    setPassword(e.target.value);
                }} placeholder="Password" />
            </div>
            <div >
                <button className="bg-blue-800 p-2 text-white rounded-xl font-semibold hover:bg-blue-900" onClick={handleLogin}>Continue</button>
            </div>
            <div className="mt-5">
                New User? <span className="text-blue-700 font-semibold italic underline cursor-pointer" onClick={gotoSignup}>SignUp</span>
            </div>
        </div>
    </div>
    )
}