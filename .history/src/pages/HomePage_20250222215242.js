import { Container } from "react-bootstrap";
import HeroSection from "../components/HeroSection";
import TrendingMovies from "../components/TrendingMovies";
import MovieSearch from "../components/MovieSearch";
import GenreSection from "../components/GenreSection";
import Testimonials from "../components/Testimonials";
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

        {/* Browse by Genre */}
        <GenreSection />

        {/* User Testimonials */}
       

        {/* Call to Action */}
        <CallToAction />
      </Container>
    </>
  );
};

export default HomePage;
