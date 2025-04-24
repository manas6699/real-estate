


import Navbar from '@/components/Navbar';
import Hero from '@/components/emami/Hero'
import Info from '@/components/emami/Info'
import MapView from '@/components/emami/MapView'
import MagicCard from '@/components/emami/MagicCard'
import Gallery from '@/components/emami/Gallery'
import DownloadBrochure from '@/components/emami/DownloadBrochure'
import Footer from '@/components/Footer'




const Home = () => {
    return (
        <>
            <div>
                <Navbar source="emami"/>
                <Hero/>
                <Info/>
                <MapView/>
                <MagicCard/>
                <DownloadBrochure/>
                <Gallery/>
                <Footer/>
            </div>
        </>
    )
}

export default Home