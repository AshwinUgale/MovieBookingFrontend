import { Container } from "react-bootstrap";
import HeroSection from "../components/HeroSection";
import TrendingMovies from "../components/TrendingMovies"
import CallToAction from "../components/CallToAction";
import TrendingEvents from "../components/TrendingEvents";
const HomePage = () => {
  return (
    <>
      {/* Hero Banner */}
      <HeroSection />

      <Container className="text-center mt-5">
        {/* Search Bar */}

        <TrendingEvents/>
  
        {/* Trending Movies */}
        <TrendingMovies />

        

        
       

        {/* Call to Action */}
        <CallToAction />
      </Container>
    </>
  );
};

export default HomePage;
