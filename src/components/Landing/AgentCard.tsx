import "../../styles/agentcard.css";
import { ImQuotesLeft } from "react-icons/im";
import { ImQuotesRight } from "react-icons/im";
import { LiaStarSolid } from "react-icons/lia";
import { useState, useEffect } from "react";

interface Agent {
  name: string;
  imageSrc: string;
  testimonial: string;
  right: Boolean;
}

const AgentCard: React.FC<Agent> = ({ name, imageSrc, testimonial, right }) => {
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
    <>
      {viewportWidth >= 921 && (
        <>
          {right === true && (
            <div className="columns">
              <div className="testimonial">
                <h2>
                  {<ImQuotesLeft />} {testimonial}
                  {<ImQuotesRight />}
                  <br />
                  <br />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <br />
                  <br />
                </h2>
              </div>
              <div className="agent">
                <h2>{name}</h2>
                <img src={imageSrc} alt="" />
              </div>
            </div>
          )}
          {right === false && (
            <div className="columns">
              <div className="agent">
                <h2>{name}</h2>
                <img src={imageSrc} alt="" />
              </div>
              <div className="testimonial">
                <h2>
                  {<ImQuotesLeft />} {testimonial}
                  {<ImQuotesRight />}
                  <br />
                  <br />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <LiaStarSolid size={30} />
                  <br />
                  <br />
                </h2>
              </div>
            </div>
          )}
        </>
      )}
      {viewportWidth < 921 && (
        <div>
          <div className="agent">
            <h2>{name}</h2>
            <img src={imageSrc} alt="" />
            <br />
            <div style={{ backgroundColor: "#ffd5ba" }}>
              <br />
              <p>
                {<ImQuotesLeft />} {testimonial}
                {<ImQuotesRight />}
                <br />
                <br />
                <LiaStarSolid size={30} />
                <LiaStarSolid size={30} />
                <LiaStarSolid size={30} />
                <LiaStarSolid size={30} />
                <LiaStarSolid size={30} />
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentCard;
