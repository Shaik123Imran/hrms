import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

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

      // Store user in AuthContext
      login(user);

      // Store user in cookie
      document.cookie = `loggedInUser=${encodeURIComponent(
        JSON.stringify(user)
      )}; max-age=3600; path=/`;

      // Go to the common dashboard
      navigate("/dashboard");

      return;
    }

    setError("Invalid email, password, or role");
  };

  return (
    <div className="page-container">
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          title="HRMS Login"
          subtitle="Human Resource Management System"
          className="w-full max-w-md"
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">

              <Input
                label="Email"
                type="email"
                placeholder="Enter email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div>
                <label className="field-label">Role</label>

                <select
                  className="field-input"
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

              {error && (
                <p className="text-error">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full">
                Login
              </Button>

            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Login;