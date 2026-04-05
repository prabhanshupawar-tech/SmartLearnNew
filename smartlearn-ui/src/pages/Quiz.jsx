import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions, submitQuiz } from "../api";

function Quiz() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [acceptedInstructions, setAcceptedInstructions] = useState(false);
  const [faceWarnings, setFaceWarnings] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [proctorStatus, setProctorStatus] = useState("Initializing camera...");
  const [lastFaceCheck, setLastFaceCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
        setSelectedAnswers(Array(data.length).fill(null));
        setVisitedQuestions(Array(data.length).fill(false));
        setMarkedForReview(Array(data.length).fill(false));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions", error);
        setLoading(false);
      }
    };

    fetchQuestions();

    const handleVisibility = () => {
      if (document.hidden) {
        alert("⚠️ Warning: You switched tabs during the test!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setProctorStatus("Camera stream active");
      } catch (error) {
        setCameraError("Camera access denied or unavailable.");
        setProctorStatus("Camera unavailable");
      }
    };

    startCamera();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      const currentVideo = videoRef.current;
      if (currentVideo && currentVideo.srcObject) {
        const tracks = currentVideo.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);   
  
  

  const handleAnswer = (selectedOption) => {
    if (selectedAnswers[currentQuestion] !== null) return; // first choice only

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setSelectedAnswers(newAnswers);

    setVisitedQuestions((prev) => {
      const next = [...prev];
      next[currentQuestion] = true;
      return next;
    });

    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setAnswered(answered + 1);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => {
        const next = prev + 1;
        setVisitedQuestions((vis) => {
          const newVisited = [...vis];
          newVisited[next] = true;
          return newVisited;
        });
        return next;
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => {
        const next = prev - 1;
        setVisitedQuestions((vis) => {
          const newVisited = [...vis];
          newVisited[next] = true;
          return newVisited;
        });
        return next;
      });
    }
  };

  const detectFace = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return false;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple face detection: check for skin tone colors and brightness variation
    let skinPixels = 0;
    let totalPixels = data.length / 4;
    let brightnessSum = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;

      brightnessSum += brightness;

      // Simple skin tone detection (rough approximation)
      if (r > 60 && g > 40 && b > 20 && r > b && Math.abs(r - g) < 15) {
        skinPixels++;
      }
    }

    const avgBrightness = brightnessSum / totalPixels;
    const skinRatio = skinPixels / totalPixels;

    // Consider face detected if there's reasonable brightness and skin tone ratio
    const faceFound = avgBrightness > 50 && skinRatio > 0.05;
    setLastFaceCheck({ timestamp: new Date().toLocaleTimeString(), faceFound, avgBrightness, skinRatio });
    return faceFound;
  };

  const startTest = () => {
    if (!acceptedInstructions) {
      alert("Please accept instructions before starting the test.");
      return;
    }

    const faceDetected = detectFace();
    if (!faceDetected) {
      const nextWarnings = Math.min(3, faceWarnings + 1);
      setFaceWarnings(nextWarnings);
      if (nextWarnings >= 3) {
        alert("Face not detected thrice. Test cannot be started.");
        return;
      }
      alert(`Face not detected. Warning ${nextWarnings}/3. Please ensure your face is clearly visible in the camera.`);
      return;
    }

    // take photo snapshot from the video stream
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL("image/jpeg"));

    setStarted(true);
  };

  const jumpToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentQuestion(index);
    setVisitedQuestions((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = [...prev];
      next[currentQuestion] = !next[currentQuestion];
      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      const answers = selectedAnswers.map((answer, index) => ({
        questionId: questions[index].id,
        selectedAnswer: answer,
      }));
      const result = await submitQuiz(answers);
      setTestSubmitted(true);
      setTimeout(() => {
        navigate("/result", {
          state: { score, total: questions.length, message: result },
        });
      }, 1500);
    } catch (error) {
      alert("Failed to submit quiz: " + error.message);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p>No questions available.</p>
        </div>
      </div>
    );
  }

  if (testSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Test Submitted! ✓</h2>
          <p className="text-gray-600">Calculating your results...</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Test Instructions</h1>
          <ol className="list-decimal ml-6 space-y-2 text-gray-700 mb-4">
            <li>Enable webcam access to allow proctoring.</li>
            <li>Do not switch tabs during the test (tab switch is tracked).</li>
            <li>Answer each question to the best of your ability.</li>
            <li>Result and analytics will be shown after submission.</li>
          </ol>
          <div className="mb-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptedInstructions}
                onChange={(e) => setAcceptedInstructions(e.target.checked)}
                className="rounded border-gray-300 text-orange-500"
              />
              <span> I have read and agree to follow all proctoring instructions</span>
            </label>
          </div>

          <button
            onClick={startTest}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
            disabled={!acceptedInstructions}
          >
            Start Test
          </button>

          {capturedPhoto && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Captured profile photo for proctoring:</p>
              <img src={capturedPhoto} alt="Captured" className="w-40 h-30 object-cover rounded-lg mt-2" />
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Face warnings: {faceWarnings}/3
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6">
        {/* Main Quiz Area */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Data Structures Quiz</h1>
                <p className="text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              <div className="text-orange-500 font-bold text-xl">⏱ 09:58</div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold mb-6">
              {questions[currentQuestion].question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {["option1", "option2", "option3", "option4"].map((opt, index) => {
                const selected = selectedAnswers[currentQuestion] === opt;
                const isCorrect = questions[currentQuestion].correctAnswer === opt;
                const wasAnswered = selectedAnswers[currentQuestion] !== null;

                const optionClass = wasAnswered
                  ? selected
                    ? isCorrect
                      ? "border-green-500 bg-green-100"
                      : "border-red-500 bg-red-100"
                    : isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                  : "border-gray-200 hover:border-orange-400 hover:bg-orange-50";

                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition ${optionClass}`}
                    disabled={wasAnswered}
                  >
                    <span className="font-semibold text-orange-500">
                      {String.fromCharCode(65 + index)}.
                    </span>{" "}
                    {questions[currentQuestion][opt]}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50"
              >
                ← Previous
              </button>

              <span className="text-gray-600">
                Answered: <strong>{answered}</strong>/{questions.length}
              </span>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                >
                  Submit Test ✓
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Panel */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-6">
            <h3 className="font-bold mb-3 text-center">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const isCurrent = currentQuestion === index;
                const isAnswered = selectedAnswers[index] !== null;
                const isMarked = markedForReview[index];

                let className = "p-3 rounded-full text-xs font-semibold border-2 text-center cursor-pointer";
                if (isCurrent) className += " bg-blue-600 text-white border-blue-700";
                else if (isMarked) className += " bg-orange-200 text-orange-700 border-orange-400";
                else if (isAnswered) className += " bg-green-200 text-green-700 border-green-400";
                else className += " bg-gray-100 text-gray-700 border-gray-300";

                return (
                  <button
                    key={index}
                    onClick={() => jumpToQuestion(index)}
                    className={className}
                    title={`Q${index + 1} ${isAnswered ? "Answered" : "Unanswered"}${isMarked ? " - Marked" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <button
                onClick={toggleMarkForReview}
                className="w-full px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                {markedForReview[currentQuestion] ? "Unmark Review" : "Mark For Review"}
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <div><span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Current question</div>
              <div><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>Answered</div>
              <div><span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2"></span>Not visited</div>
              <div><span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Marked for review</div>
            </div>
          </div>
        </div>

        {/* Proctoring Panel */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-6">
            <h3 className="font-bold mb-3 text-center">Camera Proctoring</h3>
            {cameraError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm">
                {cameraError}
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-48 rounded-lg border-2 border-gray-200 object-cover mb-3"
                />
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cameraError ? "bg-red-500" : "bg-green-500"}`}></span>
                    <span>{cameraError ? "Camera Error" : "Camera Active"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Tab Detection: Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Face Detection Status: {proctorStatus}</span>
                  </div>
                  {lastFaceCheck && (
                    <div className="rounded border border-gray-200 p-2 bg-gray-50">
                      <p className="text-[10px]">Last check: {lastFaceCheck.timestamp}</p>
                      <p className="text-[10px]">Detected: {lastFaceCheck.faceFound ? "Yes" : "No"}</p>
                      <p className="text-[10px]">Skin ratio: {lastFaceCheck.skinRatio.toFixed(3)}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
