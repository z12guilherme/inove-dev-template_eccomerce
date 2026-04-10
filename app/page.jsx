import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestProducts from "@/components/LatestProducts";
import BestSelling from "@/components/BestSelling";
import OurSpecs from "@/components/OurSpec";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            <Banner />
            <Navbar />
            <Hero />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
            <Footer />
        </>
    );
}