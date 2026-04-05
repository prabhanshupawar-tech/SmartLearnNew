import { useNavigate } from "react-router-dom";
import { logout } from "../api";

function Sidebar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Student";
  const userRole = localStorage.getItem("userRole") || "USER";
  const photoData = localStorage.getItem("userPhoto");

  return (
    <aside className="w-64 bg-white border-r p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center mb-6">
          {photoData ? (
            <img src={photoData} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-lg text-white mb-2">
              {username[0].toUpperCase()}
            </div>
          )}
          <p className="font-bold">{username}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>

        <h2 className="font-bold mb-4">Menu</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="hover:text-orange-500 cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</li>
          {userRole === "ADMIN" && (
            <li className="hover:text-orange-500 cursor-pointer" onClick={() => navigate("/admin")}>Admin Panel</li>
          )}
          <li className="hover:text-orange-500 cursor-pointer" onClick={() => navigate("/profile")}>Profile</li>
          <li
            className="hover:text-orange-500 cursor-pointer"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">Instructions: complete checkbox before starting test.</div>
    </aside>
  );
}

export default Sidebar;
