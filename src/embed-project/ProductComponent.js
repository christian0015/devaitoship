//embed-projet/ProductComponent.js
import { getStore } from './store.js';
import { eventBus, EVENTS } from './EventBus.js';
import { getApiService } from './api.js';
import { prodLog, utils } from './config.js';

export class ProductComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.isFloating = options.isFloating || false;
    this.store = getStore();
    this.api = getApiService();
    
    this.elements = {
      productsSection: null,
      productsContainer: null
    };
  }

  init() {
    this.render();
    this.bindEvents();
    this.loadProducts();
  }

  render() {
    this.elements.productsSection = document.createElement("div");
    this.elements.productsSection.style.cssText = "margin-bottom: 20px;";
    
    const productsTitle = document.createElement("h4");
    productsTitle.textContent = "Produits";
    productsTitle.style.cssText = "margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";
    
    this.elements.productsContainer = document.createElement("div");
    this.elements.productsContainer.id = "devaito-products";
    this.elements.productsContainer.style.cssText = "margin-bottom: 20px;";
    
    this.elements.productsSection.appendChild(productsTitle);
    this.elements.productsSection.appendChild(this.elements.productsContainer);
    
    // Trouver le contenu pour ajouter la section
    const content = document.getElementById("devaito-content") || 
                   this.container.querySelector(".devaito-floating-content");
    if (content) {
      content.appendChild(this.elements.productsSection);
    }
  }

  async loadProducts() {
    try {
      const productInfo = this.getProductInfo();
      const storeState = this.store.state;
      
      const data = await this.api.fetchShopData(storeState.shopId, productInfo);
      
      const products = data.products.map((p, index) => {
        const fromAddress = p.shippingAddress || data.shop.address || {
          name: data.shop.name,
          street1: '123 Default Street',
          city: 'Paris',
          state: 'IDF',
          zip: '75001',
          country: 'FR'
        };
        
        const productName = (utils.isCartOrCheckoutPage() && productInfo[index] && productInfo[index].name) 
          ? productInfo[index].name 
          : p.name;
        
        return {
          id: index,
          name: productName,
          quantity: productInfo[index] ? productInfo[index].quantity : 1,
          dimensions: p.dimensions,
          fromAddress: fromAddress 
        };
      });
      
      this.store.setState({ products });
      this.renderProducts(products);
      
    } catch (error) {
      prodLog.error("Erreur chargement produits:", error);
      eventBus.emit(EVENTS.ERROR, { 
        action: 'loadProducts', 
        error: error.message 
      });
    }
  }

  getProductInfo() {
    const path = window.location.pathname.toLowerCase();
    let products = [];

    if (utils.isCartOrCheckoutPage()) {
      // Récupérer depuis localStorage
      let cartItems = JSON.parse(localStorage.getItem('cartItems') || localStorage.getItem('checkoutItemsValide') || '[]');
      
      if (cartItems.length > 0) {
        products = cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));
      } else {
        // Fallback DOM
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
  }

  renderProducts(products) {
    this.elements.productsContainer.innerHTML = "";
    
    if (products.length === 0) {
      this.elements.productsContainer.innerHTML = "<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible";
      return;
    }
    
    products.forEach(p => {
      const productCard = document.createElement("div");
      productCard.className = "devaito-product-item";
      
      const productInfoDiv = document.createElement("div");
      productInfoDiv.className = "devaito-product-info";
      
      const productName = document.createElement("div");
      productName.className = "devaito-product-name";
      productName.textContent = p.name;
      
      const productDetails = document.createElement("div");
      productDetails.className = "devaito-product-details";
      productDetails.textContent = `${p.dimensions.length}×${p.dimensions.width}×${p.dimensions.height}cm, ${p.quantity} unité(s)`;
      
      productInfoDiv.appendChild(productName);
      productInfoDiv.appendChild(productDetails);
      
      const quantityDisplay = document.createElement("div");
      quantityDisplay.className = "devaito-product-quantity";
      quantityDisplay.textContent = p.quantity;
      quantityDisplay.readOnly = true;
      
      productCard.appendChild(productInfoDiv);
      productCard.appendChild(quantityDisplay);
      this.elements.productsContainer.appendChild(productCard);
    });
  }

  prepareShippingRequests() {
    const products = this.store.getProducts();
    const toAddress = this.store.getClientAddress();
    
    const groups = {};
    products.forEach(prod => {
      if (!prod.fromAddress) return;
      
      const key = JSON.stringify(prod.fromAddress);
      if (!groups[key]) groups[key] = { from: prod.fromAddress, parcels: [] };
      
      const adjustedDimensions = utils.calculateAdjustedDimensions(prod.dimensions, prod.quantity);
      
      groups[key].parcels.push({
        length: adjustedDimensions.length,
        width: adjustedDimensions.width,
        height: adjustedDimensions.height,
        distance_unit: adjustedDimensions.distance_unit,
        weight: adjustedDimensions.weight,
        mass_unit: adjustedDimensions.mass_unit
      });
    });
    
    return Object.keys(groups).map(k => ({
      from: groups[k].from,
      to: toAddress,
      parcels: groups[k].parcels
    }));
  }

  bindEvents() {
    // Écouter les changements d'adresse pour recalculer si nécessaire
    eventBus.on(EVENTS.ADDRESS_CHANGE, () => {
      // Potentiellement rafraîchir les produits si l'adresse change
    });
  }
}