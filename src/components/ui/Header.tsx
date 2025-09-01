'use client';

import Link from 'next/link';

interface Props {
  current: string;
  onChange: (section: string) => void;
}

export default function Header({ current, onChange }: Props) {
  return (
    <header className="header">
      <div className="headerContainer">
        <div className="logo">
          <h2>DevaShip</h2>
          <span className="logoSubtext">Estimation de livraison</span>
        </div>

        <nav className="navigation">
          {['home', 'about', 'features', 'pricing'].map((section) => (
            <button
              key={section}
              className={`navLink ${current === section ? 'active' : ''}`}
              onClick={() => onChange(section)}
            >
              {section === 'home' && 'Accueil'}
              {section === 'about' && 'À propos'}
              {section === 'features' && 'Fonctionnalités'}
              {section === 'pricing' && 'Tarifs'}
            </button>
          ))}
        </nav>

        <div className="headerActions">
          <Link href="/install" className="ctaButton">Installer l'app</Link>
        </div>
      </div>
    </header>
  );
}
