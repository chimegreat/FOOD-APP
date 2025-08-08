import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Sign Up");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleState = (state) => {
  setCurrState(state);
  setData({ name: "", email: "", password: "" });
};

const onLogin = async (event) => {
  event.preventDefault();

  let newUrl = `${url}/api/user/${currState === "Login" ? "login" : "register"}`;

  try {
    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    } else {
      alert(response.data.message || "Something went wrong!");
      setData({ name: "", email: "", password: "" });
    }
  } catch (error) {
    console.error("Login/Register error:", error);
    alert("Server error. Please try again.");
  }
}
  
  return (
    <div className="login-popup">
<form className="login-popup-container" onSubmit={onLogin}>
  <div className="login-popup-title">
    <h2>{currState}</h2>
    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
  </div>

  <div className="login-popup-inputs">
    {currState === "Sign Up" && (
      <input
        onChange={onChangeHandler}
        value={data.name}
        name="name"
        type="text"
        placeholder="Your name"
        required
      />
    )}
    <input
      onChange={onChangeHandler}
      value={data.email}
      name="email"
      type="email"
      placeholder="Your email"
      required
    />
    <input
      onChange={onChangeHandler}
      value={data.password}
      name="password"
      type="password"
      placeholder="Password"
      required
    />
  </div>

  <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
  <div className="login-popup-condition">
    <input type="checkbox" required />
    <p>By continuing, I agree to the terms of use & privacy policy.</p>
  </div>

  <p>
    Create a new account?{" "}
    <span onClick={() => toggleState("Sign Up")}>Click here</span>
  </p>
  <p>
    Already have an account?{" "}
    <span onClick={() => toggleState("Login")}>Login here</span>
  </p>
</form>

    </div>
  );
};

export default LoginPopup;
