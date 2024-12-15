import { useState } from "react";
import { useLocation } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface Exercise {
  id: number;
  name: string;
  questions: Question[];
}

export default function SidebarExercise() {
  const location = useLocation();
  const exercise: Exercise = location.state.exercise || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>(new Array(exercise.questions.length).fill(null));
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an answer before submitting.");
      return;
    }

    const isCorrect = selectedOption === exercise.questions[currentQuestionIndex!].correct;
    const updatedScores = [...scores];
    updatedScores[currentQuestionIndex!] = isCorrect ? 1 : 0;
    setScores(updatedScores);
    setSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex !== null && currentQuestionIndex + 1 < exercise.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      alert("You have completed all questions!");
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r shadow-md">
        <div className="p-4 font-bold text-lg text-blue-800">Questions</div>
        <ul>
          {exercise.questions.map((_, index) => (
            <li
              key={index}
              onClick={() => handleQuestionClick(index)}
              className={`p-4 cursor-pointer flex justify-between ${
                currentQuestionIndex === index
                  ? "bg-blue-200"
                  : scores[index] === 1
                  ? "bg-green-100"
                  : scores[index] === 0
                  ? "bg-red-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>Question {index + 1}</span>
              {scores[index] !== null && <span>✅</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Question Content */}
      <div className="w-3/4 p-5">
        {currentQuestionIndex !== null ? (
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              {exercise.questions[currentQuestionIndex].question}
            </h1>
            <ul className="space-y-3">
              {exercise.questions[currentQuestionIndex].options.map((option, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg ${
                    submitted
                      ? index === exercise.questions[currentQuestionIndex].correct
                        ? "bg-green-200"
                        : index === selectedOption
                        ? "bg-red-200"
                        : "bg-gray-100"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      className="form-radio h-5 w-5 text-blue-600"
                      disabled={submitted}
                      onChange={() => setSelectedOption(index)}
                      checked={selectedOption === index}
                    />
                    <span>{option}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-between">
              {!submitted ? (
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  onClick={handleSubmit}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  onClick={handleNextQuestion}
                >
                  Next Question
                </button>
              )}
              {submitted && (
                <div className={`font-bold ${scores[currentQuestionIndex] === 1 ? "text-green-600" : "text-red-600"}`}>
                  {scores[currentQuestionIndex] === 1 ? "Correct!" : "Incorrect."}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 font-semibold">
            Select a question from the left to begin.
          </div>
        )}
      </div>
    </div>
  );
}
