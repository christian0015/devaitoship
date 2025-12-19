//embed-projet/api.js
import { CONFIG, prodLog } from './config.js';
import { getShopBaseUrl } from './utils.js';
import { eventBus, EVENTS } from './EventBus.js';

class ApiService {
  constructor() {
    this.baseUrl = CONFIG.API_BASE;
  }

  async fetchShopData(shopId, productInfo) {
    try {
      eventBus.emit(EVENTS.LOADING_START, { action: 'fetchShopData' });
      
      prodLog.info(`Envoi requête avec ${productInfo.length} produits`);
      const res = await fetch(`${this.baseUrl}/get_shop_data_v2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shopId,
          products: productInfo,
          slugs: productInfo.filter(p => p.slug).map(p => p.slug),
          productIds: productInfo.filter(p => p.id).map(p => p.id)
        })
      });
      
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      
      const data = await res.json();
      prodLog.info("Réponse API reçue");
      
      eventBus.emit(EVENTS.LOADING_END, { action: 'fetchShopData' });
      return data;
    } catch (error) {
      eventBus.emit(EVENTS.ERROR, { 
        action: 'fetchShopData', 
        error: error.message 
      });
      throw error;
    }
  }

  async getShippingRates(shippingRequests) {
    try {
      eventBus.emit(EVENTS.LOADING_START, { action: 'getShippingRates' });
      
      const allRates = [];
      
      for (const req of shippingRequests) {
        prodLog.info(`Envoi requête pour ${req.parcels.length} colis`);
        const r = await fetch(`${this.baseUrl}/getRates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req)
        });
        
        if (!r.ok) throw new Error(`Erreur: ${r.status}`);
        
        const rates = await r.json();
        prodLog.info(`${rates.length} options reçues`);
        
        rates.forEach(rate => {
          rate.productId = 0;
          allRates.push(rate);
        });
      }
      
      eventBus.emit(EVENTS.LOADING_END, { action: 'getShippingRates' });
      eventBus.emit(EVENTS.SHIPPING_RESPONSE, { rates: allRates });
      
      return allRates;
    } catch (error) {
      eventBus.emit(EVENTS.ERROR, { 
        action: 'getShippingRates', 
        error: error.message 
      });
      throw error;
    }
  }

  async createLabel(payload) {
    try {
      eventBus.emit(EVENTS.LOADING_START, { action: 'createLabel' });
      
      prodLog.info("Envoi à l'API create-label:", payload);
      
      const response = await fetch(`${this.baseUrl}/create-label`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      prodLog.info("Réponse create-label:", result);
      
      eventBus.emit(EVENTS.LOADING_END, { action: 'createLabel' });
      eventBus.emit(EVENTS.VALIDATION_RESPONSE, { result });
      
      return result;
    } catch (error) {
      eventBus.emit(EVENTS.ERROR, { 
        action: 'createLabel', 
        error: error.message 
      });
      throw error;
    }
  }

  async loadCountries() {
    try {
      const baseUrl = getShopBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/ecommerce-core/get-countries`);
      if (!response.ok) throw new Error('Erreur de chargement des pays');
      
      const data = await response.json();
      // CORRECTION : S'assurer que tous les pays ont un code
      const countries = data.data?.countries || [];
      return countries.map(country => ({
        id: country.id,
        name: country.name,
        code: country.code || this.mapCountryIdToCode(country.id)
      }));
    } catch (error) {
      prodLog.error("Erreur chargement pays:", error);
      return [
        { id: '75', name: 'France', code: 'FR' },
        { id: '148', name: 'Maroc', code: 'MA' },
        { id: '50', name: 'République Démocratique du Congo', code: 'CD' }
      ];
    }
  }

  async loadStates(countryId) {
    if (!countryId) return [];
    
    try {
      const baseUrl = getShopBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/ecommerce-core/get-states-of-countries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_id: countryId })
      });
      
      if (!response.ok) throw new Error('Erreur de chargement des régions');
      
      const data = await response.json();
      return data.data?.states || [];
    } catch (error) {
      prodLog.error("Erreur chargement régions:", error);
      return [];
    }
  }

  async loadCities(stateId) {
    if (!stateId) return [];
    
    try {
      const baseUrl = getShopBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/ecommerce-core/get-cities-of-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state_id: stateId })
      });
      
      if (!response.ok) {
        // Si pas de villes disponibles, retourner un tableau vide
        return [];
      }
      
      const data = await response.json();
      return data.data?.cities || [];
    } catch (error) {
      prodLog.error("Erreur chargement villes:", error);
      return [];
    }
  }

  // Méthode utilitaire pour mapper les ID de pays aux codes
  mapCountryIdToCode(countryId) {
    const countryMap = {
      '50': 'CD',
      '75': 'FR',
      '148': 'MA'
    };
    return countryMap[countryId] || 'FR';
  }
}

let apiInstance = null;

export function getApiService() {
  if (!apiInstance) {
    apiInstance = new ApiService();
  }
  return apiInstance;
}