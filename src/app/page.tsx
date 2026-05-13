import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import MintSection from "@/components/MintSection";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <MintSection totalMinted={1847} />
      <HowItWorks />
      <Footer />
    </main>
  );
}
