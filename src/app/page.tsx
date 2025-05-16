import ChooseUs from "@/components/Home/ChooseUs";
import Explore from "@/components/Home/Explore";
import Developer from "@/components/Home/Developer";
import Hero from "@/components/Home/Hero";
import Navbar from "@/components/Home/Navbar";
import RecentProperties from "@/components/Home/RecentProperties";
import StatsSection from "@/components/Home/StatsSection";
import Team from "@/components/Home/Team";
import Footer from "@/components/Home/Footer";

const Home = () => {
  

  return (
    <>
      <Navbar source="home-mmr"/>
     <Hero/>
      <Explore/>
      <StatsSection/>
      <RecentProperties/>
      <Developer/>
      <ChooseUs/>
      <Team/>
      <Footer/>
    </>
  );
};

export default Home;
