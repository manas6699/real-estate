import Footer from '@/components/Footer'

import Form from '@/components/Form'
import Navbar from '@/components/Navbar';
import Info from '@/components/emami/Info'
import Hero from '@/components/emami/Hero'
import About from '@/components/emami/About'


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
        
            <div>
                <div className="flex flex-col md:flex-row h-screen">
                    <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
                    <div className='lg:hidden block'>
                                  <PopupForm source='emami'  formHeading="Book a Site Visit" logoImage='/assets/emami/eami-logo.webp'/>
                    </div>
                            
                        <Navbar source="emami"/>
                        <Hero/>
                        <StickyButtonsRight />
                        <Info/>
                        <MagicCard/>
                        <MapView/>
                        <About/>
                        <Overview/>
                        <DownloadBrochure/>
                        <PaymentPlan/>
                        <GalleryEmami/>
                        <FloorPlans/>
                        <MobileMagicHiddenForm source="emami"/>
                        <Footer phoneNumber="98309 47144" />
                    </div>
                    <div className="hidden sm:block sm:w-2/5 md:w-1/4 h-screen bg-white p-4 sm:p-6 sticky top-0 border-l border-gray-300">
                            <Form source="emami"/>
                    </div>
                </div>
            </div>
            
        
    )
}

export default Home