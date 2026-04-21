import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import Memories from './components/Memories';
import PreweddingGallery from './components/PreweddingGallery';
import Footer from './components/Footer';
import Convite from './components/Convite';
// import BackgroundMusic from './components/BackgroundMusic';
import GiftListPage from './pages/GiftListPage';
// import ConviteV2 from './pages/ConviteV2';
import LoginPage from './pages/Admin/LoginPage';
import Dashboard from './pages/Admin/Dashboard';
import HomeEntryLoader from './components/HomeEntryLoader';
import SmoothScroll from './components/SmoothScroll';
// import AppV2 from './v2/App';

function App() {
  return (
    <Router>
      <SmoothScroll>
        <Routes>
        <Route path="/" element={
          <HomeEntryLoader>
            <div className="min-h-screen overflow-x-hidden">
              <Hero />
              <About />
              <Story />
              <PreweddingGallery />
              {/* <Memories /> */}
              <Footer />
            </div>
          </HomeEntryLoader>
        } />
        <Route path="/convite" element={<Convite />} />
        {/* <Route path="/convite-v2" element={<ConviteV2 />} /> */}
        <Route path="/presentes" element={<GiftListPage />} />
        {/* <Route path="/v2" element={<AppV2 />} /> */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SmoothScroll>
      {/* Player de música de fundo - renderizado fora das rotas para persistir entre navegações */}
    </Router>
  );
}

export default App;

