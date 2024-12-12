import { useState } from "react"
import {   useNavigate } from "react-router-dom";
import { useToken } from "./TokenContext";

export default function(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {token, setToken} = useToken();
    const [NameError, SetNameError] = useState (false);
    const [EmailError, SetEmailError] = useState (false);
    
   async function handleSignup(){


        if(name.length < 1){
                SetNameError(true);
        }  else if(!email.endsWith("@knox.edu")){
            SetEmailError(true);
        } else if (email.length<6){
            alert("Please give a valid email");
        } else if(password.length<6){
            alert("Password should be at least 6 letters long");
        } else{
           fetch("http://localhost:3003/admin/signup", {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   name, email, password
               })
           }).then(async (response)=>{
            const data = await response.json();
            if(data.success){
                alert(data.token);
                setName("");
                setEmail("");
                setPassword("");
                 await localStorage.setItem('token', data.token);
                 setToken(data.token);
                 navigate("/");
            } else{
                alert(data.message)
            }
           })
        }


        
        
    }
    function gotoLogin(){
      navigate("/login")
    }
    return(
        <div className="h-screen p-10">
            <div className="font-semibold text-2xl mt-20">
            Course Administration
            </div>
            <div className="mt-5">
            {NameError == true && <div className = "bg-red-100 rounded-md p-3 mb-3 w-1/2" >Name cannot be blank</div>}
            {EmailError == true && <div className = "bg-red-100 rounded-md p-3 mb-3 w-1/2" >Your email address should end with Knox.edu</div>}
                
                <p>
                    Please enter your username and password for <b>admin</b> below:
                </p>
                <div className="mt-5 flex flex-col w-1/3">
                    <input className="mb-3 border rounded-xl border-gray-600 p-2 text-lg" type="text" placeholder="Name" value={name} onChange={(e)=>{
                        setName(e.target.value);
                    }}/>
                    <input className="mb-3 border rounded-xl border-gray-600 p-2 text-lg" type="text" placeholder="Email" value={email} onChange={(e)=>{
                        setEmail(e.target.value);
                    }} />
                    <input className="mb-3 border rounded-xl border-gray-600 p-2 text-lg" type="password" placeholder="Password" value={password} onChange={(e)=>{
                        setPassword(e.target.value);
                    }} />
                </div>
                <div >
                    <button className="bg-blue-800 p-2 text-white rounded-xl font-semibold hover:bg-blue-900" onClick={handleSignup} >Signup</button>
                </div>
                <div className="mt-5">
                    Already have an account? <span className="text-blue-700 font-semibold italic cursor-pointer underline" onClick={gotoLogin}>Login</span>
                </div>
            </div>
        </div>
    )
}