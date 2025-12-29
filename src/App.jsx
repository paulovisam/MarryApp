import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import Memories from './components/Memories';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Story />
      <Memories />
      <Footer />
    </div>
  );
}

export default App;

