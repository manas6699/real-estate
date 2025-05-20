
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/town-square/Herosection';
import PropertyInfoSection from '@/components/town-square/PropertyInfoSection';
import Overview from '@/components/town-square/Overview';
import MagicCard from '@/components/town-square/MagicCard';
import Highlights from '@/components/town-square/Highlights';
import Amenities from '@/components/town-square/Amenities';
import Gallery from '@/components/town-square/Gallery';
import Footer from '@/components/Footer';

import MapView from '@/components/town-square/MapView';
import Form from '@/components/Form';
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm';
import About from '@/components/town-square/About';
import FloorPlans from '@/components/town-square/FloorPlans';
import PaymentPlan from '@/components/town-square/PaymentPlan';




const Home = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
          <Navbar source="Town-square" />
          <HeroSection />
          <PropertyInfoSection />
          <MagicCard />
          <MapView />
          <About />
          <Overview />
          <PaymentPlan />
          <Highlights />
          <Amenities />
          <Gallery />
          <FloorPlans />
          <MobileMagicHiddenForm source="town-square" />
          <Footer phoneNumber="98309 47144" />
        </div>
        <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-white p-4 sm:p-6 sticky top-0 border-l border-gray-300">
          <Form source="town-square" />
        </div>
      </div>
    </>
  );
};

export default Home;
