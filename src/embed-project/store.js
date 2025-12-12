//embed-projet/store.js
import { eventBus } from './EventBus.js';
import { prodLog } from './config.js';

// Store global réactif
class Store {
  constructor() {
    this.state = {
      shopId: null,
      isFloating: false,
      clientAddress: {
        name: '',
        street1: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        country: 'FR'
      },
      products: [],
      selectedRates: {},
      formStatus: 'invalid',
      isLoading: false,
      error: null,
      shippingRates: [],
      shipmentData: null
    };
    
    this.subscribers = new Set();
  }

  // Méthodes pour mettre à jour l'état
  setState(updates) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Notifier les changements
    this.notifySubscribers(oldState, this.state);
    
    // Émettre des événements spécifiques
    if (updates.clientAddress && oldState.clientAddress !== updates.clientAddress) {
      eventBus.dispatchEvent(new CustomEvent('addressChange', { 
        detail: updates.clientAddress 
      }));
    }
    
    if (updates.products && oldState.products !== updates.products) {
      eventBus.dispatchEvent(new CustomEvent('productsChange', { 
        detail: updates.products 
      }));
    }
    
    if (updates.selectedRates && oldState.selectedRates !== updates.selectedRates) {
      eventBus.dispatchEvent(new CustomEvent('ratesChange', { 
        detail: updates.selectedRates 
      }));
    }
  }

  // Getters spécifiques
  getClientAddress() {
    return this.state.clientAddress;
  }

  getProducts() {
    return this.state.products;
  }

  getSelectedRates() {
    return this.state.selectedRates;
  }

  getFormStatus() {
    return this.state.formStatus;
  }

  // Abonnement aux changements
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(oldState, newState) {
    this.subscribers.forEach(callback => callback(oldState, newState));
  }

  // Méthodes utilitaires
  isFormValid() {
    const addr = this.state.clientAddress;
    return addr.street1 && addr.city && addr.zip && addr.email && addr.country;
  }

  getTotalPrice() {
    return Object.values(this.state.selectedRates).reduce((total, rate) => {
      return total + (parseFloat(rate.price) || 0);
    }, 0);
  }

  clearError() {
    this.setState({ error: null });
  }

  setError(message) {
    this.setState({ error: message });
    prodLog.error("Store error:", message);
  }
}

// Singleton store
let storeInstance = null;

export function initStore(initialState = {}) {
  if (!storeInstance) {
    storeInstance = new Store();
    storeInstance.setState(initialState);
    window.__DEVAITO_STORE__ = storeInstance;
  }
  return storeInstance;
}

export function getStore() {
  if (!storeInstance) {
    throw new Error('Store non initialisé. Appelez initStore() d\'abord.');
  }
  return storeInstance;
}

export function useStore() {
  return getStore();
}