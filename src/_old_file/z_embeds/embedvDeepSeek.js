// embed.js - Widget Devaito Shipping optimisé pour production
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// ===== CONFIGURATION =====
const CONFIG = {
  API_BASE: 'https://devaito.com',
  SHIPPO_API: 'https://devaitoship.vercel.app/api/getRates',
  DEBUG: false, // Désactiver en production
  DEFAULT_DIMENSIONS: { 
    length: 20, 
    width: 15, 
    height: 10, 
    weight: 1.5, 
    distance_unit: 'cm', 
    mass_unit: 'kg' 
  },
};

const debugLog = (msg, ...args) => {
  if (CONFIG.DEBUG) console.log(`[DevaShip Widget] ${msg}`, ...args);
};

// Composant principal du Widget
function DevaitoWidget({ shopId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [token, setToken] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [toAddress, setToAddress] = useState({
    name: '', company: '', street1: '', street2: '', city: '', 
    state: '', zip: '', country: 'FR', phone: '', email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [isCartPage, setIsCartPage] = useState(false);

  // Initialisation et détection de page
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    setIsCartPage(path.includes('/cart') || path.includes('/panier') || path.includes('/checkout'));
    getToken();
    loadSavedAddress();
  }, []);

  // Récupération du token Devaito
  const getToken = async () => {
    try {
      // À ADAPTER: Remplacer par la méthode réelle d'obtention du token
      const response = await fetch(`${CONFIG.API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: 'merchant_username', 
          password: 'merchant_password' 
        }),
      });
      
      if (!response.ok) throw new Error('Échec de la connexion');
      const data = await response.json();
      setToken(data.token);
      debugLog('Token récupéré');
    } catch (err) {
      setError('Erreur de connexion à Devaito');
      debugLog('Erreur token:', err);
    }
  };

  // Récupération des données du shop
  const getShopData = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${CONFIG.API_BASE}/api/shops/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Échec du chargement des données du shop');
      const data = await response.json();
      
      setShopData({
        fromAddress: data.shipping_address || { 
          name: data.name || 'Boutique', 
          street1: 'Adresse par défaut', 
          city: 'Ville', 
          state: 'Région', 
          zip: '00000', 
          country: 'FR' 
        },
        defaultDimensions: data.default_dimensions || CONFIG.DEFAULT_DIMENSIONS,
      });
      
      debugLog('Données shop chargées');
    } catch (err) {
      setError('Erreur de chargement des données du shop');
      debugLog('Erreur shop:', err);
    }
  };

  // Chargement de l'adresse client sauvegardée
  const loadSavedAddress = () => {
    const saved = localStorage.getItem('devaito_toAddress');
    if (saved) {
      try {
        setToAddress(JSON.parse(saved));
        debugLog('Adresse client chargée depuis le stockage local');
      } catch (e) {
        debugLog('Erreur de parsing de l\'adresse sauvegardée');
      }
    }
    
    // Auto-remplissage via géolocalisation (pays seulement)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Simplification: on pourrait utiliser une API de géocodage inverse ici
          setToAddress(prev => ({ ...prev, country: 'FR' }));
        },
        (err) => debugLog('Géolocalisation non disponible:', err),
        { timeout: 3000 }
      );
    }
  };

  // Sauvegarde de l'adresse
  const saveAddress = () => {
    localStorage.setItem('devaito_toAddress', JSON.stringify(toAddress));
  };

  // Gestionnaire de changement d'adresse
  const handleToChange = (field, value) => {
    setToAddress(prev => ({ ...prev, [field]: value }));
  };

  // Chargement des données produit (page produit)
  const fetchProduct = async () => {
    if (!token || !shopData) return;
    
    const slug = window.location.pathname.split('/product/')[1]?.split('/')[0] || '';
    if (!slug) {
      setError('Impossible de trouver le produit dans l\'URL');
      return;
    }
    
    try {
      const response = await fetch(`${CONFIG.API_BASE}/api/get_product_by_slug/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Échec du chargement du produit');
      const product = await response.json();
      
      setProducts([{
        id: product._id || slug,
        name: product.name || 'Produit',
        quantity: 1,
        maxQuantity: product.quantity || 1,
        dimensions: product.dimensions || shopData.defaultDimensions,
        fromAddress: product.shipping_address || shopData.fromAddress,
        usedDefaultDims: !product.dimensions,
      }]);
      
      debugLog('Produit chargé:', product.name);
    } catch (err) {
      setError('Erreur de chargement du produit');
      debugLog('Erreur produit:', err);
    }
  };

  // Chargement des données du panier (page panier)
  useEffect(() => {
    if (!isCartPage || !token || !shopData) return;

    const parseCart = async () => {
      const cartProducts = [];
      const productElements = document.querySelectorAll('.product_3, [data-cart-item]');
      
      for (const el of productElements) {
        const productLink = el.querySelector('a[href^="/product/"]');
        const slug = productLink?.href.split('/product/')[1] || '';
        const name = el.querySelector('.product_name_3, [data-product-name]')?.textContent.trim() || 'Produit';
        const qtyInput = el.querySelector('.input_number_quantity, [data-quantity]');
        const qty = parseInt(qtyInput?.value || 1);
        
        if (!slug) continue;

        try {
          const response = await fetch(`${CONFIG.API_BASE}/api/get_product_by_slug/${slug}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (!response.ok) throw new Error('Échec du chargement du produit du panier');
          const product = await response.json();
          
          cartProducts.push({
            id: el.dataset.id || slug,
            name,
            quantity: qty,
            maxQuantity: product.quantity || 10000000,
            dimensions: product.dimensions || shopData.defaultDimensions,
            fromAddress: product.shipping_address || shopData.fromAddress,
            usedDefaultDims: !product.dimensions,
          });
        } catch (err) {
          debugLog('Erreur produit panier:', err);
        }
      }
      
      setProducts(cartProducts);
      debugLog('Panier parsé:', cartProducts.length, 'produits');
    };

    parseCart();

    // Observer pour les changements dynamiques du panier
    const observer = new MutationObserver(parseCart);
    const target = document.querySelector('.shoppingCart, .cart-container') || document.body;
    observer.observe(target, { childList: true, subtree: true, attributes: true });
    
    return () => observer.disconnect();
  }, [isCartPage, token, shopData]);

  // Changement de quantité
  const handleQuantityChange = (index, value) => {
    const updated = [...products];
    const newQty = Math.max(1, Math.min(parseInt(value) || 1, updated[index].maxQuantity));
    updated[index].quantity = newQty;
    setProducts(updated);
  };

  // Préparation des requêtes pour Shippo (regroupement par adresse d'expédition)
  const prepareRequests = () => {
    const groups = {};
    
    products.forEach((prod) => {
      const key = JSON.stringify(prod.fromAddress);
      if (!groups[key]) groups[key] = { from: prod.fromAddress, parcels: [] };
      
      for (let i = 0; i < prod.quantity; i++) {
        groups[key].parcels.push(prod.dimensions);
      }
    });
    
    return Object.values(groups).map((group) => ({
      from: group.from,
      to: toAddress,
      parcels: group.parcels
    }));
  };

  // Exécution de l'estimation
  const runEstimation = async () => {
    if (!toAddress.street1 || !toAddress.city || !toAddress.country) {
      setError('Veuillez compléter l\'adresse de livraison');
      return;
    }
    
    if (products.length === 0) {
      setError('Aucun produit à estimer');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    saveAddress();
    
    try {
      const requests = prepareRequests();
      const allResults = [];
      
      for (const req of requests) {
        const response = await fetch(CONFIG.SHIPPO_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur API Shippo');
        }
        
        const data = await response.json();
        allResults.push(...data);
      }
      
      setResults(allResults);
      debugLog('Résultats obtenus:', allResults.length, 'options');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'estimation');
      debugLog('Erreur estimation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chargement des données du shop après l'obtention du token
  useEffect(() => {
    if (token) getShopData();
  }, [token]);

  // Chargement du produit après l'obtention des données du shop
  useEffect(() => {
    if (shopData && !isCartPage) fetchProduct();
  }, [shopData, isCartPage]);

  // Rendu de l'interface
  return (
    <div style={styles.widget}>
      <button 
        style={{...styles.toggleButton, backgroundColor: isVisible ? '#0066cc' : '#f0f0f0'}}
        onClick={() => setIsVisible(!isVisible)}
      >
        📦 Estimation coût de livraison {isVisible ? '▼' : '▶'}
      </button>
      
      {isVisible && (
        <div style={styles.content}>
          {/* Adresse de livraison */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Adresse de livraison</h4>
            <div style={styles.addressForm}>
              <input 
                style={styles.input} 
                placeholder="Nom complet" 
                value={toAddress.name} 
                onChange={(e) => handleToChange('name', e.target.value)} 
              />
              <input 
                style={styles.input} 
                placeholder="Entreprise (optionnel)" 
                value={toAddress.company} 
                onChange={(e) => handleToChange('company', e.target.value)} 
              />
              <input 
                style={styles.input} 
                placeholder="Adresse" 
                value={toAddress.street1} 
                onChange={(e) => handleToChange('street1', e.target.value)} 
              />
              <input 
                style={styles.input} 
                placeholder="Complément d'adresse" 
                value={toAddress.street2} 
                onChange={(e) => handleToChange('street2', e.target.value)} 
              />
              
              <div style={styles.row}>
                <input 
                  style={styles.input} 
                  placeholder="Ville" 
                  value={toAddress.city} 
                  onChange={(e) => handleToChange('city', e.target.value)} 
                />
                <input 
                  style={styles.input} 
                  placeholder="Code postal" 
                  value={toAddress.zip} 
                  onChange={(e) => handleToChange('zip', e.target.value)} 
                />
              </div>
              
              <div style={styles.row}>
                <input 
                  style={styles.input} 
                  placeholder="Région/État" 
                  value={toAddress.state} 
                  onChange={(e) => handleToChange('state', e.target.value)} 
                />
                <select 
                  style={styles.select} 
                  value={toAddress.country} 
                  onChange={(e) => handleToChange('country', e.target.value)}
                >
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="DE">Allemagne</option>
                  <option value="ES">Espagne</option>
                  <option value="IT">Italie</option>
                  <option value="US">États-Unis</option>
                </select>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>
              {isCartPage ? 'Panier' : 'Produit'} ({products.length})
            </h4>
            
            {products.map((prod, idx) => (
              <div key={idx} style={styles.productItem}>
                <div style={styles.productInfo}>
                  <strong>{prod.name}</strong>
                  {prod.usedDefaultDims && (
                    <small style={styles.warning}>(Dimensions par défaut)</small>
                  )}
                </div>
                
                <div style={styles.quantityControl}>
                  <label>Quantité:</label>
                  <input
                    type="number"
                    style={styles.quantityInput}
                    value={prod.quantity}
                    min="1"
                    max={prod.maxQuantity}
                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bouton d'estimation */}
          <button 
            style={{
              ...styles.estimateButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={runEstimation} 
            disabled={loading}
          >
            {loading ? '⏳ Calcul en cours...' : '📊 Estimer la livraison'}
          </button>

          {/* Messages d'erreur */}
          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {/* Résultats */}
          {results && (
            <div style={styles.results}>
              <h4 style={styles.sectionTitle}>Options de livraison</h4>
              
              {results.length > 0 ? (
                results.map((rate, idx) => (
                  <div key={idx} style={styles.rateItem}>
                    <div style={styles.rateHeader}>
                      <strong>{rate.carrier} - {rate.service}</strong>
                      <span style={styles.price}>
                        {rate.amount} {rate.currency}
                      </span>
                    </div>
                    <div style={styles.rateDetails}>
                      {rate.estimated_days && (
                        <small>Livraison en {rate.estimated_days} jours</small>
                      )}
                      {rate.tracking && <small> • Avec suivi</small>}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>
                  Aucune option de livraison disponible
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===== STYLES =====
const styles = {
  widget: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    margin: '20px 0',
    overflow: 'hidden'
  },
  toggleButton: {
    width: '100%',
    padding: '12px 15px',
    border: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    padding: '15px'
  },
  section: {
    marginBottom: '15px'
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  addressForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  row: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px'
  },
  select: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff'
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    marginBottom: '8px'
  },
  productInfo: {
    flex: 1
  },
  warning: {
    display: 'block',
    color: '#e67700',
    fontSize: '12px',
    marginTop: '4px'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  quantityInput: {
    width: '60px',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'center'
  },
  estimateButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '10px'
  },
  error: {
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '4px',
    marginTop: '10px',
    fontSize: '14px'
  },
  results: {
    marginTop: '15px'
  },
  rateItem: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    marginBottom: '8px',
    border: '1px solid #e9ecef'
  },
  rateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  price: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0066cc'
  },
  rateDetails: {
    color: '#666',
    fontSize: '13px'
  },
  noResults: {
    padding: '12px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '6px',
    textAlign: 'center'
  }
};

// ===== INITIALISATION =====
function initWidget() {
  const containers = document.querySelectorAll('[data-devaito-widget]');
  
  containers.forEach(container => {
    const shopId = container.getAttribute('data-shop-id');
    
    if (!shopId) {
      console.error('DevaShip: data-shop-id manquant');
      return;
    }
    
    if (!container.dataset.initialized) {
      container.dataset.initialized = 'true';
      const root = ReactDOM.createRoot(container);
      root.render(<DevaitoWidget shopId={shopId} />);
      debugLog('Widget initialisé pour shop:', shopId);
    }
  });
}

// Lancement au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}

// Export pour utilisation comme module
export default DevaitoWidget;
// npm run build:widget