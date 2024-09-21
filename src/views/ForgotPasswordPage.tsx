import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import VerificationInput from "../components/VerificationInput";
import "../styles/forms.css";

function FPP() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleCodeChange = (code: string) => {
    setVerificationCode(code);
    console.log("Verification Code: ", code);
  };

  const prevStep = () => {
    if (step == "verify") {
      setStep("email");
    } else if (step == "password") {
      setStep("verify");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step == "email") {
      setStep("verify");
    } else if (step == "verify") {
      setStep("password");
    } else {
      if (confirmPassword == password) {
        setStep("success");
      } else {
        alert("Passwords did not match");
      }
    }
  };

  return (
    <div>
      <Navbar pageType="login" />

      <div className="login-form-container">
        <h1 className="login-heading">Reset Password</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          {step != "success" && (
            <>
              {step === "email" && (
                <div className="form-group">
                  <p>Enter your email to get a verification code.</p>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
              )}
              {step === "verify" && (
                <>
                  <p>
                    An email was sent to you containing a six digit code. Please
                    Enter it below!
                  </p>
                  <VerificationInput onChangeCode={handleCodeChange} />
                </>
              )}
              {step == "password" && (
                <>
                  <p>Enter your new password here</p>
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
                  <div className="form-group">
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </>
              )}
              <div className="button-container">
                {step != "email" && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => prevStep()}
                  >
                    Back
                  </button>
                )}
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </>
          )}
          {step === "success" && (
            <>
              <div style={{ textAlign: "center" }}>
                <p>Successfully changed your password.</p>
                <Link to={"/login/"} className="click-l">
                  Click here to login
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default FPP;
