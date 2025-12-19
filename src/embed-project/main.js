//embed-projet/main.js
import { prodLog } from './config.js';
import { isInBuilder, isSlugPage } from './utils.js';
import { FormComponent } from './FormComponent.js';
import { ProductComponent } from './ProductComponent.js';
import { ShippingComponent } from './ShippingComponent.js';
import { initStore } from './store.js';
import { loadStyles } from './style.js';

if (typeof window.devaitoInitialized === 'undefined') {
  window.devaitoInitialized = true;
  
  (function(){
    prodLog.info("Initialisation du widget modulaire");

    if (isInBuilder()) {
      prodLog.info("Mode Builder détecté : script du widget non exécuté.");
      return;
    }

    if (!isSlugPage()) {
      prodLog.info("Pas sur une page avec slug, widget non initialisé");
      return;
    }

    loadStyles();

    function initWidget() {
      let container = document.getElementById("devaito-widget");
      let shopId = container ? container.getAttribute("data-shop-id") : null;
      
      let isFloating = false;
      let floatingContainer = null;
      
      if (!container) {
        prodLog.info("Aucun conteneur trouvé, création d'un widget flottant");
        
        if (typeof window.DEVAITO_SHOP_ID !== 'undefined') {
          shopId = window.DEVAITO_SHOP_ID;
          prodLog.info(`ShopID récupéré depuis window.DEVAITO_SHOP_ID: ${shopId}`);
        } else {
          prodLog.error("Aucun shopId trouvé pour le widget flottant");
          return;
        }
        
        // Créer le conteneur flottant (juste l'icône)
        floatingContainer = document.createElement('div');
        floatingContainer.id = "devaito-widget-floating";
        floatingContainer.style.cssText = "position: fixed; bottom: 150px; right: 20px; z-index: 10000;";
        document.body.appendChild(floatingContainer);
        
        // Créer le conteneur du modal (caché initialement)
        container = document.createElement('div');
        container.id = "devaito-modal-container";
        container.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10001;";
        document.body.appendChild(container);
        
        isFloating = true;
      }
      
      if(!container) {
        prodLog.error("Container non trouvé");
        return;
      }

      if (document.getElementById("devaito-toggle")) {
        prodLog.info("Widget déjà initialisé");
        return;
      }

      if(!shopId) {
        prodLog.error("data-shop-id manquant");
        return;
      }

      // Initialiser le store
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

      // Créer et initialiser les composants
      const components = {
        form: new FormComponent(isFloating ? floatingContainer : container, { 
          isFloating, 
          shopId 
        }), 
        product: new ProductComponent(container, { 
          isFloating,
          shopId
        }),
        shipping: new ShippingComponent(container, { 
          isFloating 
        })
      };

      // Initialiser dans l'ordre
      components.form.init();
      
      // En mode flottant, stocker les références pour le modal
      if (isFloating) {
        window.devaitoModalComponents = {
          product: components.product,
          shipping: components.shipping,
          modalContainer: container,
          form: components.form
        };
        
        // Initialiser les autres composants mais ne pas les charger tout de suite
        components.product.init(true); // true = mode modal
        components.shipping.init(); // Shipping s'initialise normalement
      } else {
        // Mode intégré : initialiser normalement
        components.product.init();
        components.shipping.init();
      }

      // Stocker les instances
      window.devaitoWidget = {
        ...components,
        store: window.__DEVAITO_STORE__,
        isFloating
      };
      
      prodLog.info("Widget complètement initialisé");
    }

    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", initWidget);
    } else {
      initWidget();
    }
  })();
}