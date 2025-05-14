import Footer from "@/components/Footer";
import ChooseUs from "@/components/Home/ChooseUs";
import Explore from "@/components/Home/Explore";
import Hero from "@/components/Home/Hero";
import Navbar from "@/components/Home/Navbar";
import RecentProperties from "@/components/Home/RecentProperties";
import StatsSection from "@/components/Home/StatsSection";
import Team from "@/components/Home/Team";

const Home = () => {
  

  return (
    <>
      <Navbar source="home-mmr"/>
     <Hero/>
      <Explore/>
      <StatsSection/>
      <RecentProperties/>
      <ChooseUs/>
      <Team/>
      <Footer/>
    </>
  );
};

export default Home;
