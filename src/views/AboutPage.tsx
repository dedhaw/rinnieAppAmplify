import Navbar from "../components/Navbar";
import Marque from "../components/About/MarqueeSection";
import AboutMe from "../components/About/AboutMe";
import "../styles/about.css";
import Footer from "../components/Footer";
import MissionSection from "../components/About/MissionSection";

export default function AboutPage() {
  return (
    <div>
      <Navbar pageType="land" />
      <MissionSection />
      <Marque />
      <AboutMe />
      <Footer />
    </div>
  );
}
