import Navbar from "../Navbar";
import { default as LS } from "../LoadingScreen";

function LoadingScreen() {
  return (
    <>
      <Navbar pageType="none" />
      <div>
        <img
          src="/pu.png"
          style={{
            height: "250px",
            width: "auto",
            display: "flex",
            margin: "100px auto auto auto",
          }}
          alt=""
        />
        <h2>Powered by Rinnie</h2>
        <LS />
      </div>
    </>
  );
}

export default LoadingScreen;
