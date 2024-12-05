import { useState } from "react";
import { useToken } from "./TokenContext";
import { useNavigate } from "react-router-dom";
export default function () {
    const [name, setName] = useState("");
    const [term, setTerm] = useState("");
    const {token, setToken} = useToken();

    const navigate = useNavigate();

    /*
    model Course {
      id        Int        @id @default(autoincrement())
      name      String     @unique
      term      String
      students  Student[]
      exercises Exercise[]
      ownedBy   String
      owner     Owners     @relation(fields: [ownedBy], references: [email])
    }
    */

    async function handleSubmit(){
        try{
            const response = await fetch("http://localhost:3003/course/add-course", {
                method: "Post",
                headers:{
                    "Content-type": "Application/json"
                },
                body: JSON.stringify({
                    token, name, term

                })
            })

            const data = await response.json();

            if(data.success){
                alert("Success");
                navigate("/profile")
            } else{
                alert(data.message);
            }
        } catch(e:any){
            alert(e.message);
        }
    }
  
    return (
      <div className="bg-slate-100 h-screen flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-gray-800 mb-8">Add a New Course</div>
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Name of course"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            onChange={(e)=>{
                setName(e.target.value);
            }}
            value={name}
          />
          <input
            type="text"
            placeholder="Term (e.g., Spring 2024)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            onChange={(e)=>{
                setTerm(e.target.value);
            }}
            value={term}
          />
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg font-semibold hover:bg-blue-700 transition duration-200"
            onClick={handleSubmit}
          >
            Add Course
          </button>
        </div>
      </div>
    );
  }
  