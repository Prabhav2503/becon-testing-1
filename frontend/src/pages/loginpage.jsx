import Galaxy from "../styles/background.jsx";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function LoginPage(params) {
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false)

  function submitbtn () {
    setusername("");
    setpassword("");
    alert("submitted")
  }

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "relative", backgroundColor: "black"}}>
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.5}
          saturation={0.8}
          hueShift={240}
        />
      </div>
      <div className="LoginPage">
        <div className="mainPanel">
          <h2 id="heading">{params.heading}</h2>
          <p id="title">{params.title}</p>
        </div>
        <input
          id="username"
          className="inputs"
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => {setusername(e.target.value)}}
        />
        <input
          id="password"
          className="inputs"
          type={showpassword?"text":"password"}
          placeholder="Password"
          value={password}
          onChange={(e) => {setpassword(e.target.value)}}
        />
        <div className="passwordoptions">
          <label htmlFor="showpassword">
            <input type="checkbox" id="showpassword" checked = {showpassword} onChange={(e) => {setshowpassword(e.target.checked)}}/> Show Password
          </label>
          <NavLink to="/forgot-password" className="forgetpassword">
            Forgot Password?
          </NavLink>
        </div>
        <button type="submit" id="signin" onClick={submitbtn}>
          Sign In
        </button>
        <div className="divider">OR</div>
        <button className="googlebtn">
          <img id="googlelogo" src="/assets/google.png" alt="Google Logo" />
          <span id="googletext">Sign in with Google</span>
        </button>
      </div>
    </>
  );
}

export default LoginPage;
