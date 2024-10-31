import { useNavigate } from "react-router-dom";

function Platforms() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 style={{ marginBottom: "0px" }}>Platforms</h1>
      <h3 style={{ marginTop: "0px" }}>You can find us on the app store!</h3>
      <img className="images" src="/ios.png" alt="IOS" />
      <div className="buttons">
        <button className="main-button" onClick={() => navigate("/signup/")}>
          Try out rinnie
        </button>
        <button className="alt-button">Download form the app store</button>
      </div>
    </div>
  );
}

export default Platforms;
