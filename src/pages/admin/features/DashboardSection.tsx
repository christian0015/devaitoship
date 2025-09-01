'use client';

import { useState, useEffect } from 'react';

export default function DashboardSection({ userData }) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingShipments: 0,
    deliveredToday: 0,
    revenue: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupérer les données du dashboard depuis l'API
        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${userData?.apiToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentActivities(data.recentActivities);
        } else {
          // Utiliser des données simulées en cas d'erreur
          setStats({
            totalOrders: 1247,
            pendingShipments: 23,
            deliveredToday: 45,
            revenue: 8250
          });
          
          setRecentActivities([
            { id: 1, type: 'rate_calculated', description: 'Tarif calculé pour commande #1234', time: '2 min ago' },
            { id: 2, type: 'label_created', description: 'Étiquette créée pour commande #1235', time: '5 min ago' },
            { id: 3, type: 'delivery_update', description: 'Colis #1236 en cours de livraison', time: '15 min ago' },
            { id: 4, type: 'rate_calculated', description: 'Tarif calculé pour commande #1237', time: '1 hour ago' }
          ]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchDashboardData();
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="dashboardSection">
        <div className="dashboardSection-loading">
          <div className="dashboardSection-spinner"></div>
          <p>Chargement des données...</p>
        </div>
        <style jsx>{`
          .dashboardSection-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
          }
          .dashboardSection-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--color-border);
            border-top: 4px solid var(--color-accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
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
    <div className="dashboardSection">
      <div className="dashboardSection-header">
        <h1 className="dashboardSection-title">Tableau de bord</h1>
        <p className="dashboardSection-subtitle">
          Bienvenue, {userData?.merchantName || userData?.shopName}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboardSection-stats">
        <div className="dashboardSection-statCard">
          <div className="dashboardSection-statIcon primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="dashboardSection-statContent">
            <h3 className="dashboardSection-statValue">{stats.totalOrders.toLocaleString()}</h3>
            <p className="dashboardSection-statLabel">Total Commandes</p>
          </div>
        </div>

        <div className="dashboardSection-statCard">
          <div className="dashboardSection-statIcon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="dashboardSection-statContent">
            <h3 className="dashboardSection-statValue">{stats.pendingShipments}</h3>
            <p className="dashboardSection-statLabel">En Attente d'Expédition</p>
          </div>
        </div>

        <div className="dashboardSection-statCard">
          <div className="dashboardSection-statIcon success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="dashboardSection-statContent">
            <h3 className="dashboardSection-statValue">{stats.deliveredToday}</h3>
            <p className="dashboardSection-statLabel">Livrés Aujourd'hui</p>
          </div>
        </div>

        <div className="dashboardSection-statCard">
          <div className="dashboardSection-statIcon accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="dashboardSection-statContent">
            <h3 className="dashboardSection-statValue">{stats.revenue.toLocaleString()} €</h3>
            <p className="dashboardSection-statLabel">Chiffre d'Affaires</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboardSection-activity">
        <div className="dashboardSection-activityHeader">
          <h2 className="dashboardSection-activityTitle">Activités Récentes</h2>
        </div>
        <div className="dashboardSection-activityList">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="dashboardSection-activityItem">
              <div className={`dashboardSection-activityIcon ${activity.type}`}>
                {activity.type === 'rate_calculated' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {activity.type === 'label_created' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {activity.type === 'delivery_update' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 8h4l3 3v5h-2m-4-4h2m-6 4v2a2 2 0 0 1-4 0v-2m-4 0a2 2 0 1 1 4 0" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="dashboardSection-activityContent">
                <p className="dashboardSection-activityDescription">{activity.description}</p>
                <span className="dashboardSection-activityTime">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboardSection {
          padding: 0;
        }

        .dashboardSection-header {
          margin-bottom: 2rem;
        }

        .dashboardSection-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-gray-dark);
          margin: 0 0 0.5rem 0;
        }

        .dashboardSection-subtitle {
          color: var(--color-gray-medium);
          font-size: 1.1rem;
          margin: 0;
        }

        .dashboardSection-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .dashboardSection-statCard {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .dashboardSection-statCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .dashboardSection-statIcon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dashboardSection-statIcon.primary {
          background: rgba(0, 123, 255, 0.1);
          color: #007bff;
        }

        .dashboardSection-statIcon.warning {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }

        .dashboardSection-statIcon.success {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .dashboardSection-statIcon.accent {
          background: rgba(0, 208, 132, 0.1);
          color: var(--color-accent);
        }

        .dashboardSection-statContent {
          flex: 1;
        }

        .dashboardSection-statValue {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-gray-dark);
          margin: 0 0 0.25rem 0;
        }

        .dashboardSection-statLabel {
          color: var(--color-gray-medium);
          font-size: 0.95rem;
          margin: 0;
          font-weight: 500;
        }

        .dashboardSection-activity {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .dashboardSection-activityHeader {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .dashboardSection-activityTitle {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin: 0;
        }

        .dashboardSection-activityList {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .dashboardSection-activityItem {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          transition: background-color 0.2s;
        }

        .dashboardSection-activityItem:hover {
          background: var(--color-gray-light);
        }

        .dashboardSection-activityIcon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dashboardSection-activityIcon.rate_calculated {
          background: rgba(0, 208, 132, 0.1);
          color: var(--color-accent);
        }

        .dashboardSection-activityIcon.label_created {
          background: rgba(0, 123, 255, 0.1);
          color: #007bff;
        }

        .dashboardSection-activityIcon.delivery_update {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .dashboardSection-activityContent {
          flex: 1;
        }

        .dashboardSection-activityDescription {
          font-weight: 500;
          color: var(--color-gray-dark);
          margin: 0 0 0.25rem 0;
        }

        .dashboardSection-activityTime {
          color: var(--color-gray-medium);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .dashboardSection-stats {
            grid-template-columns: 1fr;
          }

          .dashboardSection-statCard {
            padding: 1.5rem;
          }

          .dashboardSection-activity {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}