//embed-projet/utils.js
import { utils as configUtils } from './config.js';

// Ré-export des utilitaires pour éviter les dépendances circulaires
export const {
  isInBuilder,
  isSlugPage,
  isCartOrCheckoutPage,
  isProductPage,
  mapCountryIdToCode,
  getShopBaseUrl,
  formatPrice,
  isValidEmail,
  calculateAdjustedDimensions,
  getProductInfo,
  getFormDataFromPage
} = configUtils;

// Fonctions supplémentaires
export function setupPageFormSync(callback) {
  if (isProductPage() || isCartOrCheckoutPage()) {
    return;
  }
  
  const formFields = [
    '#fullname', '#email', '#phone', '#address', 
    '#postal-code', '#country', '#state', '#city',
    '[name="name"]', '[name="email"]', '[name="phone"]', '[name="address"]',
    '[name="zip"]', '[name="country"]', '[name="state"]', '[name="city"]'
  ];
  
  formFields.forEach(selector => {
    const fields = document.querySelectorAll(selector);
    fields.forEach(field => {
      field.addEventListener('input', callback);
      field.addEventListener('change', callback);
    });
  });
}

export function syncToPageForm(formData) {
  if (isProductPage() || isCartOrCheckoutPage()) {
    return;
  }
  
  const fieldMap = {
    'name': '#fullname, [name="name"], [name="fullname"]',
    'email': '#email, [name="email"]',
    'phone': '#phone, [name="phone"]',
    'street': '#address, [name="address"], [name="street"]',
    'zip': '#postal-code, [name="zip"], [name="postal_code"]',
    'city': '#city, [name="city"]',
    'state': '#state, [name="state"]',
    'country': '#country, [name="country"]'
  };
  
  Object.keys(fieldMap).forEach(key => {
    const selector = fieldMap[key];
    const field = document.querySelector(selector);
    if (field && formData[key]) {
      field.value = formData[key];
      const event = new Event('change', { bubbles: true });
      field.dispatchEvent(event);
    }
  });
}