import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as faceapi from "face-api.js";
import { getQuestions, submitQuiz } from "../api";

function MCQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const testId = query.get("testId") ? Number(query.get("testId")) : null;

  const videoRef = useRef(null);
  const [faceStatus, setFaceStatus] = useState("Loading face models...");
  const [isInvalidTest, setIsInvalidTest] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(15 * 60); // 15 minutes default
  const [started, setStarted] = useState(true); // test runs immediately
  const [score, setScore] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId") || 0);
    const key = `mcqState-${userId}-${testId || "all"}`;
    const savedString = localStorage.getItem(key);

    const fetchQuestions = async () => {
      if (!testId) {
        setIsInvalidTest(true);
        setErrorMessage("Please select a test from the dashboard instead of opening /quiz directly.");
        setLoading(false);
        return;
      }

      try {
        const data = await getQuestions(testId);
        if (!data || data.length === 0) {
          setErrorMessage("No questions found for this selected test.");
          setLoading(false);
          return;
        }

        const normalized = data.map((q) => ({
          ...q,
          options: q.options && q.options.length > 0
            ? q.options
            : [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
        }));

        setQuestions(normalized);

        if (savedString) {
          const parsed = JSON.parse(savedString);
          const safeCurrent = Number.isInteger(parsed.currentQuestion) && parsed.currentQuestion < normalized.length ? parsed.currentQuestion : 0;
          setCurrentQuestion(safeCurrent);
          setSelectedAnswers(parsed.selectedAnswers || Array(normalized.length).fill(null));
          setMarkedForReview(parsed.markedForReview || Array(normalized.length).fill(false));
          setVisitedQuestions(parsed.visitedQuestions || Array(normalized.length).fill(false));
          setTimerSeconds(parsed.timerSeconds ?? 15 * 60);
        } else {
          setSelectedAnswers(Array(normalized.length).fill(null));
          setMarkedForReview(Array(normalized.length).fill(false));
          setVisitedQuestions(Array(normalized.length).fill(false));
          setTimerSeconds(15 * 60);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions", error);
        setLoading(false);
      }
    };

    fetchQuestions();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("⚠️ Warning: you switched tabs during the test. Stay on this tab until you finish!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          clearInterval(timer);
          handleSubmitQuiz();
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [testId, started]);

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId") || 0);
    const key = `mcqState-${userId}-${testId || "all"}`;
    const stateObj = {
      currentQuestion,
      selectedAnswers,
      markedForReview,
      visitedQuestions,
      timerSeconds,
    };

    localStorage.setItem(key, JSON.stringify(stateObj));
  }, [currentQuestion, selectedAnswers, markedForReview, visitedQuestions, timerSeconds, testId]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestion >= questions.length) {
      setCurrentQuestion(0);
    }
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (isInvalidTest) {
      const timeout = setTimeout(() => navigate("/dashboard"), 2000);
      return () => clearTimeout(timeout);
    }

    const loadFaceApi = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setFaceStatus("Face models loaded");

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const detectionInterval = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState !== 4) {
            setFaceStatus("Waiting for camera...");
            return;
          }

          const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
          if (detection) {
            setFaceStatus("Face detected");
          } else {
            setFaceStatus("No face detected");
          }
        }, 3000);

        return () => {
          clearInterval(detectionInterval);
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          }
        };
      } catch (e) {
        setFaceStatus("Face API initialization failed");
        console.error(e);
      }
    };

    loadFaceApi();
  }, []);

  const handleSelectAnswer = (optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);

    setVisitedQuestions((prev) => {
      const next = [...prev];
      next[currentQuestion] = true;
      return next;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      setVisitedQuestions((prev) => {
        const copy = [...prev];
        copy[next] = true;
        return copy;
      });
    }
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = !copy[currentQuestion];
      return copy;
    });
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setVisitedQuestions((prev) => {
        const copy = [...prev];
        copy[prevQuestion] = true;
        return copy;
      });
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const answers = questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: selectedAnswers[index] != null && question.options ? question.options[selectedAnswers[index]] : "",
      }));

      const userId = Number(localStorage.getItem("userId") || 0);
      const questionReviews = questions.map((question, index) => ({
        questionId: question.id,
        markedForReview: markedForReview[index] || false,
      }));

      const resultText = await submitQuiz({
        userId,
        testId,
        answers,
        questionReviews,
      });
      setScore(Math.round((selectedAnswers.filter((a) => a !== null).length / questions.length) * 100));
      setTestSubmitted(true);
      localStorage.removeItem(`mcqState-${userId}-${testId || "all"}`);
      console.log(resultText);
    } catch (error) {
      console.error("Failed to submit quiz", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading questions...</div>;
  }

  if (errorMessage) {
    return (
      <div className="p-8 text-center">
        <div className="bg-white p-8 rounded shadow-md max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{errorMessage}</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (testSubmitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-2xl mb-8">Your Score: {score}%</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="p-8 text-center">No questions available</div>;
  }

  const question = questions[currentQuestion] || { questionText: "", options: [] };

  return (
    <div className="p-8 max-w-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Question {currentQuestion + 1} of {questions.length}</h3>
              <p className="text-sm text-gray-600">{question.questionText}</p>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-semibold">
              Time left: {String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}
            </div>
          </div>

          <div className="relative mb-4 bg-gray-100 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-2">Proctor status: {faceStatus}</p>
              </div>
              <div className="ml-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-24 h-24 rounded-lg border-2 border-gray-300 bg-black"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-200 h-2 rounded mb-6 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-4 mb-6">
            {question.options && question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isMarkReview = markedForReview[currentQuestion];
              const optionClass = isMarkReview
                ? "border-yellow-500 bg-yellow-50"
                : isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-blue-500 bg-blue-50";

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full text-left p-4 border rounded-lg transition ${optionClass}`}
                  disabled={testSubmitted}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            <button
              onClick={toggleMarkForReview}
              className={`px-6 py-2 rounded ${markedForReview[currentQuestion] ? "bg-orange-500 text-white" : "bg-yellow-100 text-yellow-800"}`}
            >
              {markedForReview[currentQuestion] ? "Unmark Review" : "Mark for Review"}
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-bold mb-3">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => {
              const isCurrent = index === currentQuestion;
              const isAnswered = selectedAnswers[index] !== null;
              const isMarked = markedForReview[index];
              const isVisited = visitedQuestions[index];

              let className = "text-xs font-semibold rounded-full w-8 h-8 flex items-center justify-center border cursor-pointer";
              if (isCurrent) className += " bg-blue-600 text-white border-blue-700";
              else if (isMarked) className += " bg-yellow-300 text-yellow-800 border-yellow-400";
              else if (isAnswered) className += " bg-green-400 text-green-800 border-green-500";
              else className += " bg-blue-100 text-blue-800 border-blue-300";

              return (
                <button key={index} onClick={() => setCurrentQuestion(index)} className={className}>
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-sm">
            <p>Answered: {selectedAnswers.filter((val) => val !== null).length}/{questions.length}</p>
            <p>Marked for review: {markedForReview.filter(Boolean).length}</p>
            <p>Visited: {visitedQuestions.filter(Boolean).length}/{questions.length}</p>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MCQ;
