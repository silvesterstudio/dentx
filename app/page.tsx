import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import BridgeSection from "@/components/BridgeSection";
import BeforeAfter from "@/components/BeforeAfter";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <BridgeSection />
      <BeforeAfter />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
