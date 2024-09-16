import "../../styles/marque.css";

function Marque() {
  return (
    <>
      <div className="marque-container">
        <div className="marque-text">
          <p>Built by experts from the world leading university</p>
        </div>
        <img
          src="/uw-long.png"
          alt="University of Washington"
          className="logo"
        />
      </div>
    </>
  );
}

export default Marque;
