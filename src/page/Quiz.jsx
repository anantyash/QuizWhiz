import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  // Redirect if no quiz options
  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-red-500 font-semibold">
        Quiz options not found. Please start from the home page.
      </div>
    );
  }

  const { category, difficulty } = data;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch quiz questions
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const url = `https://opentdb.com/api.php?amount=10${
          category ? `&category=${category}` : ""
        }${difficulty ? `&difficulty=${difficulty}` : ""}&type=multiple`;
        const res = await fetch(url);
        const result = await res.json();
        setQuestions(result.results || []);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setQuestions([]);
      }
      setLoading(false);
    }

    fetchQuestions();
  }, [category, difficulty]);

  const currentQuestion = questions[currentIndex] || null;

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    return [
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers,
    ].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const handleOptionClick = (option) => {
    setSelected(option);
    if (option === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
    } else {
      // Example: navigate to result page
      navigate("/result", { state: { score, total: questions.length } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading Quiz...
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-red-500 font-semibold">
        No questions found. Please try again with different options.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-2xl mb-4 text-gray-700 font-semibold">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <h2
          className="text-xl font-bold mb-4"
          dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
        />
        <div className="flex flex-col gap-3">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-2 rounded-lg border text-left ${
                selected === option
                  ? option === currentQuestion.correct_answer
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!selected}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50"
      >
        {currentIndex + 1 === questions.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}
