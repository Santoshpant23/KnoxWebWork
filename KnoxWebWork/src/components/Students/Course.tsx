import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToken } from "../TokenContext";

interface Exercise {
    id: number;
    name: string;
    datePosted: Date;
    dateExpires: Date;
    questions: Question[];
    courseId: number;
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    exerciseId: number;
}

export default function CoursePage() {
    const url = window.location.href;
    const navigate = useNavigate();
    const location = useLocation();

    const courseId = location.state.courseId || -1;
    const { studentToken, setStudentToken } = useToken();
    const [allexercises, setAllExercises] = useState<Exercise[] | null>(null);
    const [name, setName] = useState("");
    const [term, setTerm] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        try {
            const extractedData = url.split("course/")[1]?.split("-");
            if (extractedData.length >= 2) {
                setName(decodeURIComponent(extractedData[0].trim()));
                setTerm(decodeURIComponent(extractedData[1].trim()));
            } else {
                throw new Error("Invalid URL format");
            }
        } catch (error) {
            console.error("Failed to extract course details from URL:", error);
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (!studentToken) {
            navigate("/student/login", { state: { name, term, courseId } });
        } else {
            verifyToken();
            fetchExercises();
        }
    }, []);

    async function verifyToken() {
        try {
            const response = await fetch("http://localhost:3003/student/verify", {
                method: "POST",
                headers: {
                    "Content-type": "Application/json",
                },
                body: JSON.stringify({ studentToken, courseId }),
            });

            const data = await response.json();

            if (!data.success) {
               if(data.expired){
                setStudentToken(null);
                alert(data.message)
                navigate("/student/login", { state: { name, term, courseId } });
               } else{
                setShowAlert(true);
               }
            }
        } catch (e: any) {
            alert("Something went wrong verifying the user info. Please log in again.");
        }
    }

    async function fetchExercises() {
        try {
            const response = await fetch("http://localhost:3003/exercise/all-exercises", {
                method: "POST",
                headers: {
                    "Content-type": "Application/json",
                },
                body: JSON.stringify({ token: studentToken, courseId }),
            });

            const data = await response.json();

            if (data.success) {
                setAllExercises(data.exercises);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    }

    function handleYes() {
        setStudentToken(null);
        navigate("/student/login", { state: { name, term, courseId } });
    }

    function handleNo() {
        navigate("/");
    }

    function handleExerciseClick(exercise: Exercise) {
        console.log("Exercise clicked:", exercise);
        navigate(`/solve-exercise`, {state: {exercise}});
    }

    return (
        <div className="p-5">
            {showAlert && (
                <div className="p-4 bg-red-200 rounded-lg shadow-md">
                    <p className="text-red-800 font-semibold">
                        Hey, it looks like you have already logged in for a different class. Do you want to log out from the other class and log in here?
                    </p>
                    <div className="flex justify-around mt-4">
                        <button
                            onClick={handleYes}
                            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                        >
                            Yes
                        </button>
                        <button
                            onClick={handleNo}
                            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                        >
                            No
                        </button>
                    </div>
                </div>
            )}

            {name && term ? (
                <div>
                    <p className="text-lg font-medium">
                        Hey, you are in class <strong>{name}</strong> and in the term <strong>{term}</strong>.
                    </p>
                    {allexercises && allexercises.length > 0 ? (
                        <div className="mt-5">
                            <h2 className="text-xl font-bold mb-4">Exercises</h2>
                            <ul className="space-y-4">
                                {allexercises.map((exercise: Exercise) => (
                                    <li
                                        key={exercise.id}
                                        onClick={() => handleExerciseClick(exercise)}
                                        className="p-4 bg-gray-100 rounded-lg shadow hover:bg-blue-100 cursor-pointer transition"
                                    >
                                        <h3 className="text-lg font-semibold text-blue-800">
                                            {exercise.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Posted: {new Date(exercise.datePosted).toLocaleDateString()} | Expires: {new Date(exercise.dateExpires).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-700 mt-5">No exercises available.</p>
                    )}
                </div>
            ) : (
                <p className="text-red-600">Failed to load course details. Please check the URL.</p>
            )}
        </div>
    );
}
