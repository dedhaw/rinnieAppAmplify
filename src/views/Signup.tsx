import Navbar from "../components/Navbar";
import { useState, useRef } from "react";
import "../styles/forms.css";
import ConfettiAnimation from "../components/ConfettiAnimation";
import SignatureBox from "../components/SignatureBox";
import { signUp, confirmSignUp } from "@aws-amplify/auth";

import VerificationInput from "../components/VerificationInput";

const SignupForm: React.FC = () => {
  const [step, setStep] = useState("user");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNum, setLN] = useState("");

  const [brokerage, setBrokerage] = useState("");
  const [brokerageNum, setBN] = useState("");
  const [signatureData, setSignatureData] = useState<any | null>(null);
  const signatureRef = useRef<HTMLCanvasElement>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const [verificationCode, setVerificationCode] = useState<string>("");

  const handleCodeChange = (code: string) => {
    setVerificationCode(code);
    console.log("Verification Code: ", code);
  };

  const [error, setError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createUser = async () => {
    try {
      const response = await fetch(
        `https://l9cdcbusi1.execute-api.us-east-1.amazonaws.com/prod/user/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            cell: phone,
            license: licenseNum,
            signature: signatureData,
            brokerage_name: brokerage,
            brokerage_license: brokerageNum,
          }),
        }
      );

      if (response.ok) {
        console.log("Broker Created");
        setError(false);
      } else {
        console.error("Failed to create broker");
        setStep("error");
        setSuccessMessage("This user has already signed up!");
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStep("error");
      setSuccessMessage("An unexpected error occurred. Please try again.");
      setError(true);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await signUp({
        username: email,
        password: password,
      });

      if (response.nextStep.signUpStep == "CONFIRM_SIGN_UP") {
        setStep("verify");
      } else {
        setStep("success");
        setSuccessMessage(
          "Sign-up successful! Please check your email for a confirmation link."
        );
      }
    } catch (error) {
      setError(true);
      console.log("AWS ERROR ", error);
      setStep("error");
      setSuccessMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleVerification = async () => {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });
      setSuccessMessage("Sign-up successful! You can now log in.");
      setStep("success");
      triggerConfetti();
    } catch (error) {
      setError(true);
      console.log("Confirmation error: ", error);
      setSuccessMessage("Invalid code. Please try again.");
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "user") {
      if (firstName && lastName && email && phone) {
        setStep("agent");
      } else {
        alert("Please fill out all fields before proceeding.");
      }
    } else if (step === "agent") {
      if (licenseNum && brokerageNum && signatureRef.current) {
        const canvas = signatureRef.current;
        const signatureImage = canvas.toDataURL("image/png");
        const blankCanvas = document.createElement("canvas");
        blankCanvas.width = canvas.width;
        blankCanvas.height = canvas.height;
        const blankImage = blankCanvas.toDataURL("image/png");

        if (signatureImage == blankImage) {
          alert("Please fill out a signature.");
        } else {
          setSignatureData(signatureImage);
          setStep("password");
        }
      }
    } else if (step === "password") {
      if (password && confirmPassword) {
        if (password == confirmPassword) {
          console.log("First Name:", firstName);
          console.log("Last Name:", lastName);
          console.log("Email:", email);
          console.log("Phone:", phone);

          console.log(signatureData);

          createUser();
          if (error == false) {
            handleSignUp();
          } else {
            console.log("error");
          }
        } else {
          alert("Passwords did not match");
        }
      } else {
        alert("Please fill out all fields.");
      }
    } else if (step === "verify") {
      handleVerification();
    }
  };

  const prevStep = () => {
    if (step === "agent" || step === "verify") {
      setStep("user");
    } else if (step === "password") {
      setStep("agent");
    }
  };

  return (
    <>
      <Navbar pageType="signup" />
      <div className="login-form-container">
        <h1 className="login-heading">Sign Up</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          {step === "user" && (
            <>
              <div className="form-group two-fields">
                <input
                  type="text"
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="form-group">
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
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="licenseNum"
                  value={licenseNum}
                  onChange={(e) => setLN(e.target.value)}
                  placeholder="Your Broker License Number"
                  pattern="[0-9]{1, 20}"
                  inputMode="numeric"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Next
              </button>
            </>
          )}
          {step === "agent" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  id="brokerage"
                  value={brokerage}
                  onChange={(e) => setBrokerage(e.target.value)}
                  placeholder="Your Brokerage's Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="brokerageNum"
                  value={brokerageNum}
                  onChange={(e) => setBN(e.target.value)}
                  placeholder="Brokerage License Number"
                  pattern="[0-9]{1, 20}"
                  inputMode="numeric"
                  required
                />
              </div>
              <SignatureBox ref={signatureRef} />
              <div className="button-container">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => prevStep()}
                >
                  Back
                </button>
                <button type="submit" className="submit-button">
                  Next
                </button>
              </div>
            </>
          )}
          {step === "password" && (
            <>
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
              <div className="button-container">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => prevStep()}
                >
                  Back
                </button>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </>
          )}
          {step === "verify" && (
            <>
              <div>
                <h2>Enter Verification Code</h2>
                <p>
                  An email was sent to you containing a six digit code. Please
                  Enter it below!
                </p>
                <VerificationInput onChangeCode={handleCodeChange} />
                <div className="button-container">
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}
          {step === "success" && (
            <>
              <ConfettiAnimation run={showConfetti} />
              <p style={{ textAlign: "center" }}>{successMessage}</p>
            </>
          )}
          {step === "error" && (
            <>
              <p style={{ textAlign: "center", color: "red" }}>
                {successMessage}
              </p>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default SignupForm;
