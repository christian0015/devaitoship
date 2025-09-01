'use client';

import { useState } from 'react';

interface TrackingEvent {
  status: string;
  status_details: string;
  location: string;
  date: string;
  time: string;
}

interface TrackingInfo {
  tracking_number: string;
  status: string;
  carrier: string;
  eta: string;
  events: TrackingEvent[];
}

export default function CheckTrackSection({ userData }) {
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setTrackingInfo(null);

    try {
      const response = await fetch('/api/trackPackage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tracking_number: trackingNumber })
      });

      if (!response.ok) {
        throw new Error('Numéro de suivi introuvable');
      }

      const data = await response.json();
      setTrackingInfo(data);
    } catch (err: any) {
      // Simulation de données pour la démo
      
      setError(err.message || 'Erreur lors du suivi, Au moins pour la demo');
   
      setTrackingInfo({
        tracking_number: trackingNumber,
        status: 'IN_TRANSIT',
        carrier: 'Colissimo',
        eta: '2025-08-25',
        events: [
          {
            status: 'PICKED_UP',
            status_details: 'Colis pris en charge',
            location: 'Centre de tri - Paris',
            date: '2025-08-22',
            time: '09:15'
          },
          {
            status: 'IN_TRANSIT',
            status_details: 'En cours d\'acheminement',
            location: 'Centre de tri - Lyon',
            date: '2025-08-22',
            time: '14:30'
          },
          {
            status: 'OUT_FOR_DELIVERY',
            status_details: 'En cours de livraison',
            location: 'Agence de distribution - Marseille',
            date: '2025-08-23',
            time: '08:00'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#28a745';
      case 'OUT_FOR_DELIVERY': return '#ffc107';
      case 'IN_TRANSIT': return '#007bff';
      case 'PICKED_UP': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'Livré';
      case 'OUT_FOR_DELIVERY': return 'En cours de livraison';
      case 'IN_TRANSIT': return 'En transit';
      case 'PICKED_UP': return 'Pris en charge';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="checkTrackSection">
      <div className="checkTrackSection-header">
        <h1 className="checkTrackSection-title">Suivi de Colis</h1>
        <p className="checkTrackSection-subtitle">
          Suivez l'état de vos expéditions en temps réel
        </p>
      </div>

      <div className="checkTrackSection-content">
        <div className="checkTrackSection-search">
          <form onSubmit={handleSubmit} className="checkTrackSection-form">
            <div className="checkTrackSection-inputGroup">
              <input
                type="text"
                placeholder="Entrez votre numéro de suivi"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="checkTrackSection-input"
                required
              />
              <button
                type="submit"
                disabled={loading || !trackingNumber.trim()}
                className="checkTrackSection-button"
              >
                {loading ? (
                  <div className="checkTrackSection-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
                {!loading && 'Suivre'}
              </button>
            </div>
          </form>

          {error && (
            <div className="checkTrackSection-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        {trackingInfo && (
          <div className="checkTrackSection-results">
            <div className="checkTrackSection-summary">
              <div className="checkTrackSection-summaryHeader">
                <h3 className="checkTrackSection-summaryTitle">
                  Suivi: {trackingInfo.tracking_number}
                </h3>
                <div 
                  className="checkTrackSection-status"
                  style={{ color: getStatusColor(trackingInfo.status) }}
                >
                  {getStatusText(trackingInfo.status)}
                </div>
              </div>
              
              <div className="checkTrackSection-summaryDetails">
                <div className="checkTrackSection-detail">
                  <span className="checkTrackSection-detailLabel">Transporteur:</span>
                  <span className="checkTrackSection-detailValue">{trackingInfo.carrier}</span>
                </div>
                <div className="checkTrackSection-detail">
                  <span className="checkTrackSection-detailLabel">Livraison estimée:</span>
                  <span className="checkTrackSection-detailValue">
                    {new Date(trackingInfo.eta).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="checkTrackSection-timeline">
              <h4 className="checkTrackSection-timelineTitle">Historique du suivi</h4>
              <div className="checkTrackSection-events">
                {trackingInfo.events.map((event, index) => (
                  <div key={index} className="checkTrackSection-event">
                    <div className="checkTrackSection-eventDot" 
                         style={{ backgroundColor: getStatusColor(event.status) }}></div>
                    <div className="checkTrackSection-eventContent">
                      <div className="checkTrackSection-eventHeader">
                        <h5 className="checkTrackSection-eventTitle">{event.status_details}</h5>
                        <span className="checkTrackSection-eventTime">
                          {event.date} à {event.time}
                        </span>
                      </div>
                      <p className="checkTrackSection-eventLocation">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="checkTrackSection-map">
              <div className="checkTrackSection-mapPlaceholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p>Carte de suivi interactive</p>
                <small>Fonctionnalité à venir</small>
              </div>
            </div>
          </div>
        )}

        {/* Exemples de numéros de suivi */}
        <div className="checkTrackSection-examples">
          <h4 className="checkTrackSection-examplesTitle">Numéros de test:</h4>
          <div className="checkTrackSection-examplesList">
            <button 
              onClick={() => setTrackingNumber('FR123456789')}
              className="checkTrackSection-exampleButton"
            >
              FR123456789
            </button>
            <button 
              onClick={() => setTrackingNumber('COL987654321')}
              className="checkTrackSection-exampleButton"
            >
              COL987654321
            </button>
            <button 
              onClick={() => setTrackingNumber('DPD456789123')}
              className="checkTrackSection-exampleButton"
            >
              DPD456789123
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkTrackSection {
          padding: 0;
        }

        .checkTrackSection-header {
          margin-bottom: 2rem;
        }

        .checkTrackSection-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-gray-dark);
          margin: 0 0 0.5rem 0;
        }

        .checkTrackSection-subtitle {
          color: var(--color-gray-medium);
          font-size: 1.1rem;
          margin: 0;
        }

        .checkTrackSection-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .checkTrackSection-search {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .checkTrackSection-form {
          margin-bottom: 1rem;
        }

        .checkTrackSection-inputGroup {
          display: flex;
          gap: 1rem;
          align-items: stretch;
        }

        .checkTrackSection-input {
          flex: 1;
          padding: 1rem 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          font-size: 1.1rem;
          transition: all 0.2s ease;
          background: white;
        }

        .checkTrackSection-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(0, 208, 132, 0.1);
        }

        .checkTrackSection-button {
          background: var(--color-accent);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
          justify-content: center;
        }

        .checkTrackSection-button:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
        }

        .checkTrackSection-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .checkTrackSection-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .checkTrackSection-error {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .checkTrackSection-results {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .checkTrackSection-summary {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--color-border);
        }

        .checkTrackSection-summaryHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .checkTrackSection-summaryTitle {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin: 0;
        }

        .checkTrackSection-status {
          font-size: 1.1rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          background: rgba(0, 208, 132, 0.1);
        }

        .checkTrackSection-summaryDetails {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .checkTrackSection-detail {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .checkTrackSection-detailLabel {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
          font-weight: 500;
        }

        .checkTrackSection-detailValue {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .checkTrackSection-timeline {
          margin-bottom: 2rem;
        }

        .checkTrackSection-timelineTitle {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin: 0 0 1.5rem 0;
        }

        .checkTrackSection-events {
          position: relative;
          padding-left: 2rem;
        }

        .checkTrackSection-events::before {
          content: '';
          position: absolute;
          left: 12px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-border);
        }

        .checkTrackSection-event {
          position: relative;
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }

        .checkTrackSection-event:last-child {
          margin-bottom: 0;
        }

        .checkTrackSection-eventDot {
          position: absolute;
          left: -1.75rem;
          top: 0.25rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 0 2px var(--color-border);
        }

        .checkTrackSection-eventContent {
          background: var(--color-gray-light);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .checkTrackSection-eventHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .checkTrackSection-eventTitle {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin: 0;
        }

        .checkTrackSection-eventTime {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
          font-weight: 500;
        }

        .checkTrackSection-eventLocation {
          color: var(--color-gray-medium);
          margin: 0;
        }

        .checkTrackSection-map {
          background: var(--color-gray-light);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
        }

        .checkTrackSection-mapPlaceholder {
          color: var(--color-gray-medium);
        }

        .checkTrackSection-mapPlaceholder svg {
          margin-bottom: 1rem;
        }

        .checkTrackSection-mapPlaceholder p {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .checkTrackSection-mapPlaceholder small {
          font-size: 0.9rem;
        }

        .checkTrackSection-examples {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .checkTrackSection-examplesTitle {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin: 0 0 1rem 0;
        }

        .checkTrackSection-examplesList {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .checkTrackSection-exampleButton {
          background: var(--color-gray-light);
          border: 1px solid var(--color-border);
          color: var(--color-gray-dark);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: monospace;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .checkTrackSection-exampleButton:hover {
          background: var(--color-accent);
          color: white;
          border-color: var(--color-accent);
        }

        @media (max-width: 768px) {
          .checkTrackSection-search,
          .checkTrackSection-results,
          .checkTrackSection-examples {
            padding: 1.5rem;
          }

          .checkTrackSection-inputGroup {
            flex-direction: column;
          }

          .checkTrackSection-summaryHeader {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .checkTrackSection-summaryDetails {
            grid-template-columns: 1fr;
          }

          .checkTrackSection-eventHeader {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}