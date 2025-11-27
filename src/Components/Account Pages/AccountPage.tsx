import React, { useState } from "react";
import api from "../../api";
import "./AccountPage.css";

interface AccountForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AccountPage: React.FC = () => {
  const [form, setForm] = useState<AccountForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
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
      const res = await api.post("/api/account/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      console.log(res.data);
      setStatus("Your account settings have been saved.");
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatus("Could not save your account. Please try again.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="account-page">
      <div className="account-card">
        <div className="account-header">
          <h2>Account Settings</h2>
          <p>Update your profile details and login information.</p>
        </div>

        <form className="account-form" onSubmit={handleSubmit}>
          <div className="account-section">
            <h3>Profile</h3>
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

          <button className="account-save-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          {status && (
            <p
              className={`account-status ${
                statusType === "success" ? "status-success" : "status-error"
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
