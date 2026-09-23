import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./login.css";
import data from "../../data/data.json";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username) {
      setError("Please enter email");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }

    if (!role) {
      setError("Please select a role");
      return;
    }

    const user = data.users.find(
      (user) =>
        user.email === username &&
        user.password === password &&
        user.role === role
    );

    if (user) {
      setError("");

      
      login(user);

      // Store user in cookie
      document.cookie = `loggedInUser=${encodeURIComponent(
        JSON.stringify(user)
      )}; max-age=3600; path=/`;

      alert(`${user.role} login successful`);

    
      navigate("/dashboard");

      return;
    }

    setError("Invalid email, password, or role");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>HRMS Login</h1>
        <p>Human Resource Management System</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <br />
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <br />

          <div>
            <label>Password</label>
            <br />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <br />

          <div>
            <label>Role</label>
            <br />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="HR">HR</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <br />

          {error && <p>{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;