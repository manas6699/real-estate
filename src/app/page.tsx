import Footer from "@/components/Footer";
import Hero from "@/components/Home/Hero";
import Team from "@/components/Home/Team";
import Explore from "@/components/Home/Explore";
import Navbar from "@/components/Home/Navbar";
import Developer from "@/components/Home/Developer";
import ChooseUs from "@/components/Home/ChooseUs";
import StatsSection from "@/components/Home/StatsSection";
// import RecentProperties from "@/components/Home/RecentProperties";

const Home = () => {


  return (
    <>
      <Navbar source="home-mmr" />
      <Hero />
      <Explore />
      <StatsSection />
      {/* <RecentProperties /> */}
      <Developer />
      <ChooseUs />
      <Team />
      <Footer phoneNumber="7439514475" />
    </>
  );
};

export default Home;
