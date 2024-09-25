import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/forms.css";
import { signIn, signOut } from "@aws-amplify/auth";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useCookies } from "react-cookie";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession, removeSession] = useCookies(["session"]);
  const [cEmail, setCEmail, removeEmail] = useCookies(["email"]);
  const [loading, isLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  session;
  cEmail;

  async function signOutUser(): Promise<void> {
    await signOut();
    removeSession("session");
    removeEmail("email");
    console.log("User signed out successfully");
  }

  async function signInUser(email: string, password: string) {
    isLoading(true);
    const login = await signIn({ username: email, password: password });
    login;
    const cognitoSession = await fetchAuthSession();

    console.log("After getting session");

    setSession("session", cognitoSession.tokens?.idToken?.toString(), {
      path: "/",
      maxAge: 3600,
    });
    setCEmail("email", cognitoSession.tokens?.idToken?.payload.email, {
      path: "/",
      maxAge: 3600,
    });
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
        if (error.message == "There is already a signed in user.") {
          signOutUser()
            .then(() => {
              signInUser(email, password)
                .then((response) => {
                  console.log("Sign-in successful: ", response);
                  navigate("/");
                })
                .catch((error) => {
                  console.error(error);
                  isLoading(false);
                  alert("Your password or email is incorrect");
                });
            })
            .catch((error) => {
              console.error("Sign-out failed:", error.message);
            });
        } else {
          isLoading(false);
          alert("Your password or email is incorrect");
        }
      });
  };

  return (
    <>
      <Navbar pageType="login" />
      {loading === false && (
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
            <div className="login-button-sec">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <Link to={"/login/forgot-password/"}>Forgot Password</Link>
            </div>
          </form>
        </div>
      )}
      {loading === true && (
        <div style={{ margin: "10px auto", textAlign: "center" }}>
          <img className="loading" src="/loading.gif" alt="loading..." />
        </div>
      )}
    </>
  );
};

export default LoginForm;
