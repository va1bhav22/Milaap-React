import React, { useState, useEffect } from "react";
import questionsData from "../data.json";
import "../styles/Quiz.css";
import easy from "../assets/img/1-removebg-preview.png";
import medium from "../assets/img/2-removebg-preview.png";
import hard from "../assets/img/3-removebg-preview.png";
import correct from "../assets/img/correct-removebg-preview.png";
import incorrect from "../assets/img/incorrect-removebg-preview.png";

const Game = () => {
  const [level, setLevel] = useState("easy");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem("quizProgress");
    if (savedProgress) {
      const { level, currentQuestionIndex, score } = JSON.parse(savedProgress);
      setLevel(level);
      setCurrentQuestionIndex(currentQuestionIndex);
      setScore(score);
    }
  }, []);

  const currentQuestions = questionsData[level];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const saveProgress = () => {
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({ level, currentQuestionIndex, score })
    );
  };

  // Handle Answer Submission
  const handleSubmit = () => {
    if (!userAnswer) return;

    const isCorrect =
      currentQuestion.type === "text-input"
        ? userAnswer.trim().toLowerCase() ===
          currentQuestion.correctAnswer.trim().toLowerCase()
        : userAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => {
        const newScore =
          prevScore + (level === "easy" ? 10 : level === "medium" ? 20 : 30);
        saveProgress();
        return newScore;
      });
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect!");
    }

    setUserAnswer("");

    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else if (isCorrect && level !== "hard") {
        const nextLevel = level === "easy" ? "medium" : "hard";
        setLevel(nextLevel);
        setCurrentQuestionIndex(0);
      } else {
        setShowResult(true);
      }
      setFeedback("");
    }, 1000);
  };

  const restartQuiz = () => {
    localStorage.removeItem("quizProgress");
    setLevel("easy");
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setFeedback("");
  };

  if (showResult) {
    return (
      <div className="restartQuizContainer">
        <div className="restartQuiz">
          <h2>Quiz Finished!</h2>
          <p>Your final score: {score}</p>
          <button className="btn" onClick={restartQuiz}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="quiz-container">
        <h1>Quiz Game</h1>
        <div>
          {level === "easy" ? (
            <img src={easy} alt="" className="imgMeter" />
          ) : level === "medium" ? (
            <img src={medium} alt="" className="imgMeter" />
          ) : (
            <img src={hard} alt="" className="imgMeter" />
          )}
        </div>
        <p>Score: {score}</p>
        <div className="questionOptionsContainer">
          <div className={`question`}>
            <p
              className={`questionText ${
                level === "easy"
                  ? " easyColor"
                  : level === "medium"
                  ? " mediumColor"
                  : "hardColor"
              }`}
            >
              {currentQuestion.question}
            </p>
          </div>
          <div className="multipleChoice">
            {currentQuestion.type === "multiple-choice" &&
              currentQuestion.options.map((option, index) => (
                <label key={index} style={{ display: "block" }}>
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  {option}
                </label>
              ))}
          </div>
          <div className="multipleChoice">
            {currentQuestion.type === "true-false" && (
              <>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value="true"
                    checked={userAnswer === "true"}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  True
                </label>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value="false"
                    checked={userAnswer === "false"}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  False
                </label>
              </>
            )}
          </div>
          <div>
            {currentQuestion.type === "text-input" && (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="inputBox"
              />
            )}
          </div>
          <button className="btn" onClick={handleSubmit}>
            Submit
          </button>

          {feedback && (
            <div className="feedbackContainer">
              <p className="feedbackText">{feedback}</p>
              {feedback === "Correct!" ? (
                <img src={correct} alt="" className="feedbackImg" />
              ) : (
                <img src={incorrect} alt="" className="feedbackImg" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
