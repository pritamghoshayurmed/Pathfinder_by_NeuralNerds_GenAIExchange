import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CallingSection from "@/components/CallingSection";
import FeaturesSection from "@/components/FeaturesSection";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CallingSection />
        <FeaturesSection />
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
