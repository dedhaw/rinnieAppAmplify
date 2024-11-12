import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Navbar from "../FillForm/Navbar";
import "../../styles/forms.css";
import LoadingScreen from "../FillForm/LoadingScreen";

interface PreviewProps {
  setSection: Function;
}

const PreviewPage: React.FC<PreviewProps> = ({ setSection }) => {
  const [session] = useCookies(["session"]);
  const [email] = useCookies(["email"]);

  const [loading, isLoading] = useState(true);

  const [change, setChange] = useState(1);
  const [primaryColor, setPC] = useState("#fe9052");
  const [secondaryColor, setSC] = useState("#ebebeb");
  const [textColor, setTC] = useState("#333");
  const [backgroundColor, setBC] = useState("#fff");

  const [bannerImage, setBanner] = useState<any>(null);
  const [logoImage, setLogo] = useState<any>(null);

  const count = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "One") {
      setChange(1);
    } else if (e.target.value == "Two") {
      setChange(2);
    }
  };

  const getBranding = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/branding/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({ email: email.email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data == false) {
          setPC("#fe9052");
          setSC("#ebebeb");
          setTC("#333");
          setBC("#fff");
        } else {
          setPC(data.primary_color);
          setSC(data.secondary_color);
          setTC(data.text_color);
          setBC(data.background_color);
          setBanner(data.banner);
          setLogo(data.logo);
        }
        isLoading(false);
      } else {
        console.error("Failed to fetch data");
        isLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      isLoading(false);
    }
  };

  useEffect(() => {
    getBranding();
  }, []);

  return (
    <>
      {loading === false && (
        <div style={{ backgroundColor: backgroundColor }}>
          <Navbar
            backgroundColor={backgroundColor}
            secondaryColor={secondaryColor}
            logo={logoImage}
          />
          {bannerImage != null && (
            <>
              <br />
              <img className="banner" src={bannerImage} alt="" />
            </>
          )}
          <h1 style={{ color: textColor }}>Preview</h1>
          <section style={{ borderColor: secondaryColor }}>
            <p style={{ color: textColor }}>Select buttons:</p>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="option"
                  value="One"
                  checked={change === 1}
                  onChange={count}
                  className="radio-input"
                  style={{
                    backgroundColor: change === 1 ? primaryColor : "#fff",
                    border:
                      change === 1
                        ? "11px solid" + primaryColor
                        : "1px solid" + primaryColor,
                  }}
                />
                <span className="radio-label-text" style={{ color: textColor }}>
                  One
                </span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="option"
                  value="Two"
                  checked={change === 2}
                  onChange={count}
                  className="radio-input"
                  style={{
                    backgroundColor: change === 2 ? primaryColor : "#fff",
                    border:
                      change === 2
                        ? "11px solid" + primaryColor
                        : "1px solid" + primaryColor,
                  }}
                />
                <span className="radio-label-text" style={{ color: textColor }}>
                  Two
                </span>
              </label>
            </div>
            <p style={{ color: textColor }}>Buyer One</p>
            <div className="form-group two-fields">
              <input
                type="text"
                id="first-name1"
                placeholder="First Name"
                required
              />
              <input
                type="text"
                id="last-name1"
                placeholder="Last Name"
                required
              />
            </div>
            <div className="form-group">
              <input type="email" id="email1" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input
                type="tel"
                id="phone1"
                placeholder="Phone"
                pattern="[0-9]{10}"
                inputMode="numeric"
                required
              />
            </div>
            <button
              className="next-button"
              style={{
                margin: "auto",
                justifySelf: "center",
                display: "flex",
                backgroundColor: primaryColor,
                border: primaryColor,
              }}
              onClick={() => setSection("branding")}
            >
              Back
            </button>
          </section>
          <br />
        </div>
      )}
      {loading === true && <LoadingScreen />}
    </>
  );
};

export default PreviewPage;
