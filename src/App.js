import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Header from './components/Header/Header';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import BackToTop from './components/BackToTop/BackToTop';
import Entry from './components/Entry/Entry';
import Home from './pages/Home/Home';
import Portfolio from './pages/Portfolio/Portfolio';
import About from './pages/About/About';
import Admin from './pages/Admin/Admin';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="App">
            <ScrollProgress />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Entry />} />
                <Route path="/home" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Entry />} />
              </Routes>
            </main>
            <Footer />
            <BackToTop />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;