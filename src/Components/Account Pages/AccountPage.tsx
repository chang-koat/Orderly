import React, { useState } from "react";
import { registerUser, loginUser, logoutUser } from "../../api";
import "./AccountPage.css";

interface AccountForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginForm {
  username: string;
  password: string;
}

const AccountPage: React.FC = () => {
  // CREATE ACCOUNT FORM
  const [form, setForm] = useState<AccountForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // LOGIN FORM
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false); // for create account
  const [isLoggingIn, setIsLoggingIn] = useState(false);   // for login

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem("authToken")
  );

  // CREATE ACCOUNT HANDLERS
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setStatusType(null);

    if (!form.username || !form.email || !form.password) {
      setStatus("Please fill in all required fields.");
      setStatusType("error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus("Passwords do not match.");
      setStatusType("error");
      return;
    }

    try {
      setIsSubmitting(true);

      await registerUser({
        username: form.username,
        password: form.password,
        email: form.email,
      });

      setStatus("Your account has been created and you are now logged in.");
      setStatusType("success");
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setStatus("Could not create account. Please try again.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  // LOGIN HANDLERS
  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setStatusType(null);

    if (!loginForm.username || !loginForm.password) {
      setStatus("Please enter both username and password.");
      setStatusType("error");
      return;
    }

    try {
      setIsLoggingIn(true);

      await loginUser({
        username: loginForm.username,
        password: loginForm.password,
      });

      setStatus("You are now logged in.");
      setStatusType("success");
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setStatus("Login failed. Check your credentials and try again.");
      setStatusType("error");
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    logoutUser();
    setIsLoggedIn(false);
    setLoginForm({ username: "", password: "" });
    setStatus("You have been logged out.");
    setStatusType("success");
  }

  return (
    <div className="account-page">
      <div className="account-card">
        <div className="account-header">
          <h2>Account Settings</h2>
          <p>Update your profile details and login information.</p>
        </div>

        {/* CREATE ACCOUNT FORM */}
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="account-section">
            <h3>Create Account</h3>
            <div className="form-row">
              <label>
                <span>Username *</span>
                <input
                  name="username"
                  type="text"
                  placeholder="ex: coffee_lover21"
                  value={form.username}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Email *</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="account-section">
            <h3>Security</h3>
            <div className="form-row">
              <label>
                <span>Password *</span>
                <input
                  name="password"
                  type="password"
                  placeholder="New password"
                  value={form.password}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Confirm password *</span>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <button
            className="account-save-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Create Account"}
          </button>
        </form>

        <hr className="account-divider" />

        {/* LOGIN FORM */}
        <form className="account-form" onSubmit={handleLoginSubmit}>
          <div className="account-section">
            <h3>Log In</h3>

            <div className="form-row">
              <label>
                <span>Username</span>
                <input
                  name="username"
                  type="text"
                  placeholder="Your username"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
              </label>
            </div>
          </div>

          <div className="account-actions-row">
            <button
              className="account-save-btn"
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Log In"}
            </button>

            {isLoggedIn && (
              <button
                type="button"
                className="account-logout-btn"
                onClick={handleLogout}
              >
                Log Out
              </button>
            )}
          </div>
        </form>

        {status && (
          <p
            className={`account-status ${
              statusType === "success" ? "status-success" : "status-error"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
