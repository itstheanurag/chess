import HeroSection from "./HeroSection";
import OngoingGames from "./OngoingGames";
import PastGames from "./PastGames";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import FeaturesSection from "./Features";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center h-full border-2">
      <HeroSection />
      <FeaturesSection />
      <OngoingGames />
      <PastGames />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Home;
