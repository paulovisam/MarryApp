import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import Memories from './components/Memories';
import Footer from './components/Footer';
import Convite from './components/Convite';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen overflow-x-hidden">
            <Hero />
            <About />
            <Story />
            <Memories />
            <Footer />
          </div>
        } />
        <Route path="/convite" element={<Convite />} />
      </Routes>
    </Router>
  );
}

export default App;

