'use client';

interface AdminSidebarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  sidebarOpen: boolean;
}

export default function AdminSidebar({ currentSection, setCurrentSection, sidebarOpen }: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'getRates',
      label: 'Estimation Tarifs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'integration',
      label: 'Intégration',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2v20M2 12h20" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'checkTrack',
      label: 'Suivi Colis',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <aside className={`sidebarSection ${sidebarOpen ? 'open' : 'closed'}`}>
      <nav className="sidebarSection-nav">
        <ul className="sidebarSection-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebarSection-menuItem">
              <button
                onClick={() => setCurrentSection(item.id)}
                className={`sidebarSection-menuButton ${
                  currentSection === item.id ? 'active' : ''
                }`}
              >
                <span className="sidebarSection-icon">{item.icon}</span>
                <span className="sidebarSection-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .sidebarSection {
          width: 250px;
          background: white;
          border-right: 1px solid var(--color-border);
          position: fixed;
          left: 0;
          top: 70px;
          height: calc(100vh - 70px);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 999;
          overflow-y: auto;
        }

        .sidebarSection.open {
          transform: translateX(0);
        }

        .sidebarSection-nav {
          padding: 2rem 0;
        }

        .sidebarSection-menu {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sidebarSection-menuItem {
          margin: 0;
        }

        .sidebarSection-menuButton {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 2rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-gray-medium);
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: left;
          border-left: 3px solid transparent;
        }

        .sidebarSection-menuButton:hover {
          background: var(--color-gray-light);
          color: var(--color-gray-dark);
        }

        .sidebarSection-menuButton.active {
          background: rgba(0, 208, 132, 0.1);
          color: var(--color-accent);
          border-left-color: var(--color-accent);
        }

        .sidebarSection-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebarSection-label {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .sidebarSection {
            width: 280px;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </aside>
  );
}