import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  return (
    <>
      <Navbar pageType="land" />
      <iframe
        src="https://calendly.com/devdhawan2004/30min"
        style={{
          width: "100vw",
          height: "100vh",
          border: "none",
          backgroundColor: "white",
        }}
      />
      <Footer></Footer>
    </>
  );
}

export default Contact;
