


import Navbar from '@/components/Navbar';
import Hero from '@/components/emami/Hero'
import Info from '@/components/emami/Info'
import MapView from '@/components/emami/MapView'
import MagicCard from '@/components/emami/MagicCard'
import FloorPlans from '@/components/emami/FloorPlans'
import DownloadBrochure from '@/components/emami/DownloadBrochure'
import GalleryEmami from '@/components/emami/GalleryEmami'
import About from '@/components/emami/About'
import Overview from '@/components/emami/Overview'
import PaymentPlan from '@/components/emami/PaymentPlan'
import Footer from '@/components/Footer'
import Form from '@/components/Form'
import MobileMagicHiddenForm from '@/components/MobileMagicHiddenForm'


const Home = () => {
    return (
        
            <div>
                <div className="flex flex-col md:flex-row h-screen">
                    <div className="md:w-3/4 w-full overflow-y-auto scroll-hide md:h-full">
                        <Navbar source="emami"/>
                        <Hero/>
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