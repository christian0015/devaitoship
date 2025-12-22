'use client';

import { useState, useEffect } from 'react';

export default function TestChippoIntegration() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle');

  // Données prédéfinies pour le test
  const testData = {
    fromAddress: {
      name: "Test Shop",
      street1: "123 Main St",
      city: "Paris",
      state: "Île-de-France",
      zip: "75001",
      country: "FR",
      phone: "+33123456789",
      email: "shop@example.com"
    },
    toAddress: {
      name: "Test Customer",
      street1: "456 Side St",
      city: "Lyon",
      state: "Auvergne-Rhône-Alpes",
      zip: "69002",
      country: "FR",
      phone: "+33456789123",
      email: "customer@example.com"
    },
    parcels: [
      {
        length: 20,
        width: 15,
        height: 10,
        weight: 1.5,
        distance_unit: "cm",
        mass_unit: "kg"
      }
    ]
  };

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setApiStatus('testing');

    try {
      const response = await fetch('/api/getRates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Vous devrez peut-être fournir un token d'autorisation
          // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
        body: JSON.stringify({
          from: testData.fromAddress,
          to: testData.toAddress,
          parcels: testData.parcels
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erreur inconnue');
      }

      setResults(data);
      setApiStatus('success');
    } catch (err) {
      // setError(err.message);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-container">
      <h1>Test d'intégration Chippo API</h1>
      <p>Cette page teste directement l'endpoint /api/getRates avec des données prédéfinies.</p>
      
      <div className="test-section">
        <h2>Données de test</h2>
        <div className="data-grid">
          <div className="data-card">
            <h3>Adresse d'expédition</h3>
            <pre>{JSON.stringify(testData.fromAddress, null, 2)}</pre>
          </div>
          <div className="data-card">
            <h3>Adresse de destination</h3>
            <pre>{JSON.stringify(testData.toAddress, null, 2)}</pre>
          </div>
          <div className="data-card full-width">
            <h3>Colis</h3>
            <pre>{JSON.stringify(testData.parcels, null, 2)}</pre>
          </div>
        </div>
        
        <button 
          onClick={runTest} 
          disabled={loading}
          className={`test-button ${apiStatus}`}
        >
          {loading ? 'Test en cours...' : 'Exécuter le test'}
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
        <div className="results-panel">
          <h2>Résultats</h2>
          <div className="results-content">
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        </div>
      )}

      <style jsx>{`
        .test-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        h1 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .test-section {
          margin: 2rem 0;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .data-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .data-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        pre {
          white-space: pre-wrap;
          font-size: 0.9rem;
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .test-button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .test-button:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-2px);
        }
        
        .test-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .test-button.success {
          background: #10b981;
        }
        
        .test-button.error {
          background: #ef4444;
        }
        
        .error-panel, .results-panel {
          margin-top: 2rem;
          padding: 1.5rem;
          border-radius: 8px;
        }
        
        .error-panel {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }
        
        .results-panel {
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }
        
        .error-content, .results-content {
          margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
          .data-grid {
            grid-template-columns: 1fr;
          }
          
          .test-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}


// 



// 


// 

// 'use client';

// import { useState } from 'react';

// export default function GetRatesSection({ userData }) {
//   const [loading, setLoading] = useState(false);
//   const [rates, setRates] = useState([]);
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     fromAddress: {
//       name: userData?.shopName || '',
//       street1: '',
//       city: '',
//       state: '',
//       zip: '',
//       country: 'FR'
//     },
//     toAddress: {
//       name: '',
//       street1: '',
//       city: '',
//       state: '',
//       zip: '',
//       country: 'FR'
//     },
//     parcels: [{
//       length: '',
//       width: '',
//       height: '',
//       weight: '',
//       distance_unit: 'cm', // Valeur par défaut
//       mass_unit: 'kg'      // Valeur par défaut
//     }]
//   });

//   const handleInputChange = (section, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));
//   };

//   const handleParcelChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       parcels: prev.parcels.map((parcel, i) => 
//         i === index ? { ...parcel, [field]: value } : parcel
//       )
//     }));
//   };

//   const addParcel = () => {
//     setFormData(prev => ({
//       ...prev,
//       parcels: [...prev.parcels, { length: '', width: '', height: '', weight: '' }]
//     }));
//   };

//   const removeParcel = (index) => {
//     if (formData.parcels.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         parcels: prev.parcels.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setRates([]);

//     try {
//       const response = await fetch('/api/getRates', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${userData.apiToken}`
//         },
//         body: JSON.stringify({
//           from: formData.fromAddress,
//           to: formData.toAddress,
//           parcels: formData.parcels.map(p => ({
//             length: parseFloat(p.length),
//             width: parseFloat(p.width),
//             height: parseFloat(p.height),
//             weight: parseFloat(p.weight)
//           }))
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Erreur lors du calcul des tarifs');
//       }

//       const data = await response.json();
//       setRates(data.rates || []);
//     } catch (err) {
//       setError(err.message || 'Une erreur est survenue');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... (l

//   return (
//     <div className="getRatesSection">
//       <div className="getRatesSection-header">
//         <h1 className="getRatesSection-title">Estimation des Tarifs</h1>
//         <p className="getRatesSection-subtitle">
//           Calculez les coûts de livraison pour vos expéditions
//         </p>
//       </div>

//       <div className="getRatesSection-content">
//         <form onSubmit={handleSubmit} className="getRatesSection-form">
//           {/* Adresse d'expédition */}
//           <div className="getRatesSection-section">
//             <h3 className="getRatesSection-sectionTitle">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="getRatesSection-icon">
//                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" 
//                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
//               </svg>
//               Adresse d'Expédition
//             </h3>
//             <div className="getRatesSection-grid">
//               <input
//                 type="text"
//                 placeholder="Nom/Société"
//                 value={formData.fromAddress.name}
//                 onChange={(e) => handleInputChange('fromAddress', 'name', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Adresse"
//                 value={formData.fromAddress.street1}
//                 onChange={(e) => handleInputChange('fromAddress', 'street1', e.target.value)}
//                 className="getRatesSection-input getRatesSection-fullWidth"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Ville"
//                 value={formData.fromAddress.city}
//                 onChange={(e) => handleInputChange('fromAddress', 'city', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />

//               {/* Dans la section Adresse d'expédition */}
//               <input
//                 type="text"
//                 placeholder="Région/État"
//                 value={formData.fromAddress.state}
//                 onChange={(e) => handleInputChange('fromAddress', 'state', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />
              
//               <input
//                 type="text"
//                 placeholder="Code postal"
//                 value={formData.fromAddress.zip}
//                 onChange={(e) => handleInputChange('fromAddress', 'zip', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />
//               <select
//                 value={formData.fromAddress.country}
//                 onChange={(e) => handleInputChange('fromAddress', 'country', e.target.value)}
//                 className="getRatesSection-select"
//               >
//                 <option value="FR">France</option>
//                 <option value="DE">Allemagne</option>
//                 <option value="ES">Espagne</option>
//                 <option value="IT">Italie</option>
//               </select>
//             </div>
//           </div>

//           {/* Adresse de livraison */}
//           <div className="getRatesSection-section">
//             <h3 className="getRatesSection-sectionTitle">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="getRatesSection-icon">
//                 <path d="M9 11H1l2-2m0 0l2-2m-2 2h12a4 4 0 0 1 0 8v0M21 13H9l2-2m0 0l2-2m-2 2v12a4 4 0 0 0 0-8v0" 
//                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               Adresse de Livraison
//             </h3>
//             <div className="getRatesSection-grid">
//               <input
//                 type="text"
//                 placeholder="Nom/Société"
//                 value={formData.toAddress.name}
//                 onChange={(e) => handleInputChange('toAddress', 'name', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Adresse"
//                 value={formData.toAddress.street1}
//                 onChange={(e) => handleInputChange('toAddress', 'street1', e.target.value)}
//                 className="getRatesSection-input getRatesSection-fullWidth"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Ville"
//                 value={formData.toAddress.city}
//                 onChange={(e) => handleInputChange('toAddress', 'city', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />

//               {/* Dans la section Adresse de livraison */}
//               <input
//                 type="text"
//                 placeholder="Région/État"
//                 value={formData.toAddress.state}
//                 onChange={(e) => handleInputChange('toAddress', 'state', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />
              
//               <input
//                 type="text"
//                 placeholder="Code postal"
//                 value={formData.toAddress.zip}
//                 onChange={(e) => handleInputChange('toAddress', 'zip', e.target.value)}
//                 className="getRatesSection-input"
//                 required
//               />
//               <select
//                 value={formData.toAddress.country}
//                 onChange={(e) => handleInputChange('toAddress', 'country', e.target.value)}
//                 className="getRatesSection-select"
//               >
//                 <option value="FR">France</option>
//                 <option value="DE">Allemagne</option>
//                 <option value="ES">Espagne</option>
//                 <option value="IT">Italie</option>
//               </select>
//             </div>
//           </div>

//           {/* Colis */}
//           <div className="getRatesSection-section">
//             <div className="getRatesSection-sectionHeader">
//               <h3 className="getRatesSection-sectionTitle">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="getRatesSection-icon">
//                   <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M16 8h4l3 3v5h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
//                   <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
//                 </svg>
//                 Dimensions des Colis
//               </h3>
//               <button
//                 type="button"
//                 onClick={addParcel}
//                 className="getRatesSection-addButton"
//               >
//                 + Ajouter un colis
//               </button>
//             </div>

//             {formData.parcels.map((parcel, index) => (
//               <div key={index} className="getRatesSection-parcel">
//                 <div className="getRatesSection-parcelHeader">
//                   <span>Colis {index + 1}</span>
//                   {formData.parcels.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeParcel(index)}
//                       className="getRatesSection-removeButton"
//                     >
//                       Supprimer
//                     </button>
//                   )}
//                 </div>
//                 <div className="getRatesSection-parcelGrid">
//                   <input
//                     type="number"
//                     placeholder="Longueur (cm)"
//                     value={parcel.length}
//                     onChange={(e) => handleParcelChange(index, 'length', e.target.value)}
//                     className="getRatesSection-input"
//                     required
//                   />
//                   <input
//                     type="number"
//                     placeholder="Largeur (cm)"
//                     value={parcel.width}
//                     onChange={(e) => handleParcelChange(index, 'width', e.target.value)}
//                     className="getRatesSection-input"
//                     required
//                   />
//                   <input
//                     type="number"
//                     placeholder="Hauteur (cm)"
//                     value={parcel.height}
//                     onChange={(e) => handleParcelChange(index, 'height', e.target.value)}
//                     className="getRatesSection-input"
//                     required
//                   />
//                   <input
//                     type="number"
//                     placeholder="Poids (kg)"
//                     value={parcel.weight}
//                     onChange={(e) => handleParcelChange(index, 'weight', e.target.value)}
//                     className="getRatesSection-input"
//                     step="0.1"
//                     required
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="getRatesSection-submitButton"
//           >
//             {loading ? (
//               <>
//                 <div className="getRatesSection-spinner"></div>
//                 Calcul en cours...
//               </>
//             ) : (
//               'Calculer les Tarifs'
//             )}
//           </button>
//         </form>

//         {/* Résultats */}
//         {error && (
//           <div className="getRatesSection-error">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
//               <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
//               <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
//             </svg>
//             {error}
//           </div>
//         )}

//         {rates.length > 0 && (
//           <div className="getRatesSection-results">
//             <h3 className="getRatesSection-resultsTitle">Tarifs Disponibles</h3>
//             <div className="getRatesSection-ratesList">
//               {rates.map((rate) => (
//                 <div key={rate.id} className="getRatesSection-rateCard">
//                   <div className="getRatesSection-rateHeader">
//                     <h4 className="getRatesSection-rateProvider">{rate.provider}</h4>
//                     <span className="getRatesSection-ratePrice">{rate.price.toFixed(2)} €</span>
//                   </div>
//                   <div className="getRatesSection-rateDetails">
//                     <span className="getRatesSection-rateService">{rate.service_level}</span>
//                     <span className="getRatesSection-rateDays">{rate.estimated_days} jours</span>
//                   </div>
//                   <button className="getRatesSection-selectButton">
//                     Sélectionner ce tarif
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .getRatesSection {
//           padding: 0;
//         }

//         .getRatesSection-header {
//           margin-bottom: 2rem;
//         }

//         .getRatesSection-title {
//           font-size: 2rem;
//           font-weight: 700;
//           color: var(--color-gray-dark);
//           margin: 0 0 0.5rem 0;
//         }

//         .getRatesSection-subtitle {
//           color: var(--color-gray-medium);
//           font-size: 1.1rem;
//           margin: 0;
//         }

//         .getRatesSection-content {
//           display: flex;
//           flex-direction: column;
//           gap: 2rem;
//         }

//         .getRatesSection-form {
//           background: white;
//           border: 1px solid var(--color-border);
//           border-radius: 16px;
//           padding: 2rem;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
//         }

//         .getRatesSection-section {
//           margin-bottom: 2rem;
//         }

//         .getRatesSection-section:last-child {
//           margin-bottom: 0;
//         }

//         .getRatesSection-sectionHeader {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1rem;
//         }

//         .getRatesSection-sectionTitle {
//           font-size: 1.25rem;
//           font-weight: 600;
//           color: var(--color-gray-dark);
//           margin: 0 0 1rem 0;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .getRatesSection-icon {
//           color: var(--color-accent);
//         }

//         .getRatesSection-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 1rem;
//         }

//         .getRatesSection-input,
//         .getRatesSection-select {
//           padding: 0.875rem 1rem;
//           border: 1px solid var(--color-border);
//           border-radius: 12px;
//           font-size: 1rem;
//           transition: all 0.2s ease;
//           background: white;
//         }

//         .getRatesSection-input:focus,
//         .getRatesSection-select:focus {
//           outline: none;
//           border-color: var(--color-accent);
//           box-shadow: 0 0 0 3px rgba(0, 208, 132, 0.1);
//         }

//         .getRatesSection-fullWidth {
//           grid-column: 1 / -1;
//         }

//         .getRatesSection-addButton {
//           background: var(--color-accent);
//           color: white;
//           border: none;
//           padding: 0.5rem 1rem;
//           border-radius: 8px;
//           font-size: 0.9rem;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background-color 0.2s;
//         }

//         .getRatesSection-addButton:hover {
//           background: var(--color-accent-hover);
//         }

//         .getRatesSection-parcel {
//           border: 1px solid var(--color-border);
//           border-radius: 12px;
//           padding: 1.5rem;
//           margin-bottom: 1rem;
//         }

//         .getRatesSection-parcelHeader {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1rem;
//         }

//         .getRatesSection-parcelHeader span {
//           font-weight: 600;
//           color: var(--color-gray-dark);
//         }

//         .getRatesSection-removeButton {
//           background: #dc3545;
//           color: white;
//           border: none;
//           padding: 0.375rem 0.75rem;
//           border-radius: 6px;
//           font-size: 0.85rem;
//           cursor: pointer;
//           transition: background-color 0.2s;
//         }

//         .getRatesSection-removeButton:hover {
//           background: #c82333;
//         }

//         .getRatesSection-parcelGrid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
//           gap: 1rem;
//         }

//         .getRatesSection-submitButton {
//           background: var(--color-accent);
//           background: #c82333;
//           color: white;
//           border: none;
//           padding: 1rem 2rem;
//           border-radius: 12px;
//           font-size: 1.1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           margin-top: 1rem;
//         }

//         .getRatesSection-submitButton:hover:not(:disabled) {
//           // background: var(--color-accent-hover);
//           transform: translateY(-1px);
//         }

//         .getRatesSection-submitButton:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .getRatesSection-spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid rgba(255, 255, 255, 0.3);
//           border-top: 2px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .getRatesSection-error {
//           background: #fee;
//           border: 1px solid #fcc;
//           color: #c33;
//           padding: 1rem;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .getRatesSection-results {
//           background: white;
//           border: 1px solid var(--color-border);
//           border-radius: 16px;
//           padding: 2rem;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
//         }

//         .getRatesSection-resultsTitle {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: var(--color-gray-dark);
//           margin: 0 0 1.5rem 0;
//         }

//         .getRatesSection-ratesList {
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//         }

//         .getRatesSection-rateCard {
//           border: 1px solid var(--color-border);
//           border-radius: 12px;
//           padding: 1.5rem;
//           transition: all 0.2s ease;
//         }

//         .getRatesSection-rateCard:hover {
//           border-color: var(--color-accent);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }

//         .getRatesSection-rateHeader {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 0.75rem;
//         }

//         .getRatesSection-rateProvider {
//           font-size: 1.25rem;
//           font-weight: 600;
//           color: var(--color-gray-dark);
//           margin: 0;
//         }

//         .getRatesSection-ratePrice {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: var(--color-accent);
//         }

//         .getRatesSection-rateDetails {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 1rem;
//         }

//         .getRatesSection-rateService {
//           color: var(--color-gray-medium);
//           font-weight: 500;
//         }

//         .getRatesSection-rateDays {
//           color: var(--color-gray-medium);
//         }

//         .getRatesSection-selectButton {
//           background: gray;
//           // background: var(--color-accent);
//           color: white;
//           border: none;
//           padding: 0.75rem 1.5rem;
//           border-radius: 8px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background-color 0.2s;
//           width: 100%;
//         }

//         .getRatesSection-selectButton:hover {
//           background: var(--color-accent-hover);
//         }

//         @media (max-width: 768px) {
//           .getRatesSection-form,
//           .getRatesSection-results {
//             padding: 1.5rem;
//           }

//           .getRatesSection-grid {
//             grid-template-columns: 1fr;
//           }

//           .getRatesSection-parcelGrid {
//             grid-template-columns: repeat(2, 1fr);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }