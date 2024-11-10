import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { scrollToSection } from "../utils/ScrollToSection";
import "../styles/footer.css";

interface FooterProps {
  isHomePage?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isHomePage }) => {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePricing = () => {
    if (isHomePage) {
      scrollToSection("pricing");
    } else {
      navigate("/");
    }
  };

  return (
    <footer className="footer">
      <div className="top">
        <div className="content">
          <img
            src="/logo.png"
            alt="Logo"
            className="footer-logo"
            onClick={() => navigate("/")}
          />
          <p style={{ textAlign: "left" }}>
            Rinnie Ai helps agents streamline their workflow by making form
            creation and management easy and simple.
          </p>
        </div>
        <div className="content">
          <h2>Links</h2>
          <Link to="/about/">About</Link>
          <p onClick={handlePricing}>Pricing</p>
          <Link to="/contact/">Contact</Link>
        </div>
        <div className="content">
          <h2>Contact</h2>
          <a href="tel:+14252405586">(425) 240-5586</a>
          <a href="mailto:devdhawan2004@gmail.com">Email us</a>
        </div>
      </div>
      <div className="disclaimer">
        <p>
          Disclaimer: Rinnie ai is currently in beta testing and additional
          features are coming. Thank you for visting our site and{" "}
          <Link to={"/signup/"}>sign up</Link>. Rinnie ai is not responsible for
          stroing forms during our beta phase.
        </p>
      </div>
      <div className="bottom">
        {viewportWidth > 767 && (
          <div className="content">
            <p>
              &copy; {new Date().getFullYear()} Denovia. All rights reserved.
            </p>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            <div className="social">
              <a href="https://www.instagram.com/rinnie.ai/" target="_blank">
                <img src="/iicon.webp" alt="" />
              </a>
              <img src="/licon.png" alt="" />
            </div>
          </div>
        )}
        {viewportWidth <= 767 && (
          <div className="content">
            <p>
              &copy; {new Date().getFullYear()} Denovia. All rights reserved.
            </p>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="https://www.instagram.com/rinnie.ai/" target="_blank">
              <img src="/iicon.webp" alt="" />
            </a>
            <img src="/licon.png" alt="" />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
