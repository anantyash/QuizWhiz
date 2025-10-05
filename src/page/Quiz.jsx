import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const hasFetched = useRef(false); // Prevent double fetch in Strict Mode

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
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch quiz questions with rate limit handling
  useEffect(() => {
    // Prevent double fetch in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      setCurrentIndex(0);
      setSelected(null);
      setScore(0);
      setOptions([]);

      try {
        const url = `https://opentdb.com/api.php?amount=10${
          category ? `&category=${category}` : ""
        }${difficulty ? `&difficulty=${difficulty}` : ""}&type=multiple`;

        const res = await fetch(url);

        if (res.status === 429) {
          // Rate limited - show user-friendly error
          setError("Too many requests. Please wait 10 seconds and try again.");
          setLoading(false);
          return;
        }

        const result = await res.json();

        if (result.response_code === 1) {
          // No results
          setError(
            "No questions available for this category/difficulty. Try different options."
          );
          setQuestions([]);
        } else if (result.results && result.results.length > 0) {
          setQuestions(result.results);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz. Please check your internet connection.");
        setQuestions([]);
      }
      setLoading(false);
    }

    // Add a small delay to avoid immediate rate limiting
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 500);

    return () => {
      clearTimeout(timer);
      hasFetched.current = false; // Reset on unmount
    };
  }, [category, difficulty]);

  // Shuffle options when question changes
  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]) {
      const currentQuestion = questions[currentIndex];
      const shuffled = [
        currentQuestion.correct_answer,
        ...currentQuestion.incorrect_answers,
      ].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
    }
  }, [questions, currentIndex]);

  const handleOptionClick = (option) => {
    if (selected) return; // Prevent changing answer

    setSelected(option);
    const currentQuestion = questions[currentIndex];
    if (option === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
    } else {
      navigate("/result", { state: { score } });
    }
  };

  const handleRetry = () => {
    hasFetched.current = false;
    setError(null);
    setLoading(true);
    // Trigger re-fetch by updating a dummy state or remounting
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading Quiz...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="text-lg text-red-500 font-semibold mb-4 text-center">
          {error}
        </div>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="text-lg text-red-500 font-semibold mb-4 text-center">
          No questions found. Please try again with different options.
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-red-500 font-semibold">
        Question not available. Please restart the quiz.
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
              disabled={selected !== null}
              className={`px-4 py-2 rounded-lg border text-left transition-colors ${
                selected === option
                  ? option === currentQuestion.correct_answer
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-red-500 text-white border-red-600"
                  : selected && option === currentQuestion.correct_answer
                  ? "bg-green-500 text-white border-green-600"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300"
              } ${selected ? "cursor-not-allowed" : "cursor-pointer"}`}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!selected}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {currentIndex + 1 === questions.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}
