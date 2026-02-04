import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import Memories from './components/Memories';
import Footer from './components/Footer';
import Convite from './components/Convite';
import BackgroundMusic from './components/BackgroundMusic';
import GiftListPage from './pages/GiftListPage';
import LoginPage from './pages/Admin/LoginPage';
import Dashboard from './pages/Admin/Dashboard';

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
        <Route path="/presentes" element={<GiftListPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
      {/* Player de música de fundo - renderizado fora das rotas para persistir entre navegações */}
      <BackgroundMusic audioSrc="/background-music.mp3" />
    </Router>
  );
}

export default App;

