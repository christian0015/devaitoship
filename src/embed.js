// embed.js - Devaito Shipping Widget (on-demand fetch)
// <div data-devaito-widget data-shop-id="..."></div>
// <script type="module" src="http://localhost:3000/embed.js" defer></script>

import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const CONFIG = {
  API_BASE: "http://localhost:3000/api",
  DEBUG: true,
};
const debugLog = (...args) => CONFIG.DEBUG && console.log("[Devaito]", ...args);

function DevaitoWidget({ shopId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [toAddress, setToAddress] = useState({
    name: "", company: "", street1: "123 Street", street2: "",
    city: "paris", state: "", zip: "20000", country: "FR", phone: "+1 23294349", email: "christi@gmail.com"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  // --- Détecte les slugs ---
  const getSlugs = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/cart") || path.includes("/panier")) {
      const slugs = [];
      document.querySelectorAll('a[href*="/product/"]').forEach((a) => {
        const slug = a.href.split("/product/")[1]?.split("/")[0];
        if (slug && !slugs.includes(slug)) slugs.push(slug);
      });
      debugLog("[Devaito] Page d&eacute;tect&eacute;e: Panier");
      alert(`Devaito: Page Panier détectée avec slugs: ${slugs.join(", ")}`);
      return slugs;
    }
    const slug = path.split("/product/")[1]?.split("/")[0];
    debugLog("[Devaito] Page d&eacute;tect&eacute;e: Produit");
    alert(`Devaito: Page Produit détectée avec slug: ${slug}`);
    return slug ? [slug] : [];
  };

  // --- Fetch shop + produits ---
  const fetchShopData = async () => {
    try {
      let slugs = getSlugs();
      if (!slugs.length) slugs = ["product-2"];
      debugLog("[Devaito] Requête shop avec slugs:", slugs);
      alert(`Devaito: Récupération des produits...`);

      const res = await fetch(`${CONFIG.API_BASE}/get_shop_by_id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, slugs }),
      });

      if (!res.ok) throw new Error("Erreur API shop");
      const data = await res.json();

      setShopData(data.shop);
      const prods = data.products.map((p) => ({
        name: p.name,
        quantity: p.quantity,
        maxQuantity: p.quantity || 99,
        dimensions: p.dimensions,
        fromAddress: p.shippingAddress,
        usedDefaultDims: p.usedDefaultDims,
      }));
      setProducts(prods);
      debugLog("[Devaito] Produits récupérés:", prods);
      alert(`Devaito: ${prods.length} produits détectés`);
      return prods;
    } catch (err) {
      setError(err.message);
      debugLog("[Devaito] Erreur shop:", err);
      alert(`Devaito Erreur: ${err.message}`);
      return [];
    }
  };

  // --- Prépare payload Shippo ---
  const prepareRequests = (currentProducts) => {
    const groups = {};
    currentProducts.forEach((prod) => {
      const key = JSON.stringify(prod.fromAddress);
      if (!groups[key]) groups[key] = { from: prod.fromAddress, parcels: [] };
      for (let i = 0; i < prod.quantity; i++) groups[key].parcels.push(prod.dimensions);
    });
    return Object.values(groups).map((g) => ({ from: g.from, to: toAddress, parcels: g.parcels }));
  };

  // --- Estimation complète ---
  const runEstimation = async () => {
    setError(null);
    setResults(null);

    if (!toAddress.street1 || !toAddress.city || !toAddress.zip || !toAddress.country || !toAddress.email) {
      setError("Adresse de livraison incomplète");
      alert("Devaito: Adresse de livraison incomplète");
      return;
    }

    setLoading(true);
    setIsVisible(true); // Déplier immédiatement
    try {
      const currentProducts = await fetchShopData();
      if (!currentProducts.length) throw new Error("Aucun produit pour estimation");

      const reqs = prepareRequests(currentProducts);
      debugLog("[Devaito] Payload Shippo préparé:", reqs);
      alert("Devaito: Préparation estimation en cours...");

      const allRates = [];
      for (const req of reqs) {
        const r = await fetch(`${CONFIG.API_BASE}/getRates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        });
        if (!r.ok) throw new Error("Erreur API Shippo");
        const rates = await r.json();
        allRates.push(...rates);
      }

      setResults(allRates);
      debugLog("[Devaito] Estimation reçue:", allRates);
      alert("Devaito: Estimation terminée");
    } catch (err) {
      setError(err.message);
      alert(`Devaito Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const saveAddress = () => localStorage.setItem("devaito_toAddress", JSON.stringify(toAddress));
  const handleToChange = (field, value) => { 
    setToAddress((p) => ({ ...p, [field]: value })); 
    saveAddress(); 
  };

  // --- UI ---
  return (
    <div style={styles.widget}>
      <button style={styles.toggleButton} onClick={runEstimation}>
        {loading ? "Calcul..." : `Estimation livraison ${isVisible ? "▲" : "▼"}`}
      </button>
      {isVisible && (
        <div style={styles.content}>
          {/* Adresse */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Adresse de livraison</h4>
            <div style={styles.addressForm}>
              <input style={styles.input} placeholder="Nom" value={toAddress.name} onChange={(e) => handleToChange("name", e.target.value)} />
              <input style={styles.input} placeholder="Rue" value={toAddress.street1} onChange={(e) => handleToChange("street1", e.target.value)} />
              <input style={styles.input} placeholder="Ville" value={toAddress.city} onChange={(e) => handleToChange("city", e.target.value)} />
              <input style={styles.input} placeholder="Code postal" value={toAddress.zip} onChange={(e) => handleToChange("zip", e.target.value)} />  
              <input style={styles.input} placeholder="Téléphone" value={toAddress.phone} onChange={(e) => handleToChange("phone", e.target.value)} />
              <input style={styles.input} placeholder="Email" value={toAddress.email} onChange={(e) => handleToChange("email", e.target.value)} />
              <select style={styles.input} value={toAddress.country} onChange={(e) => handleToChange("country", e.target.value)}>
                <option value="FR">France</option><option value="US">USA</option>
              </select>
            </div>
          </div>

          {/* Produits */}
          {products.length > 0 && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Produits ({products.length})</h4>
              {products.map((p, i) => (
                <div key={i} style={styles.productItem}>
                  <span>{p.name}</span>
                  <input
                    type="number"
                    style={styles.qty}
                    value={p.quantity}
                    min="1"
                    max={p.maxQuantity}
                    onChange={(e) => {
                      const n = [...products];
                      n[i].quantity = Math.max(1, parseInt(e.target.value) || 1);
                      setProducts(n);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Résultats */}
          {error && <div style={styles.error}>{error}</div>}
          {results && (
            <div style={styles.results}>
              <h4>Options</h4>
              {results.map((r, i) => (
                <div key={i}>{r.carrier} - {r.service} : {r.price} {r.currency}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  widget: { border: "1px solid #ccc", borderRadius: 8, padding: 10, fontFamily: "sans-serif", background: "#fff" },
  toggleButton: { width: "100%", padding: 10, fontWeight: "bold", cursor: "pointer" },
  content: { marginTop: 10 },
  section: { marginBottom: 15 },
  sectionTitle: { marginBottom: 5 },
  addressForm: { display: "flex", flexDirection: "column", gap: 5 },
  input: { padding: 8, border: "1px solid #ccc", borderRadius: 4 },
  productItem: { display: "flex", justifyContent: "space-between", marginBottom: 5 },
  qty: { width: 50, padding: 5 },
  estimateButton: { width: "100%", padding: 10, background: "#007bff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" },
  error: { color: "red", marginTop: 10 },
  results: { marginTop: 10 },
};

function initWidget() {
  document.querySelectorAll("[data-devaito-widget]").forEach((el) => {
    if (!el.dataset.initialized) {
      const shopId = el.getAttribute("data-shop-id");
      if (!shopId) return console.error("data-shop-id manquant");
      el.dataset.initialized = "true";
      ReactDOM.createRoot(el).render(<DevaitoWidget shopId={shopId} />);
      debugLog("[Devaito] Widget initialisé");
      alert("Devaito Widget initialisé");
    }
  });
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initWidget)
  : initWidget();
