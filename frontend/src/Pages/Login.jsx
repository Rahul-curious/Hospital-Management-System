import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Patient"); // default role

  const navigateTo = useNavigate();
  const API = import.meta.env.VITE_API_URL; // use env variable

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API}/api/v1/user/login`,
        { email, password, confirmPassword, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message);
      setIsAuthenticated(true);
      setUser(res.data.user);
      navigateTo("/"); // redirect after login
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="container form-component login-form">
      <h2>Sign In</h2>
      <p>Please Login To Continue</p>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="Patient">Patient</option>
          <option value="Admin">Admin</option>
        </select>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <p style={{ marginBottom: 0 }}>Not Registered?</p>
          <Link to={"/register"} style={{ textDecoration: "none", color: "#271776ca" }}>
            Register Now
          </Link>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
