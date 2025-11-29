import { useEffect, useState } from "react";

function App() {
  const url = "http://localhost:3000/";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [friends, setFriends] = useState([]);  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [friendName, setFriendName] = useState("");

  // ------------------------------------
  // 🔥 CHECK COOKIE ON PAGE LOAD
  // ------------------------------------
  useEffect(() => {
    fetch(`${url}users/`, {
      method: "GET",
      credentials: "include"
    })
      .then(async (res) => {
        if (res.status === 401) {
          setIsLoggedIn(false);
          return;
        }

        const data = await res.json();
        setFriends(data);
        setIsLoggedIn(true);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  // ------------------------------------
  // 🔥 LOGIN → if fails → SIGNUP
  // ------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIRST try login
    const loginRes = await fetch(`${url}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (loginRes.status === 404) {
      // User not found → SIGNUP
      console.log("User not found → creating account");

      const signupRes = await fetch(`${url}signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const signupData = await signupRes.json();
      console.log("Signup success:", signupData);

      setIsLoggedIn(true);

      // Load initial empty friend list
      setFriends([]);
      return;
    }

    // LOGIN SUCCESS
    const data = await loginRes.json();
    console.log("Login success:", data);

    setFriends(data.friends || []);
    setIsLoggedIn(true);
  };

  // ------------------------------------
  // 🔥 ADD FRIEND
  // ------------------------------------
  const handleAddFriend = async (e) => {
    e.preventDefault();

    const res = await fetch(`${url}users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ friend_name: friendName }),
    });

    const data = await res.json();
    console.log("Created:", data);

    // Reload friend list
    const refreshed = await fetch(`${url}users/`, {
      method: "GET",
      credentials: "include",
    });
    const refreshedFriends = await refreshed.json();
    setFriends(refreshedFriends);

    setFriendName("");
  };

const handleLogout = async () => {
  await fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include"
  });

  setFriends([]);
  setIsLoggedIn(false);
};

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <div className="flex items-center justify-center w-full h-screen bg-[#262626]">

      {/* ----------------------- LOGIN / SIGNUP PAGE ----------------------- */}
      {!isLoggedIn && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-96"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Login / Signup
          </h2>

          <label className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Submit
          </button>
        </form>
      )}

      {/* ----------------------- DASHBOARD ----------------------- */}
      {isLoggedIn && (
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h1 className="text-xl font-bold mb-4">Your Friends</h1>

          <ul className="mb-4">
            {friends.map((f, index) => (
              <li key={index} className="text-black">
                {f.friend_name}
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddFriend}>
            <input
              type="text"
              className="w-full p-2 mb-2 border rounded"
              placeholder="Friend name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              required
            />
            <button className="w-full bg-green-500 text-white py-2 rounded">
              Add Friend
            </button>
          </form>

          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
  Logout
</button>

        </div>
      )}
    </div>
  );
}

export default App;
