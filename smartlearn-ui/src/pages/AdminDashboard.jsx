import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("createTest");
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testDifficulty, setTestDifficulty] = useState("Medium");
  const [selectedTestId, setSelectedTestId] = useState(null);

  const [questionText, setQuestionText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("option1");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing tests on component mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://localhost:8083/tests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTests(data);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleCreateTest = async () => {
    if (!testTitle.trim()) {
      alert("Please enter a test title");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8083/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: testTitle,
          description: testDescription,
          difficulty: testDifficulty,
          totalQuestions: 0,
        }),
      });

      if (response.ok) {
        const newTest = await response.json();
        setTests([...tests, newTest]);
        alert("Test created successfully!");
        setTestTitle("");
        setTestDescription("");
        setTestDifficulty("Medium");
        setActiveTab("addQuestions");
        setSelectedTestId(newTest.id);
      } else {
        alert("Failed to create test");
      }
    } catch (error) {
      console.error("Error creating test:", error);
      alert("Error creating test");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!confirm("Are you sure you want to delete this test?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8083/tests/${testId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setTests(tests.filter((test) => test.id !== testId));
        alert("Test deleted successfully!");
      } else {
        alert("Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Error deleting test");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim() || !option1.trim() || !option2.trim() || !option3.trim() || !option4.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (!selectedTestId) {
      alert("Please select or create a test first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8083/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          questionText: questionText,
          option1: option1,
          option2: option2,
          option3: option3,
          option4: option4,
          correctAnswer: correctAnswer,
          test: { id: selectedTestId },
        }),
      });

      if (response.ok) {
        const newQuestion = await response.json();
        alert("Question added successfully!");
        setQuestionText("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectAnswer("option1");

        // Update test total questions
        const testToUpdate = tests.find((t) => t.id === selectedTestId);
        if (testToUpdate) {
          testToUpdate.totalQuestions = (testToUpdate.totalQuestions || 0) + 1;
          setTests([...tests]);
        }
      } else {
        const errorText = await response.text();
        alert(`Failed to add question: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert(`Error adding question: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("createTest")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "createTest" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
            }`}
          >
            Create Test
          </button>
          <button
            onClick={() => setActiveTab("addQuestions")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "addQuestions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
            }`}
          >
            Add Questions
          </button>
          <button
            onClick={() => setActiveTab("manageTests")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "manageTests" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
            }`}
          >
            Manage Tests
          </button>
        </div>

        {/* CREATE TEST TAB */}
        {activeTab === "createTest" && (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Test</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Title *</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g., Data Structures"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="Test description..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={testDifficulty}
                  onChange={(e) => setTestDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <button
                onClick={handleCreateTest}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Creating..." : "Create Test"}
              </button>
            </div>
          </div>
        )}

        {/* ADD QUESTIONS TAB */}
        {activeTab === "addQuestions" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Select Test to Add Questions</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => setSelectedTestId(test.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedTestId === test.id ? "border-blue-600 bg-blue-50" : "border-gray-300"
                    }`}
                  >
                    <h3 className="font-bold text-lg">{test.title}</h3>
                    <p className="text-sm text-gray-600">{test.difficulty} • {test.totalQuestions || 0} questions</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedTestId && (
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl">
                <h2 className="text-2xl font-bold mb-6">Add Questions</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Enter question..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Option 1 *</label>
                      <input
                        type="text"
                        value={option1}
                        onChange={(e) => setOption1(e.target.value)}
                        placeholder="Option 1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Option 2 *</label>
                      <input
                        type="text"
                        value={option2}
                        onChange={(e) => setOption2(e.target.value)}
                        placeholder="Option 2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Option 3 *</label>
                      <input
                        type="text"
                        value={option3}
                        onChange={(e) => setOption3(e.target.value)}
                        placeholder="Option 3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Option 4 *</label>
                      <input
                        type="text"
                        value={option4}
                        onChange={(e) => setOption4(e.target.value)}
                        placeholder="Option 4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                      <option value="option4">Option 4</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAddQuestion}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? "Adding..." : "Add Question"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANAGE TESTS TAB */}
        {activeTab === "manageTests" && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Manage Tests</h2>
            {tests.length === 0 ? (
              <p className="text-gray-600">No tests created yet</p>
            ) : (
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} className="p-4 border border-gray-300 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{test.title}</h3>
                        <p className="text-sm text-gray-600">{test.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {test.difficulty} • {test.totalQuestions || 0} questions
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteTest(test.id)}
                        disabled={loading}
                        className="text-red-600 font-semibold hover:text-red-800 disabled:text-gray-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
