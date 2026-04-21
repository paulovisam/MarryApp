import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import Details from './components/Details';
import Footer from './components/Footer';

const AppV2 = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans selection:bg-emerald-900 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Details />
      </main>
      <Footer />
    </div>
  );
};

export default AppV2;
