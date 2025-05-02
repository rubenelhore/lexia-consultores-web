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
    // Optionally scroll to the new section
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to potentially go back to landing (if needed later)
  // const goToLanding = () => {
  //   setCurrentView('landing');
  //   setCurrentUserData(null);
  // };

  return (
    <div className="App">
      {/* Restore original Header usage */}
      <Header onStartConsultation={startConsultation} />
      <main>
        {currentView === 'landing' && (
          <>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <ContactSection />
          </>
        )}

        {currentView === 'consultation' && currentUserData && (
          <LexiaConsultorVirtual userData={currentUserData} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
