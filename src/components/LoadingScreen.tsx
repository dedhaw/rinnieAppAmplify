import "../styles/index.css";

function LoadingScreen() {
  return (
    <div
      className="no-border"
      style={{
        justifyContent: "center",
        margin: "auto !important",
        display: "flex",
      }}
    >
      <img className="loading" src="/loading.gif" alt="loading..." />
    </div>
  );
}

export default LoadingScreen;
