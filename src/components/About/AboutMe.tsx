import "../../styles/agentcard.css";
import "../../styles/about.css";
import "../../styles/hero.css";
import { useNavigate } from "react-router-dom";

function AboutMe() {
  const navigate = useNavigate();

  return (
    <section style={{ margin: "40px auto" }} className="columns">
      <div className="about-me-col no-border">
        <p style={{ textAlign: "left", width: "100%" }}>
          Hi, <span style={{ fontSize: "30px" }}>I'm Dev</span> and I am the
          lead developer of Rinnie Ai. Rinnie Ai started as a small project
          solving a simple problem, making my mom, a real estate agent, more
          efficient. I started by making it much easier for her to get the buyer
          brokerage service agreement form, making it easier to close on leads.
          Now, I have built it out for more agents to use!
        </p>
        <div className="no-border">
          <button className="button" onClick={() => navigate("/signup/")}>
            See how much time Rinnie can save you
          </button>
          <button
            className="button"
            onClick={() => window.open("http://dev-dhawan.com", "_blank")}
          >
            Learn more about me
          </button>
        </div>
      </div>
      <div
        style={{
          display: "inline",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="no-border"
      >
        <img className="headshot" src="/headshot.png" alt="" />
        <br />
        <br />
        <button
          className="button-type"
          style={{ justifySelf: "center", display: "flex", margin: "auto" }}
          onClick={() => navigate("/contact/")}
        >
          Contact me!
        </button>
      </div>
    </section>
  );
}

export default AboutMe;
