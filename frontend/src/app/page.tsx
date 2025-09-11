"use client";

import { Colors } from "./styles/colors";
import Footer from "./components/Homepage/Footer";
import Working from "./components/Homepage/Working";
import FeaturesSection from "./components/Homepage/FeaturesSection";
import HeroSection from "./components/Homepage/HeroSection";

export default function Home() {
  return (
    <div
      className="min-h-screen scroll-smooth"
      style={{
        backgroundColor: Colors.background.light,
        color: Colors.text.dark,
      }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Features */}
      <FeaturesSection />

      {/* How it Works */}
      <Working />

      {/* Footer */}
      <Footer />
    </div>
  );
}
