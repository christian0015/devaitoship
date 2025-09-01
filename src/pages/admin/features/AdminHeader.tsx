'use client';


import { useState } from 'react';
export default function AdminHeader({ sidebarOpen, setSidebarOpen, userData, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="adminHeader">
      <div className="adminHeader-left">
        <button 
          className="adminHeader-menuToggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="adminHeader-logo">
          <h1>DevaShip</h1>
          {/* <span>Admin</span> */}
        </div>
      </div>
      
      <div className="adminHeader-right">
        <div className="adminHeader-userMenu">
          <button 
            className="adminHeader-userButton"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <span className="adminHeader-userName">
              {userData?.merchantName || userData?.shopName || 'Utilisateur'}
            </span>
            <div className="adminHeader-userAvatar">
              {userData?.merchantName?.[0] || userData?.shopName?.[0] || 'U'}
            </div>
          </button>
          
          {userMenuOpen && (
            <div className="adminHeader-dropdown">
              <button 
                className="adminHeader-dropdownItem"
                onClick={() => {
                  setUserMenuOpen(false);
                  // Redirection vers la section profil
                  window.location.href = '/admin#profile';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mon profil
              </button>
              <button 
                className="adminHeader-dropdownItem"
                onClick={onLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .adminHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
          height: 70px;
          background: white;
          box-shadow: 3px 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 100;
        }

        .adminHeader-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .adminHeader-menuToggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          color: var(--color-gray-dark);
          transition: background-color 0.2s;
        }

        .adminHeader-menuToggle:hover {
          background: var(--color-gray-light);
        }

        .adminHeader-logo {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .adminHeader-logo h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
        }

        .adminHeader-logo span {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
        }

        .adminHeader-right {
          display: flex;
          align-items: center;
        }

        .adminHeader-userMenu {
          position: relative;
        }

        .adminHeader-userButton {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .adminHeader-userButton:hover {
          background: var(--color-gray-light);
        }

        .adminHeader-userName {
          font-weight: 500;
          color: var(--color-gray-dark);
        }

        .adminHeader-userAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .adminHeader-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 0.5rem;
          min-width: 200px;
          z-index: 101;
          margin-top: 0.5rem;
        }

        .adminHeader-dropdownItem {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          transition: background-color 0.2s;
          color: var(--color-gray-dark);
        }

        .adminHeader-dropdownItem:hover {
          background: var(--color-gray-light);
        }

        @media (max-width: 768px) {
          .adminHeader {
            padding: 0 1rem;
          }
          
          .adminHeader-userName {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}