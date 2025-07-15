import Form from '@/components/Form'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar';
import Info from '@/components/emami/Info'
import Hero from '@/components/emami/Hero'
import About from '@/components/emami/About'
import Amenities from '@/components/Amenities';


import PopupForm from '@/components/PopupForm';
import Overview from '@/components/emami/Overview'
import MapView from '@/components/emami/MapView'
import FloorPlans from '@/components/emami/FloorPlans'
import MagicCard from '@/components/emami/MagicCard'


import PaymentPlan from '@/components/emami/PaymentPlan'
import GalleryEmami from '@/components/emami/GalleryEmami'
import StickyButtonsRight from '@/components/StickyButtonsRight';
import DownloadBrochure from '@/components/emami/DownloadBrochure'
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm'


const Home = () => {
    return (
            <>
                <div className="flex flex-col md:flex-row h-screen">
                    <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
                    <div className='lg:hidden block'>
                                  <PopupForm source='emami'  
                                            formHeading="Book a Site Visit" 
                                            logoImage='/assets/emami/emami-logo-2.png'
                                  />
                    </div>
                        <Navbar source="emami"/>
                        <Hero/>
                        <StickyButtonsRight />
                        <Info/>
                        <MagicCard/>
                        <PaymentPlan/>
                        <MapView/>
                        <About/>
                        <Amenities
            amenities={[
              '/assets/amenities/20.png',
              '/assets/amenities/21.png',
              '/assets/amenities/22.png',
              '/assets/amenities/23.png',
              '/assets/amenities/24.png',
              '/assets/amenities/25.png',
              '/assets/amenities/26.png',
              '/assets/amenities/27.png',
            ]}
          />
                        <Overview/>
                        <DownloadBrochure/>
                        <GalleryEmami/>
                        <FloorPlans/>
                        <MobileMagicHiddenForm source="emami"/>
                        <Footer phoneNumber="98309 47144" />
                    </div>
                    <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen  p-4 sm:p-6 sticky top-0 border-l border-gray-300">
                            <Form source="emami"/>
                    </div>
                </div>
            </>
    )
}

export default Home