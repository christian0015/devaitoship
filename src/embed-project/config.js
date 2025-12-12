//embed-projet/config.js
export const CONFIG = {
  API_BASE: "https://devaitoship.vercel.app/api",
  DEBUG: true,
  MAX_HEIGHT: 100,
  DEFAULT_DIMENSIONS: {
    length: 20,
    width: 15,
    height: 10,
    weight: 1.5,
    distance_unit: 'cm',
    mass_unit: 'kg'
  }
};

// Fonctions utilitaires
export const utils = {
  // Vérification des pages
  isInBuilder: () => window.location.href.includes('/admin/builder'),
  
  isSlugPage: () => {
    const path = window.location.pathname.toLowerCase();
    return path.includes("/checkout") || 
           path.includes("/cart") || 
           path.includes("/panier") || 
           path.includes("/product/") || 
           path.includes("/products/");
  },
  
  isCartOrCheckoutPage: () => {
    const path = window.location.pathname.toLowerCase();
    return path.includes("/cart") || path.includes("/panier") || path.includes("/checkout");
  },
  
  isProductPage: () => {
    const path = window.location.pathname.toLowerCase();
    return path.includes("/product/") || path.includes("/products/");
  },
  
  // Mappage des pays
  mapCountryIdToCode: (countryId) => {
    const countryMap = {
      '50': 'CD',
      '75': 'FR',
      '148': 'MA'
    };
    return countryMap[countryId] || 'FR';
  },
  
  getShopBaseUrl: () => window.location.origin,
  
  formatPrice: (amount, currency = 'EUR') => {
    return `${parseFloat(amount).toFixed(2)} ${currency}`;
  },
  
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  calculateAdjustedDimensions: (baseDimensions, quantity) => {
    const MAX_HEIGHT = CONFIG.MAX_HEIGHT;
    const baseHeight = baseDimensions.height || 10;
    const baseWidth = baseDimensions.width || 15;
    const baseLength = baseDimensions.length || 20;
    const baseWeight = baseDimensions.weight || 1.5;
    
    let adjustedHeight = baseHeight * quantity;
    let adjustedWidth = baseWidth;
    let adjustedLength = baseLength;
    
    if (adjustedHeight > MAX_HEIGHT) {
      const stacks = Math.ceil(adjustedHeight / MAX_HEIGHT);
      adjustedHeight = MAX_HEIGHT;
      adjustedWidth = baseWidth * stacks;
    }
    
    return {
      length: adjustedLength,
      width: adjustedWidth,
      height: adjustedHeight,
      weight: baseWeight * quantity,
      distance_unit: baseDimensions.distance_unit || 'cm',
      mass_unit: baseDimensions.mass_unit || 'kg'
    };
  },
  
  // Récupération des produits depuis le DOM/LocalStorage
  getProductInfo: () => {
    const path = window.location.pathname.toLowerCase();
    let products = [];

    if (utils.isCartOrCheckoutPage()) {
      let cartItems = JSON.parse(localStorage.getItem('cartItems') || localStorage.getItem('checkoutItemsValide') || '[]');
      
      if (cartItems.length > 0) {
        products = cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));
      } else {
        document.querySelectorAll('.cart-item, .product-item, .order-item').forEach(item => {
          const nameElement = item.querySelector('.product-name, .item-name');
          const quantityInput = item.querySelector('input[type="number"]');
          const id = item.getAttribute('data-product-id') || item.getAttribute('data-id');
          
          if (nameElement) {
            products.push({
              id: id,
              name: nameElement.textContent.trim(),
              quantity: quantityInput ? parseInt(quantityInput.value) || 1 : 1
            });
          }
        });
      }
    } else if (utils.isProductPage()) {
      const slug = path.split("/product/")[1]?.split("/")[0] || 
                   path.split("/products/")[1]?.split("/")[0];
      if (slug) {
        const productNameElement = document.querySelector('h1.product-title, h1.product-name');
        const quantityInput = document.querySelector('input[type="number"].quantity-input');
        
        products.push({
          slug: slug,
          name: productNameElement ? productNameElement.textContent.trim() : 'Produit',
          quantity: quantityInput ? parseInt(quantityInput.value) || 1 : 1
        });
      }
    }
    
    if (products.length === 0) {
      products = [{name: "Product Demo", quantity: 1}];
    }
    
    return products;
  },
  
  // Récupérer les données du formulaire de la page
  getFormDataFromPage: () => {
    if (utils.isProductPage() || utils.isCartOrCheckoutPage()) {
      return {};
    }
    
    const formData = {};
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
      if (field) {
        formData[key] = field.value;
      }
    });
    
    return formData;
  }
};

// Logger
export const prodLog = {
  info: (...args) => console.log("[DEV]", ...args),
  error: (...args) => console.error("[DEV-ERR]", ...args),
  debug: (...args) => CONFIG.DEBUG && console.log("[DEV-DBG]", ...args)
};