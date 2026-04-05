import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import { getAnalytics } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    testsDone: 0,
    avgScore: 0,
    timeStudied: 0,
    rank: 0
  });
  const [recentActivity, setRecentActivity] = useState("No tests taken yet.");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch analytics
        const analyticsData = await getAnalytics();
        const testsMatch = analyticsData.match(/Total Tests: (\d+)/);
        const accuracyMatch = analyticsData.match(/Accuracy: ([\d.]+)%/);

        const testsDone = testsMatch ? parseInt(testsMatch[1]) : 0;
        const avgScore = accuracyMatch ? parseFloat(accuracyMatch[1]) : 0;

        setStats((prev) => ({
          ...prev,
          testsDone,
          avgScore: Math.round(avgScore),
          timeStudied: testsDone * 0.5,
          rank: testsDone > 0 ? Math.max(1, 1000 - (testsDone * 10) - (avgScore * 5)) : 0
        }));

        // Fetch user-specific results and recent activity
        const userId = Number(localStorage.getItem("userId") || 0);
        if (userId) {
          const userResultsResp = await fetch(`http://localhost:8083/api/results/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (userResultsResp.ok) {
            const userResults = await userResultsResp.json();
            const userTestsDone = userResults.length;
            const userAverage =
              userTestsDone > 0
                ? Math.round(
                    userResults.reduce((sum, r) => sum + (r.totalQuestions ? (r.score / r.totalQuestions) * 100 : 0), 0) / userTestsDone
                  )
                : 0;

            setStats((prev) => ({
              ...prev,
              testsDone: userTestsDone,
              avgScore: userAverage,
              timeStudied: userTestsDone * 0.5,
              rank: userTestsDone > 0 ? Math.max(1, 1000 - userTestsDone * 10 - userAverage * 5) : 0,
            }));

            if (userResults.length > 0) {
              const latest = userResults.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
              setRecentActivity(`Completed ${latest.testId ? "Test #" + latest.testId : "a test"} — score ${Math.round((latest.score / latest.totalQuestions) * 100)}%`);
            }
          }
        }

        // Fetch tests from backend
        const response = await fetch("http://localhost:8083/tests/available", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (response.ok) {
          const testsData = await response.json();
          setTests(testsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, []);

  const quizzes = [
    { id: 1, title: "Data Structures", questions: 10, difficulty: "Medium" },
    { id: 2, title: "Algorithms", questions: 15, difficulty: "Hard" },
    { id: 3, title: "Databases", questions: 10, difficulty: "Medium" },
  ];

  const availableTests = tests.filter((test) => (test.totalQuestions || (test.questions ? test.questions.length : 0)) > 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatsCard title="Tests Done" value={loading ? "..." : stats.testsDone.toString()} sub={stats.testsDone > 0 ? "Keep going!" : "Start your first test"} />
          <StatsCard title="Avg Score" value={loading ? "..." : `${stats.avgScore}%`} sub={stats.avgScore > 0 ? `${stats.avgScore >= 70 ? "+" : ""}${stats.avgScore - 70}%` : "No tests yet"} />
          <StatsCard title="Time Studied" value={loading ? "..." : `${stats.timeStudied}h`} sub={stats.timeStudied > 0 ? "Great progress!" : "Begin learning"} />
          <StatsCard title="Rank" value={loading ? "..." : stats.rank > 0 ? `#${stats.rank}` : "Unranked"} sub={stats.rank > 0 ? "Based on performance" : "Complete tests to rank"} />
        </div>

        {/* TEST SELECTOR */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Available Tests</h2>
          {tests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <p className="text-gray-600">No tests available yet. Please check back later!</p>
            </div>
          ) : availableTests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <p className="text-gray-600">No live tests available yet. Ask admin to create tests with questions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {availableTests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => navigate(`/quiz?testId=${test.id}`)}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition transform hover:scale-105"
                >
                  <h3 className="font-bold text-lg mb-2">{test.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{test.description}</p>
                  <p className="text-gray-500 text-sm mb-4">
                    {test.totalQuestions || (test.questions ? test.questions.length : 0)} Questions • {test.difficulty}
                  </p>
                  <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600" onClick={(e) => { e.stopPropagation(); navigate(`/quiz?testId=${test.id}`); }}>
                    Start Test →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Subject Progress</h2>
            <p>Data Structures - {stats.testsDone ? "82%" : "0%"}</p>
            <p>Algorithms - {stats.testsDone ? "65%" : "0%"}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow col-span-2">
            <h2 className="font-semibold mb-3">Recent Activity</h2>
            <p className="text-gray-500">{recentActivity}</p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-inner">
          <h2 className="text-xl font-semibold">Performance Hologram</h2>
          <p className="mt-2 text-sm">You’re in the {stats.avgScore >= 80 ? "Top tier" : stats.avgScore >= 50 ? "Mid tier" : "Starting tier"} based on your latest scores.</p>
          <div className="mt-4 w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-white rounded-full transition-all"
              style={{ width: `${Math.min(100, stats.avgScore)}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm">Projected Rank: {stats.rank > 0 ? `#${stats.rank}` : "Unranked"}</p>
        </div>
      </div>
    </div>
  );
  
}

export default Dashboard;