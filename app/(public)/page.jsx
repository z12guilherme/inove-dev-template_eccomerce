'use client'
import { useState, useEffect } from "react";
import { dbAdapter } from "../../dbAdapter";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";

const COMPONENT_MAP = {
    hero: <Hero key="hero" />,
    latest_products: <LatestProducts key="latest_products" />,
    best_selling: <BestSelling key="best_selling" />,
    our_specs: <OurSpecs key="our_specs" />,
    newsletter: <Newsletter key="newsletter" />
};

export default function Home() {
    const [layout, setLayout] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLayout = async () => {
            const layoutData = await dbAdapter.getHomeLayout();
            const sorted = [...layoutData].sort((a, b) => a.order - b.order);
            setLayout(sorted);
            setLoading(false);
        };
        fetchLayout();
    }, []);

    if (loading) return <div className="min-h-[70vh] flex items-center justify-center p-12 text-slate-400">Carregando loja...</div>;

    return (
        <div>
            {layout.filter(block => block.visible).map(block => COMPONENT_MAP[block.id])}
        </div>
    );
}
