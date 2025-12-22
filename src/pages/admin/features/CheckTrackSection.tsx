// pages/admin/features/CheckTrackSection.tsx
'use client';

import { useState } from 'react';

interface TrackingEvent {
  date: string;
  description: string;
}

interface TrackingInfo {
  orderId: string;
  trackingNumber: string;
  status: string;
  carrier: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

export default function CheckTrackSection({ userData }) {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation : au moins un champ doit être rempli
    if (!orderId.trim() && !trackingNumber.trim()) {
      setError('Veuillez remplir au moins un des champs');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingInfo(null);

    try {
      const payload = {
        orderId: orderId.trim(),
        trackingNumber: trackingNumber.trim()
      };

      console.log("Appel API avec:", payload);
      
      const response = await fetch('/api/getOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la recherche');
      }

      const data = await response.json();
      console.log("Data reçue:", data);
      
      // Mapper la réponse du backend
      setTrackingInfo({
        orderId: data.orderId,
        trackingNumber: data.trackingNumber || trackingNumber,
        status: data.status,
        carrier: data.carrier || 'Unknown',
        estimatedDelivery: data.estimatedDelivery || '',
        events: data.events || []
      });

    } catch (err: any) {
      setError(err.message || 'Erreur lors du suivi');
      
      // Fallback pour la démo
      if (err.message.includes('404') || err.message.includes('introuvable')) {
        setTrackingInfo({
          orderId: orderId || `CMD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
          trackingNumber: trackingNumber || 'XU032297055EE',
          status: 'transit',
          carrier: 'Chronopost',
          estimatedDelivery: '2025-08-25',
          events: [
            {
              date: '2025-08-22T09:15:00Z',
              description: 'Colis pris en charge'
            },
            {
              date: '2025-08-22T14:30:00Z',
              description: 'En cours d\'acheminement'
            }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setOrderId('');
    setTrackingNumber('');
    setError('');
    setTrackingInfo(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#28a745';
      case 'transit': return '#007bff';
      case 'created': return '#6f42c1';
      case 'purchased': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'transit': return 'En transit';
      case 'created': return 'Créé';
      case 'purchased': return 'Payé';
      case 'error': return 'Erreur';
      default: return 'Inconnu';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="checkTrackSection">
      <div className="checkTrackSection-header">
        <h1 className="checkTrackSection-title">Suivi de Colis</h1>
        <p className="checkTrackSection-subtitle">
          Recherchez par numéro de commande ou numéro de suivi
        </p>
      </div>

      <div className="checkTrackSection-content">
        <div className="checkTrackSection-search">
          <form onSubmit={handleSubmit} className="checkTrackSection-form">
            <div className="checkTrackSection-inputs">
              <div className="checkTrackSection-inputGroup">
                <label className="checkTrackSection-label">
                  <span className="checkTrackSection-labelText">Numéro de commande</span>
                  <input
                    type="text"
                    placeholder="Ex: CMD-2025-001 ou 2025-001"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="checkTrackSection-input"
                  />
                </label>
              </div>
              
              <div className="checkTrackSection-separator">
                <span className="checkTrackSection-separatorText">OU</span>
              </div>
              
              <div className="checkTrackSection-inputGroup">
                <label className="checkTrackSection-label">
                  <span className="checkTrackSection-labelText">Numéro de suivi</span>
                  <input
                    type="text"
                    placeholder="Ex: XU032297055EE ou FR123456789"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="checkTrackSection-input"
                  />
                </label>
              </div>
            </div>
            
            <div className="checkTrackSection-actions">
              <button
                type="submit"
                disabled={loading || (!orderId.trim() && !trackingNumber.trim())}
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
                {!loading && 'Rechercher'}
              </button>
              
              <button
                type="button"
                onClick={clearForm}
                className="checkTrackSection-button secondary"
              >
                Effacer
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
          
          <div className="checkTrackSection-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="8" r="1" fill="currentColor"/>
            </svg>
            <span>Remplissez au moins un des deux champs pour rechercher</span>
          </div>
        </div>

        {trackingInfo && (
          <div className="checkTrackSection-results">
            <div className="checkTrackSection-summary">
              <div className="checkTrackSection-summaryHeader">
                <div>
                  <h3 className="checkTrackSection-summaryTitle">
                    Commande: {trackingInfo.orderId}
                  </h3>
                  <p className="checkTrackSection-summarySubtitle">
                    Suivi: {trackingInfo.trackingNumber}
                  </p>
                </div>
                <div 
                  className="checkTrackSection-status"
                  style={{ 
                    color: getStatusColor(trackingInfo.status),
                    backgroundColor: `${getStatusColor(trackingInfo.status)}15`
                  }}
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
                    {formatDate(trackingInfo.estimatedDelivery)}
                  </span>
                </div>
              </div>
            </div>

            {trackingInfo.events && trackingInfo.events.length > 0 && (
              <div className="checkTrackSection-timeline">
                <h4 className="checkTrackSection-timelineTitle">Historique du suivi</h4>
                <div className="checkTrackSection-events">
                  {trackingInfo.events.map((event, index) => (
                    <div key={index} className="checkTrackSection-event">
                      <div 
                        className="checkTrackSection-eventDot"
                        style={{ backgroundColor: getStatusColor(trackingInfo.status) }}
                      ></div>
                      <div className="checkTrackSection-eventContent">
                        <div className="checkTrackSection-eventHeader">
                          <h5 className="checkTrackSection-eventTitle">{event.description}</h5>
                          <span className="checkTrackSection-eventTime">
                            {formatDate(event.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!trackingInfo.events || trackingInfo.events.length === 0) && (
              <div className="checkTrackSection-noEvents">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="#00D084" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="10" stroke="#00D084" strokeWidth="2"/>
                </svg>
                <p>Aucun événement de suivi disponible pour le moment</p>
                <small>Les mises à jour apparaîtront ici dès que le transporteur les fournira</small>
              </div>
            )}
          </div>
        )}

        {/* Exemples de numéros */}
        <div className="checkTrackSection-examples">
          <h4 className="checkTrackSection-examplesTitle">Exemples à tester:</h4>
          <div className="checkTrackSection-examplesList">
            <div className="checkTrackSection-exampleCategory">
              <span className="checkTrackSection-exampleCategoryLabel">Commandes:</span>
              <button 
                onClick={() => {
                  setOrderId('CMD-2025-001');
                  setTrackingNumber('');
                }}
                className="checkTrackSection-exampleButton"
              >
                CMD-2025-001
              </button>
              <button 
                onClick={() => {
                  setOrderId('ORDER_123');
                  setTrackingNumber('');
                }}
                className="checkTrackSection-exampleButton"
              >
                ORDER_123
              </button>
            </div>
            <div className="checkTrackSection-exampleCategory">
              <span className="checkTrackSection-exampleCategoryLabel">Trackings:</span>
              <button 
                onClick={() => {
                  setTrackingNumber('XU032297055EE');
                  setOrderId('');
                }}
                className="checkTrackSection-exampleButton"
              >
                XU032297055EE
              </button>
              <button 
                onClick={() => {
                  setTrackingNumber('XN051312529FR');
                  setOrderId('');
                }}
                className="checkTrackSection-exampleButton"
              >
                XN051312529FR
              </button>
            </div>
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
          border: 1px solid #00D084;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .checkTrackSection-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .checkTrackSection-inputs {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkTrackSection-inputGroup {
          flex: 1;
        }

        .checkTrackSection-label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkTrackSection-labelText {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .checkTrackSection-input {
          padding: 0.85rem 1.25rem;
          border: 1px solid #00D084;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
          width: 97%;
        }

        .checkTrackSection-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(0, 208, 132, 0.1);
        }

        .checkTrackSection-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 1px;
          margin: 0.5rem 0;
        }

        .checkTrackSection-separator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #00D084;
        }

        .checkTrackSection-separatorText {
          position: relative;
          background: white;
          padding: 0 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-gray-medium);
        }

        .checkTrackSection-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 0 200px;
        }

        .checkTrackSection-button {
          background-color: #00D084;
          color: white;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 140px;
          justify-content: center;
          flex: 1;
        }

        .checkTrackSection-button.secondary {
          background-color: transparent;
          color: var(--color-gray-medium);
          border: 1px solid #00D084;
        }

        .checkTrackSection-button:hover:not(:disabled) {
          background-color: #00b875;
          transform: translateY(-1px);
        }

        .checkTrackSection-button.secondary:hover:not(:disabled) {
          background-color: var(--color-gray-light);
          border-color: var(--color-gray-medium);
        }

        .checkTrackSection-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
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
          margin-top: 1rem;
        }

        .checkTrackSection-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--color-gray-medium);
          margin-top: 1rem;
        }

        .checkTrackSection-results {
          background: white;
          border: 1px solid #00D084;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .checkTrackSection-summary {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #00D084;
        }

        .checkTrackSection-summaryHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .checkTrackSection-summaryTitle {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin: 0 0 0.25rem 0;
        }

        .checkTrackSection-summarySubtitle {
          font-size: 1rem;
          color: var(--color-gray-medium);
          margin: 0;
        }

        .checkTrackSection-status {
          font-size: 1.1rem;
          font-weight: 600;
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
        }

        .checkTrackSection-summaryDetails {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .checkTrackSection-detail {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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
          background: #00D084;
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
          box-shadow: 0 0 0 2px #00D084;
          z-index: 1;
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
          flex: 1;
        }

        .checkTrackSection-eventTime {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
          font-weight: 500;
          text-align: right;
          min-width: 200px;
        }

        .checkTrackSection-noEvents {
          background: var(--color-gray-light);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          color: var(--color-gray-medium);
        }

        .checkTrackSection-noEvents svg {
          margin-bottom: 1rem;
        }

        .checkTrackSection-noEvents p {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .checkTrackSection-examples {
          background: white;
          border: 1px solid #00D084;
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
          flex-direction: column;
          gap: 1rem;
        }

        .checkTrackSection-exampleCategory {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .checkTrackSection-exampleCategoryLabel {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
          font-weight: 500;
          min-width: 100px;
        }

        .checkTrackSection-exampleButton {
          background: var(--color-gray-light);
          border: 1px solid #00D084;
          color: var(--color-gray-dark);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: monospace;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .checkTrackSection-exampleButton:hover {
          background: #00D084;
          color: white;
          border-color: #00D084;
        }

        @media (max-width: 768px) {
          .checkTrackSection-search,
          .checkTrackSection-results,
          .checkTrackSection-examples {
            padding: 1.5rem;
          }

          .checkTrackSection-actions {
            flex-direction: column;
          }

          .checkTrackSection-button {
            width: 100%;
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

          .checkTrackSection-eventTime {
            min-width: auto;
            text-align: left;
          }

          .checkTrackSection-exampleCategory {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}