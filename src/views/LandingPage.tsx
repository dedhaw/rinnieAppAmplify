import Navbar from "../components/Navbar";
import Hero from "../components/Landing/HeroSection";
import Marque from "../components/Landing/MarqueeSection";
import HIW from "../components/Landing/HowItWorks";
import Pricing from "../components/Landing/Pricing";
import Footer from "../components/Footer";
import Agents from "../components/Landing/Testimonials";
import Platforms from "../components/Landing/Platforms";

function Landing() {
  return (
    <>
      <Navbar pageType="land" isHomePage={true} />
      <Hero />
      <Marque />
      <HIW />
      <Agents />
      <Pricing />
      <Platforms />
      <Footer />
    </>
  );
}

export default Landing;
