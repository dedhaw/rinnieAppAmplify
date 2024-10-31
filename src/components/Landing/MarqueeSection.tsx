import "../../styles/marque.css";
import Marquee from "react-fast-marquee";

function Marque() {
  return (
    <>
      <div className="marque-container">
        <div className="marque-text">
          <p>Used and trusted by agents from these brokerages</p>
        </div>
        <div className="marque-images">
          <br />
          <Marquee>
            <img src="/kw_logo.png" alt="KW Eastside" />
            <img src="/eXp-Realty-logo.png" alt="EXP Realty" />
            <img src="/kw_t.png" alt="KW Tacoma" />
            <img src="/dulay_logo.png" alt="Dulay Homes" />
          </Marquee>
        </div>
      </div>
    </>
  );
}

export default Marque;
