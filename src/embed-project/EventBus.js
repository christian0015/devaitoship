//embed-projet/EvenBus.js
class EventBus extends EventTarget {
  constructor() {
    super();
  }

  // Méthodes utilitaires
  emit(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  on(eventName, handler) {
    this.addEventListener(eventName, handler);
    return () => this.off(eventName, handler);
  }

  off(eventName, handler) {
    this.removeEventListener(eventName, handler);
  }

  once(eventName, handler) {
    const onceHandler = (event) => {
      handler(event);
      this.off(eventName, onceHandler);
    };
    this.on(eventName, onceHandler);
  }
}

// Singleton EventBus
export const eventBus = new EventBus();

// Événements constants
export const EVENTS = {
  ADDRESS_CHANGE: 'addressChange',
  PRODUCTS_CHANGE: 'productsChange',
  RATES_CHANGE: 'ratesChange',
  FORM_STATUS_CHANGE: 'formStatusChange',
  SHIPPING_REQUEST: 'shippingRequest',
  SHIPPING_RESPONSE: 'shippingResponse',
  VALIDATION_REQUEST: 'validationRequest',
  VALIDATION_RESPONSE: 'validationResponse',
  ERROR: 'error',
  LOADING_START: 'loadingStart',
  LOADING_END: 'loadingEnd'
};