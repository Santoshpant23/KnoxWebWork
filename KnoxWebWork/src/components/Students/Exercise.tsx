import { useEffect } from "react";
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

export default function SolveExercise() {
  const navigate = useNavigate();
  const location = useLocation();

  const exercise: Exercise = location.state?.exercise || null;

  useEffect(() => {
    if (!exercise) {
      navigate("/");
    }
  }, []);

  return (
    <div className="p-5">
      {exercise ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-5 text-center text-blue-800">
            Solve Exercise: {exercise.name}
          </h1>
          <p className="text-gray-600 text-center mb-10">
            Posted on: {new Date(exercise.datePosted).toLocaleDateString()} | Expires on: {new Date(exercise.dateExpires).toLocaleDateString()}
          </p>
          <div className="space-y-8">
            {exercise.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white shadow-md p-5 rounded-lg border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Question {index + 1}: {question.question}
                </h2>
                <ul className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionIndex}
                          className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => alert("Submitting answers...")}
              className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700"
            >
              Submit Answers
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500 font-semibold">
          No exercise found. Redirecting to the homepage...
        </div>
      )}
    </div>
  );
}
