import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestProducts from "@/components/LatestProducts";
import BestSelling from "@/components/BestSelling";
import OurSpecs from "@/components/OurSpec";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata = {
    title: "INOVE-DEV | Inovação e Tecnologia",
    description: "Sua loja de eletrônicos, casa inteligente e gadgets de ponta. Os melhores produtos com entrega rápida e pagamento seguro.",
    openGraph: {
        title: "INOVE-DEV | Inovação e Tecnologia",
        description: "Sua loja de eletrônicos, casa inteligente e gadgets de ponta. Os melhores produtos com entrega rápida e pagamento seguro.",
        type: "website",
        locale: "pt_BR",
        siteName: "INOVE-DEV"
    }
};

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