import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  exerciseId: number;
}

export default function QuestionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const question: Question = location.state?.question;
  const index = location.state?.index;
  const scores = location.state?.scores;
  const total = location.state?.total;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!question) {
      alert("Something is wrong");
      navigate("/");
    }
  }, []);

  const submitAnswer = () => {
    if (selectedOption === null) {
      alert("Please select an answer before submitting.");
      return;
    }

    const isCorrect = selectedOption === question.correct;
    if (isCorrect) {
      navigate("/solve-question", {
        state: { question, index, scores: scores + 1, total },
      });
    } else {
      navigate("/solve-question", {
        state: { question, index, scores, total },
      });
    }
    setSubmitted(true);
  };

  const nextQuestion = () => {
    navigate(-1); // Navigate to the parent component to fetch the next question
  };

  return (
    <div className="h-screen p-5 flex flex-col justify-start items-center">
      <div className="text-2xl italic font-semibold bg-green-300 p-5 rounded-3xl">
        Your Score: {scores} / {total}
      </div>
      <div className="font-bold text-3xl italic m-3 mb-3">
        Choose one of the options below:
      </div>
      <div
        key={question.id}
        className="w-full bg-white shadow-md p-5 rounded-lg border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-700">
          Question: {question.question}
        </h2>
        <ul className="space-y-3 mt-5">
          {question.options.map((option, optionIndex) => (
            <li
              key={optionIndex}
              className={`p-3 rounded-lg ${
                submitted
                  ? optionIndex === question.correct
                    ? "bg-green-200"
                    : optionIndex === selectedOption
                    ? "bg-red-200"
                    : "bg-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={optionIndex}
                  className="form-radio h-5 w-5 text-blue-600"
                  disabled={submitted}
                  onChange={() => setSelectedOption(optionIndex)}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {submitted && (
        <div className="mt-5 text-lg font-semibold">
          {selectedOption === question.correct ? (
            <p className="text-green-600">Correct!</p>
          ) : (
            <p className="text-red-600">Incorrect.</p>
          )}
        </div>
      )}

      <div className="mt-10 flex justify-center space-x-5">
        {!submitted ? (
          <button
            onClick={submitAnswer}
            className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-gray-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-gray-700"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
