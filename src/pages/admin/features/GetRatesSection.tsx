'use client';

import { useState, useEffect } from 'react';

export default function GetRatesSections() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle');
  
  // États pour les données du formulaire
  const [fromAddress, setFromAddress] = useState({
    name: "Test Shop",
    street1: "123 Main St",
    city: "Paris",
    state: "Île-de-France",
    zip: "75001",
    country: "FR",
    phone: "+33123456789",
    email: "shop@example.com"
  });
  
  const [toAddress, setToAddress] = useState({
    name: "Test Customer",
    street1: "456 Side St",
    city: "Lyon",
    state: "Auvergne-Rhône-Alpes",
    zip: "69002",
    country: "FR",
    phone: "+33456789123",
    email: "customer@example.com"
  });
  
  const [parcels, setParcels] = useState([
    {
      // length: 20,
      // width: 15,
      // height: 10,
      // weight: 1.5,
      // distance_unit: "cm",
      // mass_unit: "kg"

      length: 80,
      width: 65,
      height: 10,
      weight: 18,
      distance_unit: "cm",
      mass_unit: "kg"
      
    }
  ]);

  const handleFromAddressChange = (field, value) => {
    setFromAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleToAddressChange = (field, value) => {
    setToAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleParcelChange = (index, field, value) => {
    const updatedParcels = [...parcels];
    updatedParcels[index][field] = value;
    setParcels(updatedParcels);
  };

  const addParcel = () => {
    setParcels([...parcels, {
      length: 20,
      width: 15,
      height: 10,
      weight: 1.5,
      distance_unit: "cm",
      mass_unit: "kg"
    }]);
  };

  const removeParcel = (index) => {
    if (parcels.length > 1) {
      const updatedParcels = [...parcels];
      updatedParcels.splice(index, 1);
      setParcels(updatedParcels);
    }
  };

  const runEstimation = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setApiStatus('estimation');

    try {
      const response = await fetch('/api/getRates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: toAddress,
          parcels: parcels
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erreur inconnue');
      }

      setResults(data);
      setApiStatus('success');
    } catch (err) {
      setError(err.message);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-estimation">
      <h1>Estimation DevaShip avec Chippo API</h1>
      <p>Tester en temps reels notre systeme d'estimation des prix.</p>
      
      <div className="form-section">
        <h2>Adresse d'expédition</h2>
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="fromName">Nom</label>
            <input
              id="fromName"
              type="text"
              value={fromAddress.name}
              onChange={(e) => handleFromAddressChange('name', e.target.value)}
              placeholder="Nom complet"
            />
          </div>
          <div className="input-group">
            <label htmlFor="fromStreet">Rue</label>
            <input
              id="fromStreet"
              type="text"
              value={fromAddress.street1}
              onChange={(e) => handleFromAddressChange('street1', e.target.value)}
              placeholder="Adresse ligne 1"
            />
          </div>
          <div className="input-group">
            <label htmlFor="fromCity">Ville</label>
            <input
              id="fromCity"
              type="text"
              value={fromAddress.city}
              onChange={(e) => handleFromAddressChange('city', e.target.value)}
              placeholder="Ville"
            />
          </div>
          <div className="input-group">
            <label htmlFor="fromState">Région</label>
            <input
              id="fromState"
              type="text"
              value={fromAddress.state}
              onChange={(e) => handleFromAddressChange('state', e.target.value)}
              placeholder="Région/État"
            />
          </div>
          <div className="input-group">
            <label htmlFor="fromZip">Code postal</label>
            <input
              id="fromZip"
              type="text"
              value={fromAddress.zip}
              onChange={(e) => handleFromAddressChange('zip', e.target.value)}
              placeholder="Code postal"
            />
          </div>
          <div className="input-group">
            <label htmlFor="fromCountry">Pays  (code ISO)</label>
            <input
              id="fromCountry"
              type="text"
              value={fromAddress.country}
              onChange={(e) => handleFromAddressChange('country', e.target.value)}
              // placeholder="Code pays (ex: FR)"
              placeholder="FR, US, DE, etc."
              maxLength={2}
            />
          </div>
          <div className="input-group">
            <label htmlFor="fromPhone">Téléphone</label>
            <input
              id="fromPhone"
              type="text"
              value={fromAddress.phone}
              onChange={(e) => handleFromAddressChange('phone', e.target.value)}
              placeholder="Numéro de téléphone"
            />
          </div>
          <div className="input-group">
            <label htmlFor="fromEmail">Email</label>
            <input
              id="fromEmail"
              type="email"
              value={fromAddress.email}
              onChange={(e) => handleFromAddressChange('email', e.target.value)}
              placeholder="Adresse email"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Adresse de destination</h2>
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="toName">Nom</label>
            <input
              id="toName"
              type="text"
              value={toAddress.name}
              onChange={(e) => handleToAddressChange('name', e.target.value)}
              placeholder="Nom complet"
            />
          </div>
          <div className="input-group">
            <label htmlFor="toStreet">Rue</label>
            <input
              id="toStreet"
              type="text"
              value={toAddress.street1}
              onChange={(e) => handleToAddressChange('street1', e.target.value)}
              placeholder="Adresse ligne 1"
            />
          </div>
          <div className="input-group">
            <label htmlFor="toCity">Ville</label>
            <input
              id="toCity"
              type="text"
              value={toAddress.city}
              onChange={(e) => handleToAddressChange('city', e.target.value)}
              placeholder="Ville"
            />
          </div>
          <div className="input-group">
            <label htmlFor="toState">Région</label>
            <input
              id="toState"
              type="text"
              value={toAddress.state}
              onChange={(e) => handleToAddressChange('state', e.target.value)}
              placeholder="Région/État"
            />
          </div>
          <div className="input-group">
            <label htmlFor="toZip">Code postal</label>
            <input
              id="toZip"
              type="text"
              value={toAddress.zip}
              onChange={(e) => handleToAddressChange('zip', e.target.value)}
              placeholder="Code postal"
            />
          </div>
          <div className="input-group">
            <label htmlFor="toCountry">Pays  (code ISO)</label>
            <input
              id="toCountry"
              type="text"
              value={toAddress.country}
              onChange={(e) => handleToAddressChange('country', e.target.value)}
              // placeholder="Code pays (ex: FR)"
              placeholder="FR, US, DE, etc."
              maxLength={2}
            />
          </div>
          <div className="input-group">
            <label htmlFor="toPhone">Téléphone</label>
            <input
              id="toPhone"
              type="text"
              value={toAddress.phone}
              onChange={(e) => handleToAddressChange('phone', e.target.value)}
              placeholder="Numéro de téléphone"
            />
          </div>
          <div className="input-group">
            <label htmlFor="toEmail">Email</label>
            <input
              id="toEmail"
              type="email"
              value={toAddress.email}
              onChange={(e) => handleToAddressChange('email', e.target.value)}
              placeholder="Adresse email"
            />
          </div>
        </div>
      </div>

      <div className="form-section colis-section">
        <h2>Colis</h2>
        {parcels.map((parcel, index) => (
          <div key={index} className="parcel-form">
            <h3>Colis #{index + 1}</h3>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor={`length-${index}`}>Longueur</label>
                <input
                  id={`length-${index}`}
                  type="number"
                  value={parcel.length}
                  onChange={(e) => handleParcelChange(index, 'length', parseFloat(e.target.value))}
                  placeholder="Longueur"
                />
              </div>
              <div className="input-group">
                <label htmlFor={`width-${index}`}>Largeur</label>
                <input
                  id={`width-${index}`}
                  type="number"
                  value={parcel.width}
                  onChange={(e) => handleParcelChange(index, 'width', parseFloat(e.target.value))}
                  placeholder="Largeur"
                />
              </div>
              <div className="input-group">
                <label htmlFor={`height-${index}`}>Hauteur</label>
                <input
                  id={`height-${index}`}
                  type="number"
                  value={parcel.height}
                  onChange={(e) => handleParcelChange(index, 'height', parseFloat(e.target.value))}
                  placeholder="Hauteur"
                />
              </div>
              <div className="input-group">
                <label htmlFor={`weight-${index}`}>Poids</label>
                <input
                  id={`weight-${index}`}
                  type="number"
                  value={parcel.weight}
                  onChange={(e) => handleParcelChange(index, 'weight', parseFloat(e.target.value))}
                  placeholder="Poids"
                />
              </div>
              <div className="input-group">
                <label htmlFor={`distance_unit-${index}`}>Unité de distance</label>
                <select
                  id={`distance_unit-${index}`}
                  value={parcel.distance_unit}
                  onChange={(e) => handleParcelChange(index, 'distance_unit', e.target.value)}
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor={`mass_unit-${index}`}>Unité de masse</label>
                <select
                  id={`mass_unit-${index}`}
                  value={parcel.mass_unit}
                  onChange={(e) => handleParcelChange(index, 'mass_unit', e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
            {parcels.length > 1 && (
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeParcel(index)}
              >
                Supprimer ce colis
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-button" onClick={addParcel}>
          + Ajouter un colis
        </button>
      </div>
      
      <div className="action-section">
        <button 
          onClick={runEstimation} 
          disabled={loading}
          // className={`estimation-button ${apiStatus}`}
          className={`estimation-button`}
        >
          {loading ? 'Estiamation en cours...' : 'Voir le coûts'}
        </button>
      </div>
      
      {error && (
        <div className="error-panel">
          <h2>Erreur</h2>
          <div className="error-content">
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {results && (
        <div className="results-section">
          <h2>Résultats</h2>
          <div className="mockupContainer">
            <div className="mockupScreen">
              <div className="mockupContent">
                <h3>Options de livraison</h3>
                {results.map((rate, index) => (
                  <div key={rate.id} className={`shippingOption ${index === 0 ? 'active' : ''}`}>
                    <div>
                      <span className="carrier">{rate.carrier}</span>
                      <span className="service">{rate.service}</span>
                    </div>
                    <div>
                      <span className="price">{rate.price} {rate.currency}</span>
                      {rate.estimated_days && (
                        <span className="delivery-time">({rate.estimated_days} jours)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :root {
          --color-primary: #000;
          --color-secondary: #fff;
          --color-accent: #00d084;
          --color-border: #eaeaea;
          --color-error: #ff4d4f;
          --color-success: #00d084;
          --color-background: #fafafa;
        }
        
        .container-estimation {
          margin: -25px auto 0; 
          padding 0;
          padding: 0 0 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          // background-color: #cdcd7f69;
          color: var(--color-primary);
        }
        
        h1 {
          color: var(--color-primary);
          margin-bottom: 0.5rem;
          font-size: 2rem;
          font-weight: 700;
        }
        
        h2 {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          font-weight: 250;
          margin-top:-50px;
        }
        
        h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .form-section {
          margin: 3rem 0;
          padding: 2rem;
          // background: var(--color-secondary);
          background: #e9f0eeff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid var(--color-border);
        }

        .form-section h2{
        // position : absolute;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
        }
        
        label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        input, select {
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: .9rem;
          transition: border-color 0.2s ease;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px rgba(0, 208, 132, 0.2);
        }
        
        .parcel-form {
          padding: 1.5rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          margin-bottom: 1.5rem;
          background: var(--color-background);
        }
        
        .add-button, .remove-button {
          background: #000;
          border: 1px solid var(--color-border);
          color: #ffffffff;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        
        .add-button:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        
        .remove-button {
          border-color: #ffa39e;
          margin-top: 20px;
          color: #ff4d4f;
          background-color: #ffffffff;
        }
        
        .remove-button:hover {
          background: #fff2f0;
        }

        .action-section {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
        
        .estimation-button {
          // background: var(--color-primary);
          // color: var(--color-secondary);
          background: #E9F0EE;
          border: 1px solid var(--color-border);
          color: #2e2e2eff;
          border: none;
          padding: 1rem 8rem;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .estimation-button:hover:not(:disabled) {
          background: #e5faf2;
          color: #000;
        }
        
        .estimation-button:disabled {
          background: #ffffc8;
          cursor: not-allowed;
        }
        
        .estimation-button.success {
          background: var(--color-success);
        }
        
        .estimation-button.error {
          background: #ff4d4f;
        }
        
        .error-panel {
          margin-top: 2rem;
          padding: 1.5rem;
          border-radius: 8px;
          background: #fff2f0;
          border: 1px solid #ffccc7;
          color: #ff4d4f;
        }
        
        .results-section {
          margin: 2rem auto; 
        }
        
        .mockupContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.5rem;
        }
        
        .mockupScreen {
          background: var(--color-secondary);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--color-border);
          width: 100%;
          max-width: 400px;
        }
        
        .mockupContent h3 {
          margin: 0 0 1.5rem 0;
          color: var(--color-primary);
          text-align: center;
          font-weight: 600;
        }
        
        .shippingOption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          margin-bottom: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .shippingOption:hover,
        .shippingOption.active {
          border-color: var(--color-accent);
          background: rgba(0, 208, 132, 0.05);
        }
        
        .carrier {
          font-weight: 600;
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .service {
          font-size: 0.875rem;
          color: #666;
        }
        
        .price {
          font-weight: 600;
          color: var(--color-accent);
        }
        
        .delivery-time {
          display: block;
          font-size: 0.75rem;
          color: #666;
          text-align: right;
          margin-top: 0.25rem;
        }
        
        @media (max-width: 768px) {
          .container-estimation {
            padding: 1rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}