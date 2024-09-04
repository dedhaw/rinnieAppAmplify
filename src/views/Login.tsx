import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import "../styles/forms.css";
import { User, Session } from "@supabase/supabase-js";

type MyAuthResponse = {
  user: User | null;
  session: Session | null;
  error?: any;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInUser(
    email: string,
    password: string
  ): Promise<MyAuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }

    return { user: data.user, session: data.session };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInUser(email, password)
      .then((response) => {
        console.log("Sign-in successful:", response);
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign-in failed:", error.message);
        alert("Your password or email is incorrect");
      });
  };

  return (
    <>
      <Navbar pageType="login" />
      <div className="login-form-container">
        <h1 className="login-heading">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <br />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
