import { useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // to send cookies

function App() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [step, setStep] = useState("signup"); // signup, verifySignup, login, verifyLogin
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        email: form.email,
      });
      setMessage(res.data.message);
      setStep("verifySignup");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleVerifySignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/verify-signup", {
        username: form.username,
        email: form.email,
        password: form.password,
        otp: form.otp,
      });
      setMessage(res.data.message);
      setStep("login");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email: form.email,
        password: form.password,
      });
      setMessage(res.data.message);
      setStep("verifyLogin");
    } catch (err) {
      setMessage(err.response?.data?.error || err.message);
    }
  };

  const handleVerifyLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/verify-login", {
        email: form.email,
        otp: form.otp,
      });
      setMessage(res.data.message);
      setStep("loggedIn");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/logout");
      setMessage(res.data.message);
      setStep("signup");
      setForm({ username: "", email: "", password: "", otp: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Auth Test App</h1>
        {message && <p className="mb-4 text-center text-red-500">{message}</p>}

        {step === "signup" && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleSignup}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "verifySignup" && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleVerifySignup}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Verify & Register
            </button>
          </>
        )}

        {step === "login" && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>
          </>
        )}

        {step === "verifyLogin" && (
          <>
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleVerifyLogin}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === "loggedIn" && (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
