import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategory(data.trivia_categories))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleQuiz = (e) => {
    e.preventDefault();
    navigate("/quiz", {
      state: { category: selectedCategory, difficulty: difficulty },
    });
    // <Quiz
    //   category={selectedCategory}
    //   difficulty={difficulty}
    //   finishQuiz={(score, total) => {
    //     console.log("Quiz finished!");
    //     console.log("Score:", score);
    //     console.log("Total Questions:", total);
    //   }}
    // />;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-4">
        {/* App Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Quiz-Whiz
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl max-w-xl text-center mb-6">
          Test your knowledge across multiple categories. Answer questions, beat
          the timer, and challenge yourself to get the highest score!
        </p>

        {/* Start Button */}
        <button
          onClick={handleQuiz}
          className="px-6 py-3 bg-white text-indigo-600 cursor-pointer font-semibold text-lg rounded-xl shadow-md hover:bg-indigo-100 transition-all"
        >
          Start Quiz
        </button>

        {/* Optional: Category / Difficulty selectors */}
        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          {/* <select className=" py-2 rounded-lg  border  text-white *:text-indigo-500 shadow-lg"> */}
          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 rounded-lg  border  text-white *:text-indigo-500 shadow-lg"
          >
            <option value="">Any Category</option>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-4 py-2 rounded-lg  border  text-white *:text-indigo-500 shadow-lg"
          >
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default App;
