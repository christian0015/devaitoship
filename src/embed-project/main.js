//embed-projet/main.js
import { prodLog } from './config.js';
import { isInBuilder, isSlugPage } from './utils.js';
import { FormComponent } from './FormComponent.js';
import { ProductComponent } from './ProductComponent.js';
import { ShippingComponent } from './ShippingComponent.js';
import { initStore } from './store.js';
import { loadStyles } from './style.js';

// Vérifier si le widget a déjà été initialisé
if (typeof window.devaitoInitialized === 'undefined') {
  window.devaitoInitialized = true;
  
  (function(){
    prodLog.info("Initialisation du widget modulaire");

    // Si on est dans le builder, on ne charge pas le widget
    if (isInBuilder()) {
      prodLog.info("Mode Builder détecté : script du widget non exécuté.");
      return;
    }

    // Vérifier si on est sur une page avec slug
    if (!isSlugPage()) {
      prodLog.info("Pas sur une page avec slug, widget non initialisé");
      return;
    }

    // Charger les styles
    loadStyles();

    function initWidget() {
      let container = document.getElementById("devaito-widget");
      let shopId = container ? container.getAttribute("data-shop-id") : null;
      
      // Si pas de container, créer un widget flottant
      let isFloating = false;
      if (!container) {
        prodLog.info("Aucun conteneur trouvé, création d'un widget flottant");
        
        // Vérifier si on a un shopId dans une variable globale
        if (typeof window.DEVAITO_SHOP_ID !== 'undefined') {
          shopId = window.DEVAITO_SHOP_ID;
          prodLog.info(`ShopID récupéré depuis window.DEVAITO_SHOP_ID: ${shopId}`);
        } else {
          prodLog.error("Aucun shopId trouvé pour le widget flottant");
          return;
        }
        
        // Créer le widget flottant
        container = document.createElement('div');
        container.id = "devaito-widget-floating";
        container.style.cssText = "position: fixed; bottom: 150px; right: 20px; z-index: 10000;";
        document.body.appendChild(container);
        isFloating = true;
      }
      
      if(!container) {
        prodLog.error("Container non trouvé");
        return;
      }

      if (container.querySelector("#devaito-toggle")) {
        prodLog.info("Widget déjà initialisé");
        return;
      }

      if(!shopId) {
        prodLog.error("data-shop-id manquant");
        return;
      }

      // Initialiser le store global
      initStore({ 
        shopId, 
        isFloating,
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
      });

      // Initialiser les composants
      const formComponent = new FormComponent(container, { 
        isFloating, 
        shopId 
      });
      
      const productComponent = new ProductComponent(container, { 
        isFloating,
        shopId
      });
      
      const shippingComponent = new ShippingComponent(container, { 
        isFloating 
      });

      formComponent.init();
      productComponent.init();
      shippingComponent.init();

      // Stocker les instances
      window.devaitoWidget = {
        formComponent,
        productComponent,
        shippingComponent,
        store: window.__DEVAITO_STORE__
      };
    }

    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", initWidget);
    } else {
      initWidget();
    }
  })();
}