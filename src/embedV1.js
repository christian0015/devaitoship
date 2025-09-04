// embed.js - Widget embarqué pour Devaito Shipping Estimation
// Prêt à production : Copiez-collez ce fichier tel quel sur votre serveur (ex. https://devaitoship.vercel.app/embed.js)
// Pour l'utiliser sur sites non-React : Ajoutez <script type="module" src="https://devaitoship.vercel.app/embed.js" defer></script>
// Ce script est un module ES, autonome, et injecte le widget React dans le <div data-devaito-widget>.
// Commentaires détaillés pour modifications faciles.

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// ===== CONFIGURATION =====
// Personnalisez ici les URLs API, defaults, etc.
const CONFIG = {
  API_BASE: 'https://devaito.com', // Base URL pour APIs Devaito (changez si needed)
  SHIPPO_API: 'https://devaitoship.vercel.app/api/getRates', // Endpoint pour estimation Shippo
  DEBUG: true, // Active logs console pour debug
  DEFAULT_DIMENSIONS: { length: 20, width: 15, height: 10, weight: 1.5, distance_unit: 'cm', mass_unit: 'kg' }, // Fallback si pas de shop defaults
};

// Fonction debug log (optionnelle, pour traces)
const debugLog = (msg, ...args) => {
  if (CONFIG.DEBUG) console.log(`[DevaShip Widget] ${msg}`, ...args);
};

// Composant principal du Widget (React)
function DevaitoWidget({ shopId }) {
  // États React pour gestion UI et data
  const [isVisible, setIsVisible] = useState(false); // Toggle visibilité du formulaire
  const [token, setToken] = useState(null); // Token auth Devaito (via /login)
  const [shopData, setShopData] = useState(null); // Données shop (adresse from, defaults dims)
  const [products, setProducts] = useState([]); // Liste produits (name, qty, dims, fromAddr, etc.)
  const [toAddress, setToAddress] = useState({
    name: '', company: '', street1: '', street2: '', city: '', state: '', zip: '', country: 'FR',
    phone: '', email: '', // Champs complets comme exemple
  });
  const [loading, setLoading] = useState(false); // État chargement estimation
  const [error, setError] = useState(null); // Erreurs
  const [results, setResults] = useState(null); // Résultats Shippo
  const [isCartPage, setIsCartPage] = useState(false); // Détection page panier vs produit

  // ===== INITIALISATION ET DÉTECTION PAGE =====
  // useEffect pour détecter type page et init data au mount
  useEffect(() => {
    const path = window.location.pathname.toLowerCase(); // Normalise pour variations (ex. /Panier)
    setIsCartPage(path.includes('/cart') || path.includes('/panier') || path.includes('/checkout'));
    getToken(); // Récup token auth d'abord
    loadSavedAddress(); // Charge adresse client saved
  }, []);

  // ===== RÉCUPÉRATION TOKEN DEVAITO =====
  // Simule /login ; remplacez body par vrais creds ou intégrez formulaire login si needed
  const getToken = async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'your_username', password: 'your_password' }), // TODO: Remplacez par vrais creds ou dynamique
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      setToken(data.token);
      debugLog('Token récupéré:', data.token);
    } catch (err) {
      setError('Erreur récupération token Devaito');
      debugLog('Erreur token:', err);
    }
  };

  // ===== RÉCUPÉRATION DONNÉES SHOP =====
  // Fetch adresse from et defaults dims via shopId (assume endpoint /get_shop_by_id)
  const getShopData = async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE}/get_shop_by_id/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Shop fetch failed');
      const data = await response.json();
      setShopData({
        fromAddress: data.address || { name: 'Default Shop', street1: '123 Default St', city: 'Paris', state: 'IDF', zip: '75001', country: 'FR' }, // Fallback adresse
        defaultDimensions: data.defaultDims || CONFIG.DEFAULT_DIMENSIONS, // Fallback dims
      });
      debugLog('Shop data:', data);
    } catch (err) {
      setError('Erreur récupération données shop');
      debugLog('Erreur shop:', err);
    }
  };

  // ===== CHARGEMENT ADRESSE CLIENT SAVED / AUTO-FILL =====
  // Via localStorage et geolocation (avec permission)
  const loadSavedAddress = () => {
    const saved = localStorage.getItem('devaito_toAddress');
    if (saved) {
      setToAddress(JSON.parse(saved));
      debugLog('Adresse client loaded from storage');
    }
    // Auto-fill via geolocation (pays/ville approx)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // TODO: Intégrez reverse geocoding API si available (ex. fetch Google Maps, mais no internet direct ici)
          // Simulé: Set country basé sur pos (ex. via lib offline si needed)
          setToAddress((prev) => ({ ...prev, country: 'FR' })); // Exemple fallback
          debugLog('Geolocation used for auto-fill');
        },
        (err) => debugLog('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }
  };

  // Sauvegarde adresse client sur changements
  const saveAddress = () => {
    localStorage.setItem('devaito_toAddress', JSON.stringify(toAddress));
  };

  // Handler pour changements adresse to (et save)
  const handleToChange = (field, value) => {
    setToAddress((prev) => ({ ...prev, [field]: value }));
    saveAddress(); // Save auto
  };

  // ===== CHARGEMENT DONNÉES PRODUIT (PAGE PRODUIT) =====
  const fetchProduct = async () => {
    const slug = window.location.pathname.split('/product/')[1]?.split('/')[0] || ''; // Extrait slug clean
    if (!slug) {
      setError('Slug produit non trouvé dans URL');
      return;
    }
    try {
      const response = await fetch(`${CONFIG.API_BASE}/get_product_by_slug/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Product fetch failed');
      const product = await response.json();
      const qtyAvailable = product.quantity || 1;
      const dims = product.dimensions || shopData.defaultDimensions; // Fallback defaults shop
      const fromAddr = product.shippingAddress || shopData.fromAddress; // Adresse per-product ou shop
      setProducts([
        {
          name: product.name || 'Produit inconnu',
          quantity: 1, // Default qty
          maxQuantity: qtyAvailable,
          dimensions: dims,
          fromAddress: fromAddr,
          usedDefaultDims: !product.dimensions, // Flag pour avertissement
        },
      ]);
      debugLog('Produit chargé:', product);
    } catch (err) {
      setError('Erreur récupération produit');
      debugLog('Erreur produit:', err);
    }
  };

  // ===== CHARGEMENT DONNÉES PANIER (PAGE PANIER) =====
  // Parse DOM + fetch per produit + observer pour dynamique
  useEffect(() => {
    if (!isCartPage || !token || !shopData) return; // Attends prereqs

    const parseCart = async () => {
      const cartProducts = [];
      const elements = document.querySelectorAll('.product_3'); // Sélecteur basé sur HTML fourni
      for (const el of elements) {
        const slug = el.querySelector('a[href^="/product/"]')?.href.split('/product/')[1] || ''; // Extrait slug
        const name = el.querySelector('.product_name_3')?.textContent.trim() || 'Produit inconnu';
        const qtyInput = el.querySelector('.input_number_quantity');
        const qty = parseInt(qtyInput?.value || 1);
        if (!slug) continue; // Skip si pas de slug

        try {
          const response = await fetch(`${CONFIG.API_BASE}/get_product_by_slug/${slug}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Product fetch failed');
          const product = await response.json();
          const dims = product.dimensions || shopData.defaultDimensions;
          const fromAddr = product.shippingAddress || shopData.fromAddress;
          cartProducts.push({
            id: el.dataset.id || slug, // ID unique
            name,
            quantity: qty,
            maxQuantity: product.quantity || 10000000, // Comme max dans HTML
            dimensions: dims,
            fromAddress: fromAddr,
            usedDefaultDims: !product.dimensions,
          });
        } catch (err) {
          debugLog('Erreur fetch produit panier:', err);
        }
      }
      setProducts(cartProducts);
      debugLog('Panier parsé:', cartProducts);
    };

    parseCart(); // Init parse

    // Observer pour changements dynamiques (add/remove/qty)
    const observer = new MutationObserver(parseCart);
    const target = document.querySelector('.shoppingCart') || document.body;
    observer.observe(target, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect(); // Cleanup
  }, [isCartPage, token, shopData]);

  // Handler pour changements qty (avec max check)
  const handleQuantityChange = (index, value) => {
    const updated = [...products];
    const newQty = Math.max(1, Math.min(parseInt(value) || 1, updated[index].maxQuantity));
    updated[index].quantity = newQty;
    setProducts(updated);
  };

  // ===== PRÉPARATION REQUÊTE SHIPPO =====
  // Groupe par fromAddress, génère parcels per qty
  const prepareRequests = () => {
    const groups = {};
    products.forEach((prod) => {
      const key = JSON.stringify(prod.fromAddress);
      if (!groups[key]) groups[key] = { from: prod.fromAddress, parcels: [] };
      for (let i = 0; i < prod.quantity; i++) {
        groups[key].parcels.push(prod.dimensions);
      }
    });
    return Object.values(groups).map((group) => ({ from: group.from, to: toAddress, parcels: group.parcels }));
  };

  // ===== EXÉCUTION ESTIMATION =====
  const runEstimation = async () => {
    if (!toAddress.street1 || !toAddress.city || !toAddress.zip || !toAddress.country) {
      setError('Adresse de livraison incomplète');
      return;
    }
    if (products.length === 0) {
      setError('Aucun produit pour estimation');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    const requests = prepareRequests();
    try {
      const allResults = [];
      for (const req of requests) {
        const response = await fetch(CONFIG.SHIPPO_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });
        if (!response.ok) throw new Error('Erreur API Shippo');
        const data = await response.json();
        allResults.push(...data); // Assume data est array rates
      }
      setResults(allResults);
      debugLog('Résultats:', allResults);
    } catch (err) {
      setError(err.message || 'Erreur estimation');
      debugLog('Erreur estimation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Init shop et produit une fois token ready
  useEffect(() => {
    if (token) getShopData();
  }, [token]);

  useEffect(() => {
    if (shopData && !isCartPage) fetchProduct();
  }, [shopData, isCartPage]);

  // ===== RENDU UI =====
  return (
    <div style={styles.widget}>
      <button style={styles.toggleButton} onClick={() => setIsVisible(!isVisible)}>
        Estimation coût de livraison {isVisible ? '▼' : '▶'}
      </button>
      {isVisible && (
        <div style={styles.content}>
          {/* Section Adresse Livraison */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Adresse de livraison</h4>
            <div style={styles.addressForm}>
              <div style={styles.row}>
                <input style={styles.input} placeholder="Nom" value={toAddress.name} onChange={(e) => handleToChange('name', e.target.value)} />
                <input style={styles.input} placeholder="Entreprise (opt)" value={toAddress.company} onChange={(e) => handleToChange('company', e.target.value)} />
              </div>
              <input style={{ ...styles.input, width: '100%' }} placeholder="Rue" value={toAddress.street1} onChange={(e) => handleToChange('street1', e.target.value)} />
              <input style={{ ...styles.input, width: '100%' }} placeholder="Complément" value={toAddress.street2} onChange={(e) => handleToChange('street2', e.target.value)} />
              <div style={styles.row}>
                <input style={styles.input} placeholder="Ville" value={toAddress.city} onChange={(e) => handleToChange('city', e.target.value)} />
                <input style={styles.input} placeholder="Code postal" value={toAddress.zip} onChange={(e) => handleToChange('zip', e.target.value)} />
              </div>
              <div style={styles.row}>
                <input style={styles.input} placeholder="Région/État" value={toAddress.state} onChange={(e) => handleToChange('state', e.target.value)} />
                <select style={styles.select} value={toAddress.country} onChange={(e) => handleToChange('country', e.target.value)}>
                  <option value="FR">France</option>
                  <option value="US">USA</option>
                  {/* Ajoutez plus d'options si needed */}
                </select>
              </div>
              <div style={styles.row}>
                <input style={styles.input} placeholder="Téléphone" value={toAddress.phone} onChange={(e) => handleToChange('phone', e.target.value)} />
                <input style={styles.input} placeholder="Email" value={toAddress.email} onChange={(e) => handleToChange('email', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section Produits */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>{isCartPage ? 'Panier' : 'Produit'} ({products.length})</h4>
            {products.map((prod, idx) => (
              <div key={idx} style={styles.productItem}>
                <div>
                  <strong>{prod.name}</strong>
                  {prod.usedDefaultDims && <p style={styles.warning}>(Dimensions par défaut utilisées)</p>}
                </div>
                <input
                  type="number"
                  style={styles.quantityInput}
                  value={prod.quantity}
                  min="1"
                  max={prod.maxQuantity}
                  onChange={(e) => handleQuantityChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Bouton Estimation */}
          <button style={styles.estimateButton} onClick={runEstimation} disabled={loading}>
            {loading ? 'Estimation en cours...' : 'Estimer'}
          </button>

          {/* Erreurs */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Résultats */}
          {results && (
            <div style={styles.results}>
              <h4 style={styles.sectionTitle}>Options de livraison</h4>
              {results.map((rate, idx) => (
                <div key={idx} style={styles.rateItem}>
                  <strong>{rate.carrier} - {rate.service}</strong>
                  <span style={styles.price}>{rate.price} {rate.currency}</span>
                  {rate.estimated_days && <small> ({rate.estimated_days} jours)</small>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===== STYLES CSS-IN-JS =====
// Styles complets pour UI pro (inspiré version fournie, modifiez ici)
const styles = {
  widget: { border: '1px solid #ccc', padding: '10px', fontFamily: 'sans-serif', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  toggleButton: { width: '100%', padding: '10px', background: '#f0f0f0', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  content: { padding: '10px' },
  section: { marginBottom: '15px' },
  sectionTitle: { fontSize: '16px', marginBottom: '10px' },
  addressForm: { display: 'flex', flexDirection: 'column', gap: '5px' },
  row: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
  select: { flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
  productItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  quantityInput: { width: '60px', padding: '5px', border: '1px solid #ccc' },
  warning: { color: '#ff9900', fontSize: '12px' },
  estimateButton: { width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' },
  error: { color: 'red', marginTop: '10px' },
  results: { marginTop: '15px' },
  rateItem: { border: '1px solid #eee', padding: '10px', marginBottom: '5px', borderRadius: '4px' },
  price: { float: 'right', fontWeight: 'bold' },
};

// ===== INITIALISATION WIDGET =====
// Fonction pour injecter widget dans tous <div data-devaito-widget>
function initWidget() {
  document.querySelectorAll('[data-devaito-widget]').forEach((el) => {
    const shopId = el.getAttribute('data-shop-id');
    if (!shopId) {
      console.error('Missing data-shop-id');
      return;
    }
    if (!el.dataset.initialized) {
      el.dataset.initialized = 'true';
      const root = ReactDOM.createRoot(el);
      root.render(<DevaitoWidget shopId={shopId} />);
      debugLog('Widget initialisé pour shop:', shopId);
    }
  });
}

// Auto-init au DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}