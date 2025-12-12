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
      validateBtn: null
    };
    
    this.unsubscribeStore = null;
  }

  init() {
    this.render();
    this.bindEvents();
    this.setupStoreSubscription();
  }

  render() {
    // Bouton estimation
    this.elements.estimateBtn = document.createElement("button");
    this.elements.estimateBtn.id = "devaito-estimate";
    this.elements.estimateBtn.className = "devaito-btn-primary";
    this.elements.estimateBtn.innerHTML = "✨ Estimer les frais de port";
    this.elements.estimateBtn.style.cssText = "width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;";

    // Div erreurs
    this.elements.errorDiv = document.createElement("div");
    this.elements.errorDiv.id = "devaito-error";
    this.elements.errorDiv.style.cssText = "color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;";
    
    // Div résultats
    this.elements.resultsDiv = document.createElement("div");
    this.elements.resultsDiv.id = "devaito-results";
    this.elements.resultsDiv.style.cssText = "margin-top: 20px;";
    
    // Div pour le prix total
    this.elements.totalDiv = document.createElement("div");
    this.elements.totalDiv.id = "devaito-total";
    this.elements.totalDiv.className = "devaito-total-price";
    this.elements.totalDiv.style.cssText = "display: none;";
    
    // Bouton de validation
    this.elements.validateBtn = document.createElement("button");
    this.elements.validateBtn.id = "devaito-validate";
    this.elements.validateBtn.className = "devaito-validate-btn";
    this.elements.validateBtn.innerHTML = "✅ Valider la commande";
    this.elements.validateBtn.style.cssText = "display: none;";

    // Trouver le contenu pour ajouter les éléments
    const content = document.getElementById("devaito-content") || 
                   this.container.querySelector(".devaito-floating-content");
    if (content) {
      content.appendChild(this.elements.estimateBtn);
      content.appendChild(this.elements.errorDiv);
      content.appendChild(this.elements.resultsDiv);
      content.appendChild(this.elements.totalDiv);
      content.appendChild(this.elements.validateBtn);
    }
  }

  bindEvents() {
    // Bouton estimation
    this.elements.estimateBtn.addEventListener('click', () => this.handleEstimate());
    
    // Bouton validation
    this.elements.validateBtn.addEventListener('click', () => this.handleValidation());
    
    // Écouter les événements du store
    this.unsubscribeStore = this.store.subscribe((oldState, newState) => {
      if (oldState.selectedRates !== newState.selectedRates) {
        this.updateTotal();
      }
      
      if (oldState.formStatus !== newState.formStatus) {
        this.updateEstimateButtonState();
      }
    });
  }

  async handleEstimate() {
    this.hideError();
    this.clearResults();
    
    const address = this.store.getClientAddress();
    const products = this.store.getProducts();
    
    if (!this.isValidAddress(address)) {
      this.showError("⚠️ Veuillez compléter tous les champs obligatoires");
      return;
    }
    
    if (products.length === 0) {
      this.showError("❌ Aucun produit disponible pour l'estimation");
      return;
    }
    
    this.setLoading(true);
    
    try {
      // Préparer les requêtes via ProductComponent
      const shippingRequests = this.store.state.productComponent?.prepareShippingRequests() || [];
      
      // Obtenir les tarifs
      const rates = await this.api.getShippingRates(shippingRequests);
      
      // Afficher les résultats
      this.displayRates(rates);
      
    } catch (error) {
      this.showError("❌ Erreur lors de l'estimation des frais de port");
      prodLog.error("Erreur estimation", error);
    } finally {
      this.setLoading(false);
    }
  }

  isValidAddress(address) {
    return address.street1 && address.city && address.zip && 
           address.email && address.country && utils.isValidEmail(address.email);
  }

  displayRates(rates) {
    this.elements.resultsDiv.innerHTML = "";
    
    if (rates.length === 0) {
      this.elements.resultsDiv.innerHTML = "<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>📭 Aucune option de livraison disponible";
      return;
    }
    
    // Grouper par produit (simplifié pour l'exemple)
    const ratesByProduct = { 0: rates }; // Tout regrouper sous le produit 0
    
    Object.keys(ratesByProduct).forEach(productId => {
      const productRates = ratesByProduct[productId];
      const product = this.store.getProducts()[productId] || this.store.getProducts()[0];
      
      // Titre du produit
      const productTitle = document.createElement("h5");
      productTitle.textContent = `Options pour: ${product.name}`;
      productTitle.style.cssText = "margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";
      this.elements.resultsDiv.appendChild(productTitle);
      
      // Trier par prix
      productRates.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      
      productRates.forEach((rate, index) => {
        const rateCard = this.createRateCard(rate, productId, index);
        this.elements.resultsDiv.appendChild(rateCard);
      });
    });
  }

  createRateCard(rate, productId, index) {
    const rateCard = document.createElement("div");
    rateCard.className = "devaito-rate-card";
    rateCard.dataset.productId = productId;
    rateCard.dataset.rateId = index;
    rateCard.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb; cursor: pointer;";
    
    // Section gauche (logo + infos)
    const leftSection = document.createElement("div");
    leftSection.style.cssText = "display: flex; align-items: center; gap: 12px; flex: 1;";
    
    // Logo transporteur
    const carrierLogo = rate.img 
      ? this.createCarrierLogo(rate.img, rate.carrier)
      : this.createDefaultLogo();
    
    // Infos service
    const serviceInfo = document.createElement("div");
    serviceInfo.style.cssText = "flex: 1;";
    
    const carrierService = document.createElement("div");
    carrierService.textContent = `${rate.carrier} - ${rate.service}`;
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
    price.textContent = `${rate.price} ${rate.currency}`;
    price.style.cssText = "font-weight: 700; font-size: 16px; color: #00d084;";
    
    priceSection.appendChild(price);
    
    // Badge "Le moins cher"
    if (index === 0) {
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
    rateCard.addEventListener('click', () => this.selectRate(rate, productId, rateCard));
    
    return rateCard;
  }

  selectRate(rate, productId, rateCard) {
    // Désélectionner les autres
    document.querySelectorAll(`.devaito-rate-card[data-product-id="${productId}"]`).forEach(card => {
      card.classList.remove('selected');
    });
    
    // Sélectionner celui-ci
    rateCard.classList.add('selected');
    
    // Mettre à jour le store
    this.store.setState({
      selectedRates: {
        ...this.store.getSelectedRates(),
        [productId]: {
          ...rate,
          object_id: rate.id || rate.object_id || rate.rateId,
          servicepoint_token: rate.relayToken || rate.servicepoint_token || null
        }
      }
    });
    
    prodLog.info("Taux sélectionné:", rate);
  }

  updateTotal() {
    const total = this.store.getTotalPrice();
    
    if (total > 0) {
      this.elements.totalDiv.textContent = `Total estimation: ${utils.formatPrice(total)}`;
      this.elements.totalDiv.style.display = "block";
      
      const hasSelectedRates = Object.keys(this.store.getSelectedRates()).length > 0;
      this.elements.validateBtn.style.display = hasSelectedRates ? "block" : "none";
    } else {
      this.elements.totalDiv.style.display = "none";
      this.elements.validateBtn.style.display = "none";
    }
  }

  async handleValidation() {
    const selectedRates = this.store.getSelectedRates();
    const address = this.store.getClientAddress();
    const products = this.store.getProducts();
    
    if (Object.keys(selectedRates).length === 0) {
      this.showError("Veuillez sélectionner une option de livraison");
      return;
    }
    
    this.setLoading(true, "Création du label...");
    
    try {
      const firstProductId = Object.keys(selectedRates)[0];
      const selectedRate = selectedRates[firstProductId];
      
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
        rateId: selectedRate.object_id || selectedRate.rateId,
        relay_token: selectedRate.servicepoint_token || null,
        shopUrl: window.location.origin,
        orderData: orderData
      };
      
      const result = await this.api.createLabel(payload);
      
      if (result.success) {
        this.showSuccess(result.shipment);
      } else {
        throw new Error(result.error || "Erreur inconnue");
      }
      
    } catch (error) {
      this.showError(`❌ Erreur lors de la création du label: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  showSuccess(shipment) {
    const successHTML = `
      <div style="text-align: center; padding: 15px;">
        <div style="font-size: 40px; color: #10b981; margin-bottom: 10px;">✅</div>
        <h3 style="color: #059669; margin: 10px 0;">Label créé avec succès !</h3>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>📦 Numéro de suivi :</strong> ${shipment.trackingNumber}</p>
          <p style="margin: 5px 0;"><strong>🚚 Transporteur :</strong> ${shipment.carrier}</p>
          <p style="margin: 5px 0;"><strong>📄 Statut :</strong> ${shipment.status}</p>
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          <a href="${shipment.trackingUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            🔍 Suivre le colis
          </a>
          <a href="${shipment.labelUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            📥 Télécharger le label
          </a>
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
    this.store.setState({ selectedRates: {} });
  }

  setLoading(isLoading, text = null) {
    if (isLoading) {
      this.elements.estimateBtn.disabled = true;
      this.elements.estimateBtn.style.background = "#9ca3af";
      this.elements.estimateBtn.innerHTML = text || "⏳ Calcul en cours...";
      
      this.elements.validateBtn.disabled = true;
      this.elements.validateBtn.innerHTML = "⏳ Traitement...";
    } else {
      this.elements.estimateBtn.disabled = false;
      this.elements.estimateBtn.style.background = "#00d084";
      this.elements.estimateBtn.innerHTML = "✨ Estimer les frais de port";
      
      this.elements.validateBtn.disabled = false;
      this.elements.validateBtn.innerHTML = "✅ Valider la commande";
    }
  }

  updateEstimateButtonState() {
    const isFormValid = this.store.isFormValid();
    this.elements.estimateBtn.disabled = !isFormValid;
    this.elements.estimateBtn.style.opacity = isFormValid ? "1" : "0.6";
  }

  // Méthodes utilitaires pour créer des éléments
  createCarrierLogo(src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.style.cssText = "width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;";
    return img;
  }

  createDefaultLogo() {
    const div = document.createElement("div");
    div.textContent = "🚚";
    div.style.cssText = "width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;";
    return div;
  }

  setupStoreSubscription() {
    this.unsubscribeStore = this.store.subscribe((oldState, newState) => {
      if (oldState.formStatus !== newState.formStatus) {
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