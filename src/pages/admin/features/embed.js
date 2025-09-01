// embed.js
'use client';
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

/**
 * DEVAITO SHIPPING WIDGET EMBARQUÉ
 * Widget React pour estimation des coûts de livraison
 * Compatible avec tous types de sites via injection de script
 */

// ===== CONFIGURATION =====
const DEVAITO_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.devaito.com',
  DEBUG: process.env.NODE_ENV === 'development'
};

const debugLog = (...args) => {
  if (DEVAITO_CONFIG.DEBUG) console.log('[DEVAITO WIDGET]', ...args);
};

// ===== COMPOSANT PRINCIPAL =====
function DevaitoShippingWidget({ shopId }) {
  // États principaux
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [pageType, setPageType] = useState('unknown');
  
  // États des données
  const [customerAddress, setCustomerAddress] = useState({
    name: '',
    company: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: 'FR'
  });
  
  const [products, setProducts] = useState([]);
  const [shopAddress, setShopAddress] = useState(null);
  const [parcels, setParcels] = useState([]);

  // ===== DÉTECTION TYPE DE PAGE ET INITIALISATION =====
  useEffect(() => {
    const path = window.location.pathname;
    debugLog('Initialisation widget, page:', path);
    
    if (path.includes('/product/') || path.includes('/produit/')) {
      setPageType('product');
      loadProductData();
    } else if (path.includes('/cart') || path.includes('/panier') || path.includes('/checkout')) {
      setPageType('cart');
      loadCartData();
    } else {
      setPageType('generic');
    }
    
    loadShopData();
    loadSavedAddress();
  }, [shopId]);

  // ===== CHARGEMENT DONNÉES PRODUIT (page produit) =====
  const loadProductData = async () => {
    try {
      const slug = window.location.pathname.split('/').pop();
      debugLog('Chargement produit:', slug);
      
      const response = await fetch(`${DEVAITO_CONFIG.API_BASE_URL}/api/get_product_by_slug/${slug}`);
      const productData = await response.json();
      
      if (productData.success) {
        const product = productData.data;
        setProducts([{
          id: product._id,
          name: product.name,
          quantity: 1,
          weight: product.weight || 1000, // grammes par défaut
          width: product.width || 20,
          height: product.height || 20,
          length: product.length || 20,
          units: product.units || 'cm',
          available_quantity: product.quantity || 1,
          shipping_address: product.shipping_address || null
        }]);
      }
    } catch (err) {
      debugLog('Erreur chargement produit:', err);
    }
  };

  // ===== CHARGEMENT DONNÉES PANIER (page cart) =====
  const loadCartData = () => {
    debugLog('Chargement panier depuis DOM...');
    
    // Extraction des données du panier depuis le DOM
    // Adaptez les sélecteurs selon votre structure HTML
    const cartItems = [];
    const cartElements = document.querySelectorAll('.cart-item, [data-cart-item], .product-line');
    
    cartElements.forEach((item, index) => {
      // Extraction du nom du produit
      const nameEl = item.querySelector('.product-name, [data-product-name], h3, .item-name');
      const name = nameEl ? nameEl.textContent.trim() : `Produit ${index + 1}`;
      
      // Extraction de la quantité
      const qtyEl = item.querySelector('input[name*="quantity"], .quantity-input, [data-quantity]');
      const quantity = qtyEl ? parseInt(qtyEl.value || qtyEl.textContent) : 1;
      
      // Extraction du poids/dimensions si disponible
      const weightEl = item.querySelector('[data-weight]');
      const weight = weightEl ? parseInt(weightEl.getAttribute('data-weight')) : 1000;
      
      cartItems.push({
        id: `cart-item-${index}`,
        name: name,
        quantity: quantity,
        weight: weight,
        width: 20,
        height: 20,
        length: 20,
        units: 'cm'
      });
    });
    
    if (cartItems.length > 0) {
      setProducts(cartItems);
      debugLog('Produits extraits du panier:', cartItems);
    }
  };

  // ===== CHARGEMENT DONNÉES SHOP =====
  const loadShopData = async () => {
    try {
      const response = await fetch(`${DEVAITO_CONFIG.API_BASE_URL}/api/shops/${shopId}`);
      const shopData = await response.json();
      
      if (shopData.success && shopData.data.shipping_address) {
        setShopAddress(shopData.data.shipping_address);
        debugLog('Adresse shop chargée:', shopData.data.shipping_address);
      }
    } catch (err) {
      debugLog('Erreur chargement shop:', err);
    }
  };

  // ===== SAUVEGARDE/CHARGEMENT ADRESSE CLIENT =====
  const loadSavedAddress = () => {
    const saved = localStorage.getItem('devaito_customer_address');
    if (saved) {
      try {
        setCustomerAddress(JSON.parse(saved));
      } catch (e) {
        debugLog('Erreur parsing adresse sauvée');
      }
    }
  };

  const saveAddress = (address) => {
    localStorage.setItem('devaito_customer_address', JSON.stringify(address));
  };

  // ===== GÉNÉRATION DES COLIS =====
  const generateParcels = () => {
    const generatedParcels = [];
    
    products.forEach(product => {
      for (let i = 0; i < product.quantity; i++) {
        generatedParcels.push({
          length: product.length || 20,
          width: product.width || 20,
          height: product.height || 20,
          distance_unit: product.units || 'cm',
          weight: (product.weight || 1000) / 1000, // Conversion en kg
          mass_unit: 'kg'
        });
      }
    });
    
    return generatedParcels;
  };

  // ===== ESTIMATION DES COÛTS =====
  const handleEstimateShipping = async () => {
    if (!customerAddress.street1 || !customerAddress.city || !shopAddress) {
      setError('Veuillez remplir l\'adresse de livraison complète');
      return;
    }

    if (products.length === 0) {
      setError('Aucun produit trouvé pour l\'estimation');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Sauvegarde de l'adresse
      saveAddress(customerAddress);

      // Génération des colis
      const parcelsToSend = generateParcels();
      
      // Préparation de la requête
      const requestData = {
        from: shopAddress,
        to: customerAddress,
        parcels: parcelsToSend,
        shop_id: shopId
      };

      debugLog('Données envoyées à l\'API:', requestData);

      const response = await fetch(`${DEVAITO_CONFIG.API_BASE_URL}/api/getRates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.rates);
        debugLog('Résultats reçus:', data.rates);
      } else {
        setError(data.message || 'Erreur lors de l\'estimation');
      }
    } catch (err) {
      debugLog('Erreur estimation:', err);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // ===== GESTION CHANGEMENT QUANTITÉ =====
  const updateProductQuantity = (productId, newQuantity) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, quantity: Math.max(1, Math.min(newQuantity, p.available_quantity || 99)) }
          : p
      )
    );
  };

  // ===== RENDU COMPOSANT =====
  return (
    <div className="devaito-shipping-widget" style={styles.widget}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          ...styles.toggleButton,
          backgroundColor: isVisible ? '#0066cc' : '#f0f0f0'
        }}
      >
        📦 Estimation coût de livraison
        <span style={styles.toggleArrow}>
          {isVisible ? '▼' : '▶'}
        </span>
      </button>

      {/* Widget Content */}
      {isVisible && (
        <div style={styles.content}>
          {/* Informations produits */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>
              {pageType === 'product' ? 'Produit' : 'Produits'} ({products.length})
            </h4>
            {products.map((product, index) => (
              <div key={product.id} style={styles.productItem}>
                <div style={styles.productInfo}>
                  <strong>{product.name}</strong>
                  <small style={styles.productDetails}>
                    {product.weight}g - {product.width}×{product.height}×{product.length}{product.units}
                  </small>
                </div>
                <div style={styles.quantityControl}>
                  <label>Qté:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.available_quantity || 99}
                    value={product.quantity}
                    onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value))}
                    style={styles.quantityInput}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Adresse de livraison */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Adresse de livraison</h4>
            <div style={styles.addressForm}>
              <div style={styles.row}>
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={customerAddress.name}
                  onChange={(e) => setCustomerAddress(prev => ({...prev, name: e.target.value}))}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Entreprise (optionnel)"
                  value={customerAddress.company}
                  onChange={(e) => setCustomerAddress(prev => ({...prev, company: e.target.value}))}
                  style={styles.input}
                />
              </div>
              <input
                type="text"
                placeholder="Adresse"
                value={customerAddress.street1}
                onChange={(e) => setCustomerAddress(prev => ({...prev, street1: e.target.value}))}
                style={{...styles.input, width: '100%'}}
              />
              <input
                type="text"
                placeholder="Complément d'adresse"
                value={customerAddress.street2}
                onChange={(e) => setCustomerAddress(prev => ({...prev, street2: e.target.value}))}
                style={{...styles.input, width: '100%'}}
              />
              <div style={styles.row}>
                <input
                  type="text"
                  placeholder="Ville"
                  value={customerAddress.city}
                  onChange={(e) => setCustomerAddress(prev => ({...prev, city: e.target.value}))}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Code postal"
                  value={customerAddress.zip}
                  onChange={(e) => setCustomerAddress(prev => ({...prev, zip: e.target.value}))}
                  style={styles.input}
                />
              </div>
              <div style={styles.row}>
                <input
                  type="text"
                  placeholder="État/Région"
                  value={customerAddress.state}
                  onChange={(e) => setCustomerAddress(prev => ({...prev, state: e.target.value}))}
                  style={styles.input}
                />
                <select
                  value={customerAddress.country}
                  onChange={(e) => setCustomerAddress(prev => ({...prev, country: e.target.value}))}
                  style={styles.select}
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

          {/* Bouton d'estimation */}
          <button
            onClick={handleEstimateShipping}
            disabled={loading}
            style={{
              ...styles.estimateButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Estimation en cours...' : '📊 Estimer les frais de port'}
          </button>

          {/* Affichage des erreurs */}
          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          {/* Affichage des résultats */}
          {results && results.length > 0 && (
            <div style={styles.results}>
              <h4 style={styles.sectionTitle}>Options de livraison disponibles</h4>
              {results.map((rate, index) => (
                <div key={index} style={styles.rateItem}>
                  <div style={styles.rateHeader}>
                    <strong>{rate.carrier} - {rate.service}</strong>
                    <span style={styles.price}>{rate.amount} {rate.currency}</span>
                  </div>
                  <div style={styles.rateDetails}>
                    <small>
                      Livraison estimée: {rate.estimated_days || 'Non spécifié'} jours
                      {rate.tracking && ' • Suivi inclus'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results && results.length === 0 && (
            <div style={styles.noResults}>
              ℹ️ Aucune option de livraison disponible pour cette destination
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===== STYLES CSS-IN-JS =====
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
    padding: '15px',
    border: 'none',
    backgroundColor: '#f0f0f0',
    color: '#333',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s'
  },
  toggleArrow: {
    transition: 'transform 0.2s'
  },
  content: {
    padding: '20px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
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
  productDetails: {
    display: 'block',
    color: '#666',
    marginTop: '4px'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  quantityInput: {
    width: '60px',
    padding: '4px 8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'center'
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
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px'
  },
  select: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff'
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
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '6px',
    marginTop: '10px'
  },
  results: {
    marginTop: '20px'
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
    marginBottom: '4px'
  },
  price: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0066cc'
  },
  rateDetails: {
    color: '#666'
  },
  noResults: {
    padding: '12px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '6px',
    marginTop: '10px',
    textAlign: 'center'
  }
};

// ===== INITIALISATION DU WIDGET =====
function initializeWidget() {
  // Recherche de tous les conteneurs de widget
  const containers = document.querySelectorAll('[data-devaito-widget]');
  
  containers.forEach(container => {
    const shopId = container.getAttribute('data-shop-id');
    
    if (!shopId) {
      console.error('DEVAITO WIDGET: data-shop-id manquant');
      return;
    }

    // Création du root React et rendu du widget
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(DevaitoShippingWidget, { shopId }));
    
    debugLog(`Widget initialisé pour shop ID: ${shopId}`);
  });
}

// ===== AUTO-INITIALISATION =====
// Démarrage automatique quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWidget);
} else {
  initializeWidget();
}

// Export pour utilisation en tant que module
export default DevaitoShippingWidget;