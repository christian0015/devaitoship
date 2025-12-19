//embed-projet/ShippingComponent.js
import { getStore } from './store.js';
import { eventBus, EVENTS } from './EventBus.js';
import { getApiService } from './api.js';
import { prodLog, utils, CONFIG } from './config.js';

export class ShippingComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.isFloating = options.isFloating || false;
    this.store = getStore();
    this.api = getApiService();
    
    this.elements = {
      estimateBtn: null,
      errorDiv: null,
      resultsDiv: null,
      totalDiv: null,
      validateBtn: null,
      shippingSection: null
    };
    
    this.selectedRates = {};
    this.unsubscribeStore = null;
  }

  init() {
    this.render();
    this.bindEvents();
    this.setupStoreSubscription();
  }

  render() {
    // Créer la section complète du shipping
    this.elements.shippingSection = document.createElement("div");
    this.elements.shippingSection.id = "devaito-shipping-section";
    this.elements.shippingSection.className = "devaito-shipping-section";
    this.elements.shippingSection.style.cssText = "margin-top: 20px;";
    
    // Bouton estimation
    this.elements.estimateBtn = this.createButton(
      "devaito-estimate",
      "✨ Estimer les frais de port",
      "#00d084",
      "devaito-btn-primary"
    );
    
    // Div erreurs
    this.elements.errorDiv = this.createErrorDiv();
    
    // Div résultats
    this.elements.resultsDiv = this.createResultsDiv();
    
    // Div prix total
    this.elements.totalDiv = this.createTotalDiv();
    
    // Bouton validation
    this.elements.validateBtn = this.createButton(
      "devaito-validate",
      "✅ Valider la commande",
      "#10b981",
      "devaito-validate-btn"
    );
    this.elements.validateBtn.style.display = "none";
    
    // Assembler la section
    this.elements.shippingSection.appendChild(this.elements.estimateBtn);
    this.elements.shippingSection.appendChild(this.elements.errorDiv);
    this.elements.shippingSection.appendChild(this.elements.resultsDiv);
    this.elements.shippingSection.appendChild(this.elements.totalDiv);
    this.elements.shippingSection.appendChild(this.elements.validateBtn);
    
    // Ajouter au conteneur approprié
    if (this.isFloating) {
      // Pour le widget flottant, stocker pour l'ajouter au modal
      this.container.shippingSection = this.elements.shippingSection;
    } else {
      // Pour le widget intégré, ajouter après les produits
      const productsSection = document.getElementById("devaito-products-section");
      if (productsSection) {
        productsSection.parentNode.insertBefore(this.elements.shippingSection, productsSection.nextSibling);
      } else {
        // Si pas de section produits, ajouter à la fin du content
        const content = document.getElementById("devaito-content");
        if (content) {
          content.appendChild(this.elements.shippingSection);
        }
      }
    }
  }

  createButton(id, text, bgColor, className) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.className = className;
    btn.textContent = text;
    btn.style.cssText = `
      width: 100%;
      padding: 14px 20px;
      border-radius: 10px;
      border: none;
      background: ${bgColor};
      color: white;
      font-weight: 600;
      cursor: pointer;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
      transition: all 0.3s ease;
    `;
    return btn;
  }

  createErrorDiv() {
    const div = document.createElement("div");
    div.id = "devaito-error";
    div.style.cssText = `
      color: #dc2626;
      margin-top: 12px;
      font-size: 14px;
      padding: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      display: none;
    `;
    return div;
  }

  createResultsDiv() {
    const div = document.createElement("div");
    div.id = "devaito-results";
    div.style.cssText = `
      margin-top: 20px;
      max-height: 300px;
      overflow-y: auto;
    `;
    return div;
  }

  createTotalDiv() {
    const div = document.createElement("div");
    div.id = "devaito-total";
    div.className = "devaito-total-price";
    div.style.cssText = `
      font-weight: 700;
      font-size: 18px;
      color: #1f2937;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      display: none;
    `;
    return div;
  }

  bindEvents() {
    // Bouton estimation
    this.elements.estimateBtn.addEventListener('click', () => this.handleEstimate());
    
    // Bouton validation
    this.elements.validateBtn.addEventListener('click', () => this.handleValidation());
    
    // Écouter les événements du store
    eventBus.on(EVENTS.PRODUCTS_CHANGE, () => {
      this.updateEstimateButtonState();
    });
    
    eventBus.on(EVENTS.ADDRESS_CHANGE, () => {
      this.updateEstimateButtonState();
    });
  }

  async handleEstimate() {
    this.hideError();
    this.clearResults();
    this.setLoading(true, "⏳ Calcul en cours...");
    
    try {
      const address = this.store.getClientAddress();
      const products = this.store.getProducts();
      
      // Validation - MODIFIÉ : comme dans l'original
      if (!this.isValidAddress(address)) {
        this.showError("⚠️ Veuillez compléter tous les champs obligatoires");
        this.setLoading(false);
        return;
      }
      
      if (products.length === 0) {
        this.showError("❌ Aucun produit disponible pour l'estimation");
        this.setLoading(false);
        return;
      }
      
      // Préparer les requêtes
      const shippingRequests = this.prepareShippingRequests();
      
      if (shippingRequests.length === 0) {
        this.showError("❌ Impossible de préparer les demandes d'expédition");
        this.setLoading(false);
        return;
      }
      
      // Obtenir les tarifs
      const rates = await this.api.getShippingRates(shippingRequests);
      
      // Afficher les résultats
      this.displayRates(rates);
      
    } catch (error) {
      this.showError(`❌ ${error.message}`);
      prodLog.error("Erreur estimation", error);
    } finally {
      this.setLoading(false);
    }
  }

  prepareShippingRequests() {
    const products = this.store.getProducts();
    const toAddress = this.store.getClientAddress();
    
    if (!toAddress || !toAddress.country) {
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

  // MODIFIÉ : Validation comme dans embed.js original
  isValidAddress(address) {
    return address.street1 && address.zip && 
           address.email && address.country && utils.isValidEmail(address.email);
  }

  displayRates(rates) {
    this.elements.resultsDiv.innerHTML = "";
    
    if (!rates || rates.length === 0) {
      this.elements.resultsDiv.innerHTML = `
        <div style="text-align: center; color: #6b7280; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <div style="font-size: 24px; margin-bottom: 8px;">📭</div>
          <div>Aucune option de livraison disponible</div>
          <div style="font-size: 12px; margin-top: 4px;">Vérifiez votre adresse de livraison</div>
        </div>
      `;
      return;
    }
    
    // Trier par prix
    rates.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
    // Créer les cartes de taux
    rates.forEach((rate, index) => {
      const rateCard = this.createRateCard(rate, index === 0);
      this.elements.resultsDiv.appendChild(rateCard);
    });
  }

  createRateCard(rate, isCheapest = false) {
    const rateCard = document.createElement("div");
    rateCard.className = "devaito-rate-card";
    rateCard.dataset.rateId = rate.id || rate.object_id;
    rateCard.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      margin-bottom: 12px;
      background: white;
      border-radius: 10px;
      border: 1.5px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    
    // Section gauche (logo + infos)
    const leftSection = document.createElement("div");
    leftSection.style.cssText = "display: flex; align-items: center; gap: 12px; flex: 1;";
    
    // Logo transporteur
    const carrierLogo = document.createElement("div");
    if (rate.img) {
      const img = document.createElement("img");
      img.src = rate.img;
      img.alt = rate.carrier;
      img.style.cssText = "width: 40px; height: 40px; object-fit: contain; border-radius: 6px;";
      carrierLogo.appendChild(img);
    } else {
      carrierLogo.innerHTML = "🚚";
      carrierLogo.style.cssText = "width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;";
    }
    
    // Infos service
    const serviceInfo = document.createElement("div");
    serviceInfo.style.cssText = "flex: 1;";
    
    const carrierService = document.createElement("div");
    carrierService.textContent = `${rate.carrier} - ${rate.service || "Service standard"}`;
    carrierService.style.cssText = "font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;";
    
    serviceInfo.appendChild(carrierService);
    
    if (rate.estimated_days) {
      const estimatedDays = document.createElement("div");
      estimatedDays.textContent = `Livraison estimée: ${rate.estimated_days} jour${rate.estimated_days > 1 ? 's' : ''}`;
      estimatedDays.style.cssText = "font-size: 12px; color: #6b7280; margin-top: 2px;";
      serviceInfo.appendChild(estimatedDays);
    }
    
    // Section prix
    const priceSection = document.createElement("div");
    priceSection.style.cssText = "text-align: right;";
    
    const price = document.createElement("div");
    price.textContent = `${parseFloat(rate.price || 0).toFixed(2)} ${rate.currency || 'EUR'}`;
    price.style.cssText = "font-weight: 700; font-size: 16px; color: #00d084;";
    
    priceSection.appendChild(price);
    
    // Badge "Le moins cher"
    if (isCheapest) {
      const badge = document.createElement("div");
      badge.textContent = "Le moins cher";
      badge.style.cssText = "font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;";
      priceSection.appendChild(badge);
    }
    
    // Assembler la carte
    leftSection.appendChild(carrierLogo);
    leftSection.appendChild(serviceInfo);
    rateCard.appendChild(leftSection);
    rateCard.appendChild(priceSection);
    
    // Gestionnaire de clic
    rateCard.addEventListener('click', () => this.selectRate(rate, rateCard));
    
    return rateCard;
  }

  selectRate(rate, rateCard) {
    // Désélectionner les autres
    const allCards = this.elements.resultsDiv.querySelectorAll('.devaito-rate-card');
    allCards.forEach(card => {
      card.classList.remove('selected');
      card.style.borderColor = '#e5e7eb';
    });
    
    // Sélectionner celui-ci
    rateCard.classList.add('selected');
    rateCard.style.borderColor = '#00d084';
    
    // Stocker la sélection
    this.selectedRates = {
      [rate.carrier]: {
        ...rate,
        object_id: rate.id || rate.object_id,
        servicepoint_token: rate.relayToken || rate.servicepoint_token
      }
    };
    
    // Calculer et afficher le total
    this.updateTotal();
    
    prodLog.info("Taux sélectionné:", rate);
  }

  updateTotal() {
    const rates = Object.values(this.selectedRates);
    if (rates.length === 0) {
      this.elements.totalDiv.style.display = "none";
      this.elements.validateBtn.style.display = "none";
      return;
    }
    
    const total = rates.reduce((sum, rate) => sum + parseFloat(rate.price || 0), 0);
    
    this.elements.totalDiv.textContent = `Total estimation: ${total.toFixed(2)} EUR`;
    this.elements.totalDiv.style.display = "block";
    this.elements.validateBtn.style.display = "block";
  }

  async handleValidation() {
    const rates = Object.values(this.selectedRates);
    if (rates.length === 0) {
      this.showError("Veuillez sélectionner une option de livraison");
      return;
    }
    
    const selectedRate = rates[0];
    const address = this.store.getClientAddress();
    const products = this.store.getProducts();
    
    this.setLoading(true, "⏳ Création du label...", true);
    
    try {
      const orderData = {
        orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `#${Date.now().toString().substr(-6)}`,
        customerName: address.name || "Client",
        customerEmail: address.email || "",
        customerPhone: address.phone || "",
        shippingAddress: address,
        items: products.map(p => ({
          name: p.name,
          quantity: p.quantity,
          weight: p.dimensions?.weight || 1.5
        }))
      };
      
      const payload = {
        rateId: selectedRate.object_id,
        relay_token: selectedRate.servicepoint_token || null,
        shopUrl: window.location.origin,
        orderData: orderData
      };
      
      const result = await this.api.createLabel(payload);
      
      if (result.success) {
        this.showSuccess(result.shipment);
      } else {
        throw new Error(result.error || "Erreur inconnue lors de la création du label");
      }
      
    } catch (error) {
      this.showError(`❌ Erreur lors de la création du label: ${error.message}`);
    } finally {
      this.setLoading(false, null, true);
    }
  }

  showSuccess(shipment) {
    const successHTML = `
      <div style="text-align: center; padding: 15px;">
        <div style="font-size: 40px; color: #10b981; margin-bottom: 10px;">✅</div>
        <h3 style="color: #059669; margin: 10px 0;">Label créé avec succès !</h3>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>📦 Numéro de suivi :</strong> ${shipment.trackingNumber || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>🚚 Transporteur :</strong> ${shipment.carrier || "Inconnu"}</p>
          <p style="margin: 5px 0;"><strong>📄 Statut :</strong> ${shipment.status || "En traitement"}</p>
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          ${shipment.trackingUrl ? `
            <a href="${shipment.trackingUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              🔍 Suivre le colis
            </a>
          ` : ''}
          ${shipment.labelUrl ? `
            <a href="${shipment.labelUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              📥 Télécharger le label
            </a>
          ` : ''}
        </div>
      </div>
    `;
    
    this.elements.errorDiv.innerHTML = successHTML;
    this.elements.errorDiv.style.color = "#059669";
    this.elements.errorDiv.style.background = "#f0fdf4";
    this.elements.errorDiv.style.borderColor = "#bbf7d0";
    this.elements.errorDiv.style.display = "block";
    
    // Cacher le bouton de validation
    this.elements.validateBtn.style.display = "none";
  }

  showError(message) {
    this.elements.errorDiv.textContent = message;
    this.elements.errorDiv.style.display = "block";
  }

  hideError() {
    this.elements.errorDiv.style.display = "none";
  }

  clearResults() {
    this.elements.resultsDiv.innerHTML = "";
    this.elements.totalDiv.style.display = "none";
    this.elements.validateBtn.style.display = "none";
    this.selectedRates = {};
  }

  setLoading(isLoading, text = null, isValidation = false) {
    if (isLoading) {
      if (isValidation) {
        this.elements.validateBtn.disabled = true;
        this.elements.validateBtn.innerHTML = text || "⏳ Traitement...";
        this.elements.validateBtn.style.background = "#9ca3af";
      } else {
        this.elements.estimateBtn.disabled = true;
        this.elements.estimateBtn.innerHTML = text || "⏳ Calcul en cours...";
        this.elements.estimateBtn.style.background = "#9ca3af";
      }
    } else {
      if (isValidation) {
        this.elements.validateBtn.disabled = false;
        this.elements.validateBtn.innerHTML = "✅ Valider la commande";
        this.elements.validateBtn.style.background = "#10b981";
      } else {
        this.elements.estimateBtn.disabled = false;
        this.elements.estimateBtn.innerHTML = "✨ Estimer les frais de port";
        this.elements.estimateBtn.style.background = "#00d084";
      }
    }
  }

  updateEstimateButtonState() {
    const isFormValid = this.store.isFormValid();
    const hasProducts = this.store.getProducts().length > 0;
    
    if (this.elements.estimateBtn) {
      this.elements.estimateBtn.disabled = !isFormValid || !hasProducts;
      this.elements.estimateBtn.style.opacity = (isFormValid && hasProducts) ? "1" : "0.6";
      this.elements.estimateBtn.title = !isFormValid ? "Veuillez remplir le formulaire d'adresse" : 
                                        !hasProducts ? "Aucun produit disponible" : 
                                        "Cliquez pour estimer les frais de port";
    }
  }

  setupStoreSubscription() {
    this.unsubscribeStore = this.store.subscribe((oldState, newState) => {
      if (oldState.formStatus !== newState.formStatus || 
          oldState.products !== newState.products) {
        this.updateEstimateButtonState();
      }
    });
  }

  destroy() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }
}