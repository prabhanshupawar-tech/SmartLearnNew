import { useEffect, useState } from "react";
import { getProfile, uploadProfilePhoto, getPhotoUrl } from "../api";

const getUserId = () => Number(localStorage.getItem("userId") || 1);

function Profile() {
  const USER_ID = getUserId();
  const [user, setUser] = useState({ username: "Student" });
  const [photoUrl, setPhotoUrl] = useState("");
  const [fileInput, setFileInput] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const u = await getProfile(USER_ID);
        setUser(u);
        setPhotoUrl(getPhotoUrl(USER_ID));
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadProfilePhoto(USER_ID, file);
    const newUrl = `${getPhotoUrl(USER_ID)}?t=${Date.now()}`;
    setPhotoUrl(newUrl);
    localStorage.setItem("userPhoto", newUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 flex flex-col items-center">
            {photoUrl ? (
              <img src={photoUrl} alt="profile" className="w-40 h-40 rounded-full object-cover mb-6 border-4 border-blue-500" />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl text-white mb-6 border-4 border-gray-200">
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <label className="cursor-pointer">
              <input
                ref={setFileInput}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center">
                Upload Photo
              </div>
            </label>
          </div>
          <div className="col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                value={user.username || ""}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                value={user.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                value={user.role || "USER"}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
