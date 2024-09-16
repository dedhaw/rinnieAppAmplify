import "../../styles/hero.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiHandWavingBold } from "react-icons/pi";
import { scrollToSection } from "../../utils/ScrollToSection";

function Hero() {
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const typingDuration = 4000;
    const delayBeforeFade = 1000;

    const timer = setTimeout(
      () => setIsDone(true),
      typingDuration + delayBeforeFade
    );
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="hero-section">
      {viewportWidth > 767 && (
        <>
          <div className="hero-container">
            <h1 className={isDone ? "done" : ""}>Hello, I'm Rinnie</h1>
          </div>
          <div className="subtext-container">
            <p>And I make forms simple</p>
          </div>
        </>
      )}
      {viewportWidth <= 767 && (
        <>
          <div className="container fade-in-container">
            <h1>
              Hello I'm Rinnie{" "}
              <PiHandWavingBold color="#ff7a29" style={{ zIndex: "200px" }} />
            </h1>

            <p>And I make forms simple</p>
          </div>
        </>
      )}
      <div className="buttons">
        <button className="main-button" onClick={() => navigate("/signup/")}>
          Get Started
        </button>
        <button
          className="alt-button"
          onClick={() => scrollToSection("howitworks")}
        >
          How it works
        </button>
      </div>
    </div>
  );
}

export default Hero;
