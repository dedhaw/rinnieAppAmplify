import Navbar from "../components/Navbar";
import { useState, useRef } from "react";
import "../styles/forms.css";
import ConfettiAnimation from "../components/ConfettiAnimation";
import SignatureBox from "../components/SignatureBox";
import { signUp } from "@aws-amplify/auth";

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

  const [error, setError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/create/`,
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
      } else {
        console.error("Failed to create broker");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp({
        username: email,
        password: password,
      });
    } catch (error) {
      setError(true);
      setSuccessMessage("An unexpected error occurred. Please try again.");
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

          handleSignUp();

          if (error == true) {
            alert(successMessage);
          } else if (error == false) {
            createUser();
            console.log(error);
            setStep("success");
            triggerConfetti();
          }
        } else {
          alert("Passwords did not match");
        }
      } else {
        alert("Please fill out all fields.");
      }
    }
  };

  const prevStep = () => {
    if (step === "agent") {
      setStep("user");
    } else {
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
              {/* <div>
                <img src={signatureData} />
                {console.log(signatureData)}
              </div> */}
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
          {step === "success" && (
            <>
              <ConfettiAnimation run={showConfetti} />
              <p style={{ textAlign: "center" }}>{successMessage}</p>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default SignupForm;
