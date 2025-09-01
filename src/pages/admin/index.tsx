'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from './features/AdminHeader';
import AdminSidebar from './features/AdminSidebar';
import DashboardSection from './features/DashboardSection';
import GetRatesSection from './features/GetRatesSection';
import CheckTrackSection from './features/CheckTrackSection';
import ProfileSection from './features/ProfileSection';

export default function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const merchantData = localStorage.getItem('merchant');
    if (!merchantData) {
      router.push('/install');
      return;
    }
    
    setUserData(JSON.parse(merchantData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('merchant');
    router.push('/');
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardSection userData={userData} />;
      case 'getRates':
        return <GetRatesSection userData={userData} />;
      case 'checkTrack':
        return <CheckTrackSection userData={userData} />;
      case 'profile':
        return <ProfileSection userData={userData} />;
      default:
        return <DashboardSection userData={userData} />;
    }
  };

  if (!userData) {
    return (
      <div className="adminContainer">
        <div className="loadingState">
          <div className="loadingSpinner"></div>
          <p>Chargement...</p>
        </div>
        <style jsx>{`
          .adminContainer {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-gray-light);
          }
          .loadingState {
            text-align: center;
          }
          .loadingSpinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--color-border);
            border-top: 4px solid var(--color-accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="adminContainer">
      <AdminHeader 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userData={userData}
        onLogout={handleLogout}
      />
      
      <div className="adminLayout">
        <AdminSidebar 
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sidebarOpen={sidebarOpen}
        />
        
        <main className={`adminMain ${sidebarOpen ? 'withSidebar' : 'withoutSidebar'}`}>
          <div className="adminContent">
            {renderContent()}
          </div>
        </main>
      </div>

      <style jsx>{`
        .adminContainer {
          min-height: 100vh;
          background: var(--color-gray-light);
          background: #f6f6f6ff;
          display: flex;
          flex-direction: column;
        }

        .adminLayout {
          display: flex;
          flex: 1;
        }

        .adminMain {
          flex: 1;
          padding: 6rem 2rem;
          transition: margin-left 0.3s ease;
          overflow-x: auto;
        }

        .adminMain.withSidebar {
          margin-left: 250px;
        }

        .adminMain.withoutSidebar {
          margin-left: 0;
        }

        .adminContent {
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .adminMain.withSidebar {
            margin-left: 0;
          }
          
          .adminMain {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}