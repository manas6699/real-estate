


import Navbar from '@/components/Navbar';
import Hero from '@/components/emami/Hero'
import Info from '@/components/emami/Info'
import MapView from '@/components/emami/MapView'
import MagicCard from '@/components/emami/MagicCard'
import Gallery from '@/components/emami/Gallery'
import DownloadBrochure from '@/components/emami/DownloadBrochure'
import Footer from '@/components/Footer'


export const metadata = {
  title: "Emami",
  description: "Emami Real Estate Projec Estate Projec Estate Projec Estate Projec Estate Projec Estate Projec Estate Project",
  verification: {
    google: 'Xy7W7IIbzhmM1foAbu7RHD7ZtvREjPomdnBe1dK467w', // Just the code, not full meta tag
  },
};


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