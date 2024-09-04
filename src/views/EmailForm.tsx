import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { MdEmail } from "react-icons/md";
import "../styles/forms.css";
interface props {
  session: any;
}

function EmailForm({ session }: props) {
  session;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submited, setSubmit] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setMessage("Email was sent to the buyer!");
      setSubmit(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };
  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar pageType="protected" />
      <h1>
        Email Buyer <MdEmail color="#ff7a29" />
      </h1>
      <section>
        {submited === false && (
          <form onSubmit={handleSubmit}>
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
            <div className="no-border">
              <button className="cancel-button" onClick={goHome}>
                Back
              </button>
              <button type="submit" className="submit-button">
                Send Email
              </button>
            </div>
          </form>
        )}
        <p>{message}</p>
      </section>
    </>
  );
}

export default EmailForm;
