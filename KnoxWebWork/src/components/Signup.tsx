import { useState } from "react"

export default function(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

   async function handleSignup(){
        if(name.length < 1){
            alert("Please give a valid name");
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
            } else{
                alert(data.message)
            }
           })
        }


    }
    return(
        <div className="h-5/6 p-10">
            <div className="font-semibold text-2xl mt-20">
            Course Administration
            </div>
            <div className="mt-5">
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
            </div>
        </div>
    )
}