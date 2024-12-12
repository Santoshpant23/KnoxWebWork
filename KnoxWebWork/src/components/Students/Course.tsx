import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToken } from "../TokenContext";

export default function CoursePage() {
    const url = window.location.href;
    const navigate = useNavigate();
    const location = useLocation();

    const courseId = location.state.courseId || -1;
    const {studentToken, setStudentToken}  = useToken();


    // Safely extract and sanitize course name and term
  const [name, setName] = useState("");
  const [term, setTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);


    useEffect(()=>{
        try {
            const extractedData = url.split("course/")[1]?.split("-");
            if (extractedData.length >= 2) {
                setName(decodeURIComponent(extractedData[0].trim()))
                setTerm(decodeURIComponent(extractedData[1].trim()))
                console.log("Success");
                // navigate(`/student/login/${name}-${term}`);
                
            } else {
                throw new Error("Invalid URL format");
            }
        } catch (error) {
            console.error("Failed to extract course details from URL:", error);
            navigate("/")
        }
    }, [])

    useEffect(()=>{
        
        if(!studentToken){
            navigate("/student/login", {state: {name, term, courseId}});
        } else{
            verifyToken();
        }
    })




async function verifyToken(){
    try{
        const response = await fetch("http://localhost:3003/student/verify", {
            method: "Post",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify({
                studentToken, courseId
            })
        });

        const data = await response.json();

        if(data.success){
            alert(data.usernameInfo + " " + data.courseIdInfo);
        } else{

            setShowAlert(true);
        }
    } catch(e:any){
        alert("Something Went Wrong verifying the info of the user, please login")
    }


}


function handleYes(){
    setStudentToken(null);
    navigate("/student/login", {state: {name, term, courseId}});
}

function handleNo(){
    navigate("/");
}

    return (
        <div className="p-5">
            {showAlert && (
                <div className="p-2 bg-red-200 m-5 rounded-lg">
                    <p>
                    Hey, it looks like you have already logged in for a different class, do you want to log out from the other class and log in here??
                    </p>
                    <div className="flex justify-evenly mt-5">
                    <button onClick={handleYes} className="pl-5 pr-5 bg-green-500 text-white font-semibold ml-5 pt-1 pb-1 rounded-lg hover:bg-green-600">Yes</button>
                
                    <button onClick={handleNo} className="pl-5 pr-5 bg-red-500 text-white font-semibold mr-5 pt-1 pb-1 rounded-lg hover:bg-red-600">No</button>
                    </div>
                </div>
            )}
            {name && term ? (
                <p>
                    Hey, you are in class <strong>{name}</strong> and in the term <strong>{term}</strong>
                </p>
            ) : (
                <p>Failed to load course details. Please check the URL.</p>
            )}
        </div>
    );
}


