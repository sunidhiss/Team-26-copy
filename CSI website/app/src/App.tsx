import { FloatingStars } from './components/FloatingStars';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { useEffect, useState } from 'react';
import { Hero } from './sections/Hero';
import { AboutUs } from './sections/AboutUs';
import { HowItWorks } from './sections/HowItWorks';
import { TrustSection } from './sections/TrustSection';
import { ChooseBuddy } from './sections/ChooseBuddy';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen bg-space-900 home-page-fade-in">
      {/* Floating stars background */}
      <FloatingStars />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <AboutUs />
        <HowItWorks />
        <TrustSection />
        <ChooseBuddy />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
