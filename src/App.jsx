import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import Memories from './components/Memories';
import Footer from './components/Footer';
import Convite from './components/Convite';
import BackgroundMusic from './components/BackgroundMusic';
import GiftListPage from './pages/GiftListPage';
import ConviteV2 from './pages/ConviteV2';
import LoginPage from './pages/Admin/LoginPage';
import Dashboard from './pages/Admin/Dashboard';
import HomeEntryLoader from './components/HomeEntryLoader';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomeEntryLoader>
            <div className="min-h-screen overflow-x-hidden">
              <Hero />
              <About />
              <Story />
              <Memories />
              <Footer />
            </div>
          </HomeEntryLoader>
        } />
        <Route path="/convite" element={<Convite />} />
        <Route path="/convite-v2" element={<ConviteV2 />} />
        <Route path="/presentes" element={<GiftListPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Player de música de fundo - renderizado fora das rotas para persistir entre navegações */}
      <BackgroundMusic audioSrc="/background-music.mp3" />
    </Router>
  );
}

export default App;

