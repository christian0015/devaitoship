//embed-projet/ProductComponent.js
import { getStore } from './store.js';
import { eventBus, EVENTS } from './EventBus.js';
import { getApiService } from './api.js';
import { prodLog, utils } from './config.js';
import { getProductInfo } from './utils.js';

export class ProductComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.isFloating = options.isFloating || false;
    this.shopId = options.shopId;
    this.store = getStore();
    this.api = getApiService();
    
    this.elements = {
      productsSection: null,
      productsContainer: null,
      productsTitle: null
    };
  }

  init(isModal = false) {
    if (this.isFloating && !isModal) {
      // En mode flottant, on attend que le modal soit ouvert
      return;
    }
    
    this.render();
    
    if (!isModal) {
      this.loadProducts();
      this.bindEvents();
    }
  }

  render() {
    // Créer la section produits
    this.elements.productsSection = document.createElement("div");
    this.elements.productsSection.id = "devaito-products-section";
    this.elements.productsSection.className = "devaito-products-section";
    this.elements.productsSection.style.cssText = "margin-bottom: 20px;";
    
    this.elements.productsTitle = document.createElement("h4");
    this.elements.productsTitle.textContent = "Produits";
    this.elements.productsTitle.style.cssText = "margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";
    
    this.elements.productsContainer = document.createElement("div");
    this.elements.productsContainer.id = "devaito-products-container";
    this.elements.productsContainer.style.cssText = "margin-bottom: 20px; min-height: 80px;";
    
    this.elements.productsSection.appendChild(this.elements.productsTitle);
    this.elements.productsSection.appendChild(this.elements.productsContainer);
    
    // Ajouter au conteneur approprié
    if (this.isFloating) {
      // Pour le widget flottant, stocker la section pour l'ajouter au modal plus tard
      this.container.productsSection = this.elements.productsSection;
    } else {
      // Pour le widget intégré, ajouter directement après la section adresse
      const content = document.getElementById("devaito-content");
      if (content) {
        content.appendChild(this.elements.productsSection);
      } else {
        console.error("Contenu non trouvé pour ajouter la section produits");
      }
    }
  }

  async loadProducts() {
    try {
      const productInfo = getProductInfo();
      
      if (productInfo.length === 0) {
        this.showNoProducts();
        return;
      }
      
      const storeState = this.store.state;
      const data = await this.api.fetchShopData(this.shopId, productInfo);
      
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
          dimensions: p.dimensions || { length: 20, width: 15, height: 10, weight: 1.5 },
          fromAddress: fromAddress 
        };
      });
      
      this.store.setState({ products });
      this.renderProducts(products);
      eventBus.emit(EVENTS.PRODUCTS_CHANGE, { products });
      
    } catch (error) {
      prodLog.error("Erreur chargement produits:", error);
      this.showError("Erreur de chargement des produits");
      eventBus.emit(EVENTS.ERROR, { 
        action: 'loadProducts', 
        error: error.message 
      });
    }
  }

  renderProducts(products) {
    if (!this.elements.productsContainer) return;
    
    this.elements.productsContainer.innerHTML = "";
    
    if (products.length === 0) {
      this.showNoProducts();
      return;
    }
    
    products.forEach(p => {
      const productCard = this.createProductCard(p);
      this.elements.productsContainer.appendChild(productCard);
    });
    
    // Mettre à jour le titre avec le nombre de produits
    this.elements.productsTitle.textContent = `Produits (${products.length})`;
  }

  createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "devaito-product-item";
    productCard.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 8px;
    `;
    
    const productInfoDiv = document.createElement("div");
    productInfoDiv.className = "devaito-product-info";
    productInfoDiv.style.cssText = "flex-grow: 1; margin-right: 12px;";
    
    const productName = document.createElement("div");
    productName.className = "devaito-product-name";
    productName.textContent = product.name || "Produit sans nom";
    productName.style.cssText = "font-weight: 500; color: #374151; font-size: 14px;";
    
    const productDetails = document.createElement("div");
    productDetails.className = "devaito-product-details";
    
    if (product.dimensions) {
      productDetails.textContent = `${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height}cm, ${product.quantity} unité(s)`;
    } else {
      productDetails.textContent = `${product.quantity} unité(s)`;
    }
    
    productDetails.style.cssText = "font-size: 12px; color: #6b7280; margin-top: 2px;";
    
    productInfoDiv.appendChild(productName);
    productInfoDiv.appendChild(productDetails);
    
    const quantityDisplay = document.createElement("div");
    quantityDisplay.className = "devaito-product-quantity";
    quantityDisplay.textContent = product.quantity;
    quantityDisplay.style.cssText = `
      width: 60px;
      padding: 8px;
      border: 1.5px solid #d1d5db;
      color: #1f2937;
      border-radius: 6px;
      text-align: center;
      font-size: 14px;
      background: #f9fafb;
    `;
    quantityDisplay.readOnly = true;
    
    productCard.appendChild(productInfoDiv);
    productCard.appendChild(quantityDisplay);
    
    return productCard;
  }

  showNoProducts() {
    if (!this.elements.productsContainer) return;
    
    this.elements.productsContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #6b7280; background: #f9fafb; border-radius: 8px; border: 1px dashed #d1d5db;">
        <div style="font-size: 24px; margin-bottom: 8px;">📦</div>
        <div>Aucun produit détecté</div>
        <div style="font-size: 12px; margin-top: 4px;">Ajoutez des produits à votre panier</div>
      </div>
    `;
  }

  showError(message) {
    if (!this.elements.productsContainer) return;
    
    this.elements.productsContainer.innerHTML = `
      <div style="text-align: center; padding: 15px; color: #dc2626; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
        <div style="font-size: 20px; margin-bottom: 8px;">⚠️</div>
        <div>${message}</div>
      </div>
    `;
  }

  bindEvents() {
    eventBus.on(EVENTS.ADDRESS_CHANGE, () => {
      // Potentiellement recharger les produits si l'adresse affecte la disponibilité
    });
  }

  getProductsForShipping() {
    return this.store.getProducts();
  }

  prepareShippingRequests() {
    const products = this.store.getProducts();
    const toAddress = this.store.getClientAddress();
    
    if (products.length === 0 || !toAddress || !toAddress.country) {
      return [];
    }
    
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
        distance_unit: adjustedDimensions.distance_unit || 'cm',
        weight: adjustedDimensions.weight,
        mass_unit: adjustedDimensions.mass_unit || 'kg'
      });
    });
    
    return Object.keys(groups).map(k => ({
      from: groups[k].from,
      to: toAddress,
      parcels: groups[k].parcels
    }));
  }
}