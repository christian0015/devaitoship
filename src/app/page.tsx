'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

import HomeSection from '@/components/sections/HomeSection';
import AboutSection from '@/components/sections/AboutSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import PricingSection from '@/components/sections/PricingSection';
import InstallerSection from '@/components/sections/InstallerSection';
import LoginForm from '@/components/sections/LoginForm';

export default function Home() {
  const [currentSection, setCurrentSection] = useState('home');
  
  
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   useEffect(() => {
    // Vérifier si un utilisateur est connecté au chargement de la page
    const merchantData = localStorage.getItem('merchant');
    // alert(merchantData)
    setIsLoggedIn(!!merchantData);
  }, []);
  const handleLoginClick = () => {
    if (isLoggedIn) {
      // Rediriger directement vers l'admin si déjà connecté
      router.push("/admin");
    } else {
      // Afficher le formulaire de connexion
      // setShowLogin(true);
      setCurrentSection('loginForm')
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return <HomeSection />;
      case 'about':
        return <AboutSection />;
      case 'features':
        return <FeaturesSection />;
      case 'pricing':
        return <PricingSection />;
      case 'installer':
        return <InstallerSection />;
      case 'loginForm':
        return <LoginForm />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="appContainer">
      {/* Header */}
      <header className="header">
        <div className="headerContainer">
          <div className="logo">
            <h2>DevaShip</h2>
            <span className="logoSubtext">Estimation de livraison</span>
          </div>
          
          <nav className="navigation">
            <button 
              className={`navLink ${currentSection === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentSection('home')}
            >
              Accueil
            </button>
            <button 
              className={`navLink ${currentSection === 'about' ? 'active' : ''}`}
              onClick={() => setCurrentSection('about')}
            >
              À propos
            </button>
            <button 
              className={`navLink ${currentSection === 'features' ? 'active' : ''}`}
              onClick={() => setCurrentSection('features')}
            >
              Fonctionnalités
            </button>
            <button 
              className={`navLink ${currentSection === 'pricing' ? 'active' : ''}`}
              onClick={() => setCurrentSection('pricing')}
            >
              Tarifs
            </button>
          </nav>

          <div className="headerActions">
            <button 
            // href="/install"  className="ctaButton"
            className={`navLink ${currentSection === 'installer' ? 'active' : ''}`}
            onClick={() => setCurrentSection('installer')}
            >
              Installer l'app
            </button>

            <button 
            // href="/install"  className="ctaButton"
            className={`navLink p-2  ml-8 ${currentSection === 'loginForm' ? 'active' : ''}`}
            onClick={() => handleLoginClick()}
            >
              
              {isLoggedIn ? 'Espace Admin' : 'Connexion'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mainContent">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footerContainer">
          <div className="footerSection">
            <h4>DevaShip</h4>
            <p>Solution d'estimation des coûts de livraison pour les marchands Devaito</p>
          </div>
          
          <div className="footerSection">
            <h5>Liens utiles</h5>
            <ul>
              <li><a href="#" onClick={() => setCurrentSection('about')}>À propos</a></li>
              <li><a href="#" onClick={() => setCurrentSection('features')}>Fonctionnalités</a></li>
              <li><Link href="/client">Suivi de commande</Link></li>
            </ul>
          </div>
          
          <div className="footerSection">
            <h5>Support</h5>
            <ul>
              <li><a href="mailto:support@devaship.com">Contact</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footerSection">
            <h5>Partenaires</h5>
            <ul>
              <li>Chippo API</li>
              <li>Devaito Platform</li>
            </ul>
          </div>
        </div>
        
        <div className="footerBottom">
          <p>&copy; 2025 DevaShip. Tous droits réservés.</p>
        </div>
      </footer>

      <style jsx>{`
        /* Variables de couleurs */
        .appContainer {
          --color-primary: #000000;
          --color-secondary: #ffffff;
          --color-accent: #00d084;
          --color-accent-hover: #00b874;
          --color-gray-light: #f8f9fa;
          --color-gray-medium: #6c757d;
          --color-gray-dark: #212529;
          --color-border: #e9ecef;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header Styles */
        .header {
          background: var(--color-secondary);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .headerContainer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo h2 {
          margin: 0;
          color: var(--color-primary);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .logoSubtext {
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          margin-left: 0.5rem;
        }

        .navigation {
          display: flex;
          gap: 2rem;
        }

        .navLink {
          background: none;
          border: none;
          color: var(--color-gray-medium);
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0.5rem 0;
          position: relative;
        }

        .navLink:hover,
        .navLink.active {
          color: var(--color-primary);
        }

        .navLink.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-accent);
        }

        .headerActions .navLink {
          background: var(--color-accent);
          padding: 4px 20px;
          color: var(--color-secondary);
          border-radius: 4px
        }
        .headerActions .navLink.active { background: none; color: var(--color-primaty);}

        .ctaButton {
          background: var(--color-accent);
          color: var(--color-secondary);
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }

        .ctaButton:hover {
          background: var(--color-accent-hover);
        }

        /* Main Content */
        .mainContent {
          flex: 1;
        }

        /* Footer Styles */
        .footer {
          background: var(--color-gray-dark);
          color: var(--color-secondary);
          margin-top: auto;
        }

        .footerContainer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footerSection h4,
        .footerSection h5 {
          margin: 0 0 1rem 0;
          color: var(--color-secondary);
        }

        .footerSection p {
          color: var(--color-gray-medium);
          margin: 0;
          line-height: 1.5;
        }

        .footerSection ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footerSection ul li {
          margin-bottom: 0.5rem;
        }

        .footerSection ul li a {
          color: var(--color-gray-medium);
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .footerSection ul li a:hover {
          color: var(--color-accent);
        }

        .footerBottom {
          border-top: 1px solid #343a40;
          padding: 1.5rem 2rem;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footerBottom p {
          margin: 0;
          color: var(--color-gray-medium);
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .headerContainer {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .navigation {
            gap: 1rem;
          }

          .footerContainer {
            padding: 2rem 1rem 1rem;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}





// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Site from '@/components/Site';

// export default function Page() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Exemple : vérifier dans localStorage (ou API) si le marchand est installé
//     const isInstalled = localStorage.getItem('merchant_installed');

//     if (isInstalled) {
//       router.replace('/admin'); // redirige vers la page admin.tsx
//     } else {
//       setLoading(false); // autorise l'affichage de Site
//     }
//   }, [router]);

//   if (loading) return <p>Chargement...</p>;

//   return <Site />;
// }
