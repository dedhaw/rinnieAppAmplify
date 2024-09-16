import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MdEmail } from "react-icons/md";
import { checkDocEditable } from "../utils/Secure";
import { useCookies } from "react-cookie";
import "../styles/forms.css";

function EmailForm() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [session] = useCookies(["session"]);

  const [email, setEmail] = useState("");
  const [submited, setSubmit] = useState(false);
  const [message, setMessage] = useState("");

  const id = queryParams.get("id") || "";
  if (id == "") {
    navigate("/page-not-found");
  }

  useEffect(() => {
    const check = async () => {
      const data = await checkDocEditable(id);
      if (data == false) {
        navigate("/page-not-found");
      }
    };

    check();
  });

  const sendLink = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/send-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({ document_id: id, email: email }),
        }
      );

      if (response.ok) {
        console.log("Form archived");
        window.location.reload();
      } else {
        console.error("Failed to archive form");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      sendLink(id);
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
