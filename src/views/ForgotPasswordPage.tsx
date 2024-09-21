import { useState } from "react";
import { Link } from "react-router-dom";
import {
  resetPassword,
  type ResetPasswordOutput,
  confirmResetPassword,
  type ConfirmResetPasswordInput,
} from "aws-amplify/auth";

import Navbar from "../components/Navbar";
import VerificationInput from "../components/VerificationInput";
import "../styles/forms.css";

function FPP() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  async function handleResetPassword(username: string) {
    try {
      const output = await resetPassword({ username });
      handleResetPasswordNextSteps(output);
    } catch (error) {
      console.log(error);
    }
  }

  function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE":
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );
        break;
      case "DONE":
        console.log("Successfully reset password.");
        break;
    }
  }

  async function handleConfirmResetPassword({
    username,
    confirmationCode,
    newPassword,
  }: ConfirmResetPasswordInput) {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
    } catch (error) {
      console.log(error);
    }
  }

  const handleCodeChange = (code: string) => {
    setVerificationCode(code);
    console.log("Verification Code: ", code);
  };

  const prevStep = () => {
    if (step == "password") {
      setStep("email");
    } else if (step == "verify") {
      setStep("password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step == "email") {
      setStep("password");
    } else if (step == "password") {
      if (confirmPassword == password) {
        handleResetPassword(email);
        setStep("verify");
      } else {
        alert("Passwords did not match");
      }
    } else {
      handleConfirmResetPassword({
        username: email,
        confirmationCode: verificationCode,
        newPassword: password,
      });
      setStep("success");
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
