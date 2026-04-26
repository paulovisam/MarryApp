import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import ConfirmarPresencaSection from './components/ConfirmarPresencaSection';
import Details from './components/Details';
import PreweddingGallery from './components/PreweddingGallery';
import Footer from './components/Footer';
import Convite from './components/Convite';
import GiftListPage from './pages/GiftListPage';
import LoginPage from './pages/Admin/LoginPage';
import Dashboard from './pages/Admin/Dashboard';
import HomeEntryLoader from './components/HomeEntryLoader';
import SmoothScroll from './components/SmoothScroll';
import { AmbientAudioProvider } from './contexts/AmbientAudioContext';
import AmbientMuteButton from './components/AmbientMuteButton';
import GiftListFab from './components/GiftListFab';

function App() {
  return (
    <Router>
      <AmbientAudioProvider>
      <SmoothScroll>
        <Routes>
        <Route path="/" element={
          <HomeEntryLoader>
            <div className="min-h-screen overflow-x-hidden">
              <Hero />
              <About />
              <Story />
              <Details />
              <ConfirmarPresencaSection />
              <PreweddingGallery />
              <Footer />
            </div>
          </HomeEntryLoader>
        } />
        <Route path="/convite" element={<Convite />} />
        <Route path="/presentes" element={<GiftListPage />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SmoothScroll>
      <AmbientMuteButton />
      <GiftListFab />
      </AmbientAudioProvider>
      {/* Player de música de fundo - renderizado fora das rotas para persistir entre navegações */}
    </Router>
  );
}

export default App;

