import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import AppearanceProvider from "@/lib/appearanceStore";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Inove Dev. - Shop smarter",
    description: "Inove Dev. - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <AppearanceProvider />
                    <Toaster />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
