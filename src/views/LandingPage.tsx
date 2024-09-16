import Navbar from "../components/Navbar";
import Hero from "../components/Landing/HeroSection";
import Marque from "../components/Landing/MarqueSection";
import HIW from "../components/Landing/HowItWorks";
// import Pricing from "../components/Landing/Pricing";
import Footer from "../components/Footer";
// import Agents from "../components/Landing/Testimonials";

function Landing() {
  return (
    <>
      <Navbar pageType="land" />
      <Hero />
      <Marque />
      <HIW />
      {/* <Agents /> */}
      {/* <Pricing /> */}
      <Footer />
    </>
  );
}

export default Landing;
