import { useState } from "react"
import {   useNavigate } from "react-router-dom";
import { useToken } from "./TokenContext";

export default function(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {token, setToken} = useToken();
    const [error, setError] = useState (false);
    const [errorMessage, setErrorMessage] = useState("An error occured");

    
   async function handleSignup(){


        if(name.length < 1){
               setError(true);
               setErrorMessage("Name cannot be empty");
        }  else if(!email.endsWith("@knox.edu")){
             setError(true);
             setErrorMessage("Email should end with knox.edu");
        } else if (email.length<11){
            setError(true);
             setErrorMessage("Enter a valid email");
        } else if(password.length<6){
            setError(true);
             setErrorMessage("Make your password at least 6 characters long");
        }
         else if ( !/[!@#$%^&*]/.test(password) || !/\d/.test(password)){
            setError(true);
            setErrorMessage("Your password should contain at least a digit or a special character");
        }
        
         
        else{
            setError(false);
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
                // alert(data.token);
                setName("");
                setEmail("");
                setPassword("");
                 await localStorage.setItem('token', data.token);
                 setToken(data.token);
                 navigate("/");
                 setError(false);
            } else{
                setError(true);
                setErrorMessage(data.message);
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
            {error == true && <div className = "bg-red-100 rounded-md p-3 mb-3 w-1/2" >{errorMessage}</div>}
            {/* <div className = "bg-red-100 rounded-md p-3 mb-3 w-1/2" >{errorMessage}</div> */}
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