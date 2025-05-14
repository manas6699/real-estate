import ChooseUs from "@/components/Home/ChooseUs";
import Explore from "@/components/Home/Explore";
import Hero from "@/components/Home/Hero";
import Navbar from "@/components/Home/Navbar";
import RecentProperties from "@/components/Home/RecentProperties";
import StatsSection from "@/components/Home/StatsSection";

const Home = () => {
  

  return (
    <>
      <Navbar source="home-mmr"/>
     <Hero/>
      <Explore/>
      <StatsSection/>
      <RecentProperties/>
      <ChooseUs/>
    </>
  );
};

export default Home;
