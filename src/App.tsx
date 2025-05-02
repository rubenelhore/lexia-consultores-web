import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LexiaConsultorVirtual from './components/LexiaConsultorVirtual';

// Define or import UserData interface
interface UserData {
  nombre: string;
  email: string;
  telefono: string;
}

// Define possible view states
type AppView = 'landing' | 'consultation';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);

  // Remove dummy function if it exists
  // const dummyStartConsultation = (userData: UserData) => { ... };

  // This function will be passed down to the modal via Header
  const startConsultation = (userData: UserData) => {
    console.log('Starting consultation for:', userData);
    setCurrentUserData(userData);
    setCurrentView('consultation');
    // Scroll to the top when switching to consultation view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to go back to landing view
  const goToLanding = () => {
    setCurrentView('landing');
    setCurrentUserData(null);
    // Scroll to the top when going back to landing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      {/* Pass both functions to Header */}
      <Header 
        onStartConsultation={startConsultation} 
        onGoToLanding={goToLanding} // Pass the new function
      />
      <main>
        {currentView === 'landing' && (
          <>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
          </>
        )}

        {currentView === 'consultation' && currentUserData && (
          <LexiaConsultorVirtual userData={currentUserData} />
        )}

        {/* Always render ContactSection */} 
        <ContactSection />

      </main>
      <Footer />
    </div>
  );
}

export default App;
