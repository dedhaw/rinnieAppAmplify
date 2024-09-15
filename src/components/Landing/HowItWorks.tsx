import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaRegHandshake } from "react-icons/fa";
import "../../styles/howitworks.css";

function HIW() {
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

  return (
    <div id="howitworks">
      <br />
      <h1>How It Works</h1>
      {viewportWidth > 1100 && (
        <>
          <div className="col-container" style={{ marginRight: "80px" }}>
            <div className="column">
              <h2>Forms are complicated...</h2>
              <section
                className="left"
                style={{ width: "auto", paddingRight: "20px" }}
              >
                <p>
                  <span>
                    <FaWpforms
                      size={"35px"}
                      color="#333"
                      style={{ marginRight: "10px", marginBottom: "-8px" }}
                    />
                  </span>
                  Rinnie streamlines the process of creating forms. This makes
                  creating and sending a form{" "}
                  <span style={{ color: "#ff914c" }}>fast</span>.
                </p>
                <p>
                  <span>
                    <MdOutlineRealEstateAgent
                      size={"40px"}
                      color="#333"
                      style={{ marginRight: "10px", marginBottom: "-8px" }}
                    />
                  </span>
                  Agents will extremely{" "}
                  <span style={{ color: "#ff914c" }}>efficient</span> using
                  Rinnie. And clients notice!
                </p>
                <p>
                  <span>
                    <FaRegUser
                      size={"35px"}
                      color="#333"
                      style={{ marginRight: "10px", marginBottom: "-8px" }}
                    />{" "}
                    Clients better understand what they are signing and agreeing
                    to.
                  </span>
                </p>
                <p>
                  <span>
                    <FaRegHandshake
                      size={"40px"}
                      color="#333"
                      style={{ marginRight: "10px", marginBottom: "-8px" }}
                    />{" "}
                    Rinnie handles compliance for you, so you don't have to
                    worry about it.
                  </span>
                </p>
              </section>
              <div className="buttons" style={{ marginTop: "-15px" }}>
                <button
                  className="alt-button"
                  onClick={() => navigate("/contact/")}
                >
                  Got more questions?
                </button>
              </div>
            </div>
            <div className="column">
              <img src="/cf.jpeg" alt="" className="form" />
            </div>
          </div>
          <section className="small">
            <h3>
              Turn a <span style={{ color: "#ff914c" }}>20 minute</span> process
              into 1
            </h3>
          </section>
        </>
      )}
      {viewportWidth <= 1100 && (
        <>
          <h2>Forms are complicated...</h2>
          <section className="left">
            <p>
              <span>
                <FaWpforms
                  size={"35px"}
                  color="#333"
                  style={{ marginRight: "10px", marginBottom: "-8px" }}
                />
              </span>
              Rinnie streamlines the process of creating forms. This makes
              creating and sending a form{" "}
              <span style={{ color: "#ff914c" }}>fast</span>.
            </p>
            <p>
              <span>
                <MdOutlineRealEstateAgent
                  size={"40px"}
                  color="#333"
                  style={{ marginRight: "10px", marginBottom: "-8px" }}
                />
              </span>
              Agents will extremely{" "}
              <span style={{ color: "#ff914c" }}>efficient</span> using Rinnie.
              And clients notice!
            </p>
            <p>
              <span>
                <FaRegUser
                  size={"35px"}
                  color="#333"
                  style={{ marginRight: "10px", marginBottom: "-8px" }}
                />{" "}
                Clients better understand what they are signing and agreeing to.
              </span>
            </p>
            <p>
              <span>
                <FaRegHandshake
                  size={"40px"}
                  color="#333"
                  style={{ marginRight: "10px", marginBottom: "-8px" }}
                />{" "}
                Rinnie handles compliance for you, so you don't have to worry
                about it.
              </span>
            </p>
          </section>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src="/cf.jpeg" alt="" className="form" />
          </div>
          <div className="buttons">
            <button className="signup-btn" onClick={() => navigate("/signup/")}>
              Get Started
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default HIW;
