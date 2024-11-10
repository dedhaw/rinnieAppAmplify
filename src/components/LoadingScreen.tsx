function LoadingScreen() {
  return (
    <div
      className="no-border"
      style={{
        justifyContent: "center",
        margin: "auto",
        display: "flex",
      }}
    >
      <img className="loading" src="/loading.gif" alt="loading..." />
    </div>
  );
}

export default LoadingScreen;
