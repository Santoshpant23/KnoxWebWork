import { useState, useEffect } from "react";
import { useToken } from "./TokenContext";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function () {
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const [exercisename, setExerciseName] = useState("");
  const [id, setId] = useState<number>(location?.state.exerciseId);
  const [exercise, setExercise] = useState<Exercise>();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    exerciseId: exercise?.id ?? 0,
  });

  useEffect(()=>{
    fetchExercise();
  }, [])

  async function fetchExercise(){
    try{
        const response  = await fetch("http://localhost:3003/exercise/get-exercise", {
            method: "Post",
            headers:{
                "Content-type": "Application/json"
            },
            body: JSON.stringify({
                token, id
            })
        });

        const data = await response.json();

        if(data.success){
            setExercise(data.exercise);
        } else{
            alert(data.message);
        }
    } catch(e:any){
        alert(e.message)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (!location.state) {
      navigate("/profile");
    }
  }, [token, location.state, navigate]);

  const updateExerciseName = (newName: string) => {
    setExercise((prev) => prev ? { ...prev, name: newName } : prev);
    // Placeholder for backend call
    console.log(`Exercise name updated to: ${newName}`);
  };

  const addQuestion = async () => {
    if (!newQuestion.question.trim()) return;
    if (!exercise) return;
    // const updatedQuestions = [...exercise.questions, { ...newQuestion, id: Date.now() }];
    // setExercise((prev) => prev ? { ...prev, questions: updatedQuestions } : prev);
 
    try{
        console.log("The current new qn data is " + newQuestion.correct);
        
        const response = await fetch("http://localhost:3003/question/add", {
            method: "Post",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify({
                token, "exerciseId": id, "qn": newQuestion.question, "options": newQuestion.options, "correct": (newQuestion.correct)
            })
        })

        const data = await response.json();

        if(data.success){
            alert("Success");
            fetchExercise();
            setNewQuestion({
                id: 0,
                question: "",
                options: ["", "", "", ""],
                correct: 0,
                exerciseId: exercise.id,
              });
        } else{
            alert(data.message)
        }
    } catch(e: any){
        alert(e.message);
    }
    console.log("Added new question", newQuestion);
  };

  const updateQuestion = async () => {
    if (!editingQuestion) return;
    if (!exercise) return;
    // const updatedQuestions = exercise.questions.map((qn) =>
    //   qn.id === editingQuestion.id ? editingQuestion : qn
    // );
    // setExercise((prev) => prev ? { ...prev, questions: updatedQuestions } : prev);
    try{
        const response = await fetch("http://localhost:3003/question/update-qn", {
            method: "Post",
            headers:{
                "Content-type": "Application/json"
            },
            body: JSON.stringify({
                token, "exerciseId": id, "qn": editingQuestion.question, "questionId": editingQuestion.id, "options": editingQuestion.options, "correct": (editingQuestion.correct)
            })
        })

        const data = await response.json();

        if(data.success){
            alert("Success");
            setEditingQuestion(null);
            fetchExercise();
        } else{
            alert(data.message);
        }
    } catch(e:any){
        alert(e.message)
    }
    setEditingQuestion(null);
    // Placeholder for backend call
    console.log("Updated question", editingQuestion);
  };

  const deleteQuestion = async (id: number) => {
    if (!exercise) return;
    
   try{
    const response = await fetch("http://localhost:3003/question/delete", {
        method: "Delete",
        headers:{
            "Content-type":"Application/json"
        },
        body: JSON.stringify({
            token, id
        })
    });

    const data = await response.json();

    if(data.success){
        alert("Success");
        fetchExercise();
    } else{
        alert(data.message)
    }
   } catch(e:any){
    alert(e.message)
   }
    // Placeholder for backend call
    console.log(`Deleted question with id: ${id}`);
  };

  return (
    <div className="p-4">
      {/* Exercise Details */}
      <div className="mb-4">
        <p>
          Exercise Name:{" "}
          <input
            type="text"
            value={exercise?.name}
            onChange={(e) => updateExerciseName(e.target.value)}
            className="border p-1 rounded"
          />
        </p>
        <p>Date to be Posted: {exercise?.datePosted ? new Date(exercise.datePosted).toLocaleDateString() : "N/A"}</p>
        <p>Date it will Expire: {exercise?.dateExpires ? new Date(exercise.dateExpires).toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Questions Section */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Questions</h1>
        {exercise && exercise.questions.length < 1 ? (
          <p>No Questions Found</p>
        ) : (
          <ul className="mb-4">
            {exercise && exercise.questions.map((qn) => (
              <li
                key={qn.id}
                className="p-2 border-b flex justify-between items-center"
              >
                <span>
                  {qn.question} (Correct Answer: {qn.options[qn.correct]})
                </span>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                        if (editingQuestion !== null) {
                          setEditingQuestion(null);
                        } else {
                          setEditingQuestion(qn);
                        }
                    }}
                  >
                    {editingQuestion ? "Cancel" : "Edit" }
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteQuestion(qn.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Edit Question Form */}
        {editingQuestion && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Edit Question</h2>
            <input
              type="text"
              value={editingQuestion.question}
              onChange={(e) =>
                setEditingQuestion((prev) => prev && { ...prev, question: e.target.value })
              }
              className="border p-1 rounded w-full mb-2"
              placeholder="Question"
            />
            {editingQuestion.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                value={opt}
                onChange={(e) =>
                  setEditingQuestion((prev) =>
                    prev
                      ? {
                          ...prev,
                          options: prev.options.map((o, i) =>
                            i === index ? e.target.value : o
                          ),
                        }
                      : null
                  )
                }
                className="border p-1 rounded w-full mb-1"
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <select
              value={editingQuestion.correct}
              onChange={(e) =>
                setEditingQuestion((prev) =>
                  prev ? { ...prev, correct: parseInt(e.target.value) } : null
                )
              }
              className="border p-1 rounded w-full mb-2"
            >
              {editingQuestion.options.map((_, index) => (
                <option key={index} value={index}>
                  Option {index + 1}
                </option>
              ))}
            </select>
            <button
              onClick={updateQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        )}

        {/* Add New Question Form */}
        <div>
          <h2 className="text-xl font-semibold">Add New Question</h2>
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            className="border p-1 rounded w-full mb-2"
            placeholder="Question"
          />
          {newQuestion.options.map((opt, index) => (
            <input
              key={index}
              type="text"
              value={opt}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  options: prev.options.map((o, i) =>
                    i === index ? e.target.value : o
                  ),
                }))
              }
              className="border p-1 rounded w-full mb-1"
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <select
            value={newQuestion.correct}
            onChange={(e) =>
              setNewQuestion((prev) => ({
                ...prev,
                correct: parseInt(e.target.value),
              }))
            }
            className="border p-1 rounded w-full mb-2"
          >
            {newQuestion.options.map((_, index) => (
              <option key={index} value={index}>
                Option {index + 1}
              </option>
            ))}
          </select>
          <button
            onClick={addQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
