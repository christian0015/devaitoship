// Vérifier si le widget a déjà été initialisé
if (typeof window.devaitoInitialized === 'undefined') {
  window.devaitoInitialized = true;
  
  (function(){
    const CONFIG = {
      API_BASE: "http://localhost:3000/api",
      WAIT_COMMANDE_API: "https://devaitoship.vercel.app/api/wait-commande-validation-shipping",
      DEBUG: true
    };
    
    // Logger simplifié
    const prodLog = {
      info: (...args) => console.log("[DEV]", ...args),
      error: (...args) => console.error("[DEV-ERR]", ...args),
      debug: (...args) => CONFIG.DEBUG && console.log("[DEV-DBG]", ...args)
    };

    prodLog.info("Initialisation du widget");

    function isInBuilder() {
      const href = window.location.href;
      return href.includes('/admin/builder');
    }

    // Si on est dans le builder, on ne charge pas le widget
    if (isInBuilder()) {
      prodLog.info("Mode Builder détecté : script du widget non exécuté.");
      return;
    }

    // Ajouter les styles CSS uniques pour éviter les conflits
    if (!document.getElementById('devaito-widget-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'devaito-widget-styles';
      styleSheet.textContent = `
        .devaito-card-widget { 
          transition: all 0.3s ease; 
        }
        .devaito-card-widget:hover { 
          box-shadow: 0 8px 25px rgba(0,208,132,0.15) !important; 
        }
        .devaito-btn-primary { 
          transition: all 0.3s ease; 
        }
        .devaito-btn-primary:hover { 
          background: #00b870 !important; 
          transform: translateY(-1px); 
        }
        .devaito-input-field { 
          transition: border-color 0.2s ease; 
        }
        .devaito-input-field:focus { 
          border-color: #00d084 !important; 
          outline: none; 
          box-shadow: 0 0 0 2px rgba(0,208,132,0.1); 
        }
        .devaito-rate-card { 
          transition: all 0.2s ease; 
          cursor: pointer;
        }
        .devaito-rate-card:hover { 
          border-color: #00d084 !important; 
          transform: translateY(-2px); 
          box-shadow: 0 4px 15px rgba(0,208,132,0.1); 
        }
        .devaito-rate-card.selected {
          border: 2px solid #00d084 !important;
          background-color: #f0fff8;
        }
        .devaito-toggle-container { 
          transition: all 0.2s ease; 
        }
        .devaito-toggle-container:hover { 
          background: #f0f9ff !important; 
        }
        
        /* Styles pour le widget flottant */
        .devaito-floating-widget {
          position: fixed;
          top: 85px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: #00d084;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);
          z-index: 10000;
          transition: all 0.3s ease;
        }
        
        .devaito-floating-widget:hover {
          transform: scale(1.02);
        }
        
        .devaito-floating-expanded {
          width: 90%;
          max-width: 500px;
          height: auto;
          max-height: 80vh;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .devaito-floating-header {
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .devaito-floating-title {
          font-weight: 600;
          color: #1f2937;
          font-size: 16px;
        }
        
        .devaito-close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }
        
        .devaito-floating-content {
          overflow-y: auto;
          max-height: calc(80vh - 60px);
        }
        
        .devaito-form-status {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
        }
        
        .devaito-form-status.valid {
          color: #059669;
        }
        
        .devaito-form-status.invalid {
          color: #dc2626;
        }
        
        .devaito-checkmark {
          margin-left: 8px;
          color: #059669;
        }
        
        .devaito-product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .devaito-product-info {
          flex-grow: 1;
          margin-right: 12px;
        }
        
        .devaito-product-name {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
        
        .devaito-product-details {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }
        
        .devaito-product-quantity {
          width: 60px;
          padding: 8px;
          border: 1.5px solid #d1d5db;
          color: #1f2937;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
          background: #f9fafb;
        }
        
        .devaito-total-price {
          font-weight: 700;
          font-size: 18px;
          color: #1f2937;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .devaito-validate-btn {
          width: 100%;
          padding: 14px 20px;
          border-radius: 10px;
          border: none;
          background: #10b981;
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
        }
        
        .devaito-validate-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }
        
        .devaito-form-hidden {
          display: none;
        }
        
        @media (min-width: 550px) {
          .devaito-grid-responsive {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Fonction pour vérifier si on est sur une page avec slug
    function isSlugPage() {
      const path = window.location.pathname.toLowerCase();
      return path.includes("/checkout") || 
             path.includes("/cart") || 
             path.includes("/panier") || 
             path.includes("/product/") || 
             path.includes("/products/");
    }

    // Fonction pour vérifier si on est sur une page panier/checkout
    function isCartOrCheckoutPage() {
      const path = window.location.pathname.toLowerCase();
      return path.includes("/cart") || path.includes("/panier") || path.includes("/checkout");
    }

    function initWidget() {
      // Vérifier si on est sur une page avec slug
      if (!isSlugPage()) {
        prodLog.info("Pas sur une page avec slug, widget non initialisé");
        return;
      }

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

      prodLog.info(`Boutique: ${shopId}`);

      // Container principal du widget (style card)
      var widgetCard = document.createElement("div");
      widgetCard.className = "devaito-card-widget";
      
      // Styles différents selon le mode (flottant ou intégré)
      if (isFloating) {
        widgetCard.className += " devaito-floating-widget";
        widgetCard.style.cssText = "background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3); transition: all 0.3s ease;";
        
        // Icône pour le widget flottant
        var floatingIcon = document.createElement("div");
        floatingIcon.innerHTML = "📦";
        floatingIcon.style.cssText = "display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;";
        widgetCard.appendChild(floatingIcon);
      } else {
        widgetCard.style.cssText = "background: white; width: 90%; max-width: 500px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; overflow: hidden; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;";
      }

      // Header du widget avec toggle (seulement pour le mode intégré)
      if (!isFloating) {
        var header = document.createElement("div");
        header.style.cssText = "padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb;";

        var toggleContainer = document.createElement("label");
        toggleContainer.className = "devaito-toggle-container";
        toggleContainer.htmlFor = "devaito-toggle-checkbox";
        toggleContainer.style.cssText = "display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 8px; border-radius: 8px; background: transparent;";
        
        var toggleText = document.createElement("div");
        toggleText.style.cssText = "display: flex; align-items: center; gap: 12px;";
        
        var icon = document.createElement("div");
        icon.innerHTML = "📦";
        icon.style.cssText = "font-size: 20px;";
        
        var textContent = document.createElement("div");
        var title = document.createElement("div");
        title.textContent = "Estimation livraison";
        title.style.cssText = "font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";
        
        var subtitle = document.createElement("div");
        subtitle.textContent = "Calculez vos frais de port";
        subtitle.style.cssText = "font-size: 13px; color: #6b7280; margin-top: 2px;";
        
        textContent.appendChild(title);
        textContent.appendChild(subtitle);
        toggleText.appendChild(icon);
        toggleText.appendChild(textContent);
        
        // Toggle switch moderne
        var switchContainer = document.createElement("div");
        switchContainer.style.cssText = "position: relative; width: 48px; height: 24px;";
        
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "devaito-toggle-checkbox";
        checkbox.style.cssText = "position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2;";
        
        var switchTrack = document.createElement("div");
        switchTrack.style.cssText = "width: 48px; height: 24px; background: #d1d5db; border-radius: 12px; position: relative; transition: all 0.3s ease;";
        
        var switchThumb = document.createElement("div");
        switchThumb.style.cssText = "width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);";
        
        switchTrack.appendChild(switchThumb);
        switchContainer.appendChild(checkbox);
        switchContainer.appendChild(switchTrack);
        
        toggleContainer.appendChild(toggleText);
        toggleContainer.appendChild(switchContainer);
        header.appendChild(toggleContainer);
        widgetCard.appendChild(header);
      }

      // Contenu du widget (caché initialement pour le mode flottant)
      var content = document.createElement("div");
      content.id = "devaito-content";
      content.style.cssText = isFloating ? "display: none; padding: 24px; background: white;" : "display: none; padding: 24px; background: white;";

      // Vérifier si on est sur une page panier/checkout pour masquer le formulaire
      const isCheckoutPage = isCartOrCheckoutPage();
      
      // Section adresse avec grid responsive (masquée sur checkout/panier)
      var addressSection = document.createElement("div");
      addressSection.style.cssText = isCheckoutPage ? "display: none;" : "margin-bottom: 20px;";
      
      var addressTitle = document.createElement("h4");
      addressTitle.textContent = "Adresse de livraison";
      addressTitle.style.cssText = "margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; display: flex; align-items: center;";
      
      // Ajouter un indicateur de statut du formulaire
      var formStatus = document.createElement("span");
      formStatus.id = "devaito-form-status";
      formStatus.className = "devaito-form-status invalid";
      formStatus.textContent = isCheckoutPage ? "Utilisation du formulaire de la page" : "Veuillez remplir le formulaire d'adresse";
      formStatus.style.cssText = "font-size: 12px; margin-left: 10px;";
      
      addressTitle.appendChild(formStatus);
      
      var addressGrid = document.createElement("div");
      addressGrid.className = "devaito-grid-responsive";
      addressGrid.style.cssText = "display: flex; flex-direction: column; gap: 12px;";

      // Formulaire d'adresse avec autocomplétion
      var fields = [
        {name: "name", placeholder: "Nom complet", type: "text", autocomplete: "name"},
        {name: "street", placeholder: "Adresse", type: "text", autocomplete: "street-address"},
        {name: "city", placeholder: "Ville", type: "text", autocomplete: "address-level2"},
        {name: "state", placeholder: "Région", type: "text", autocomplete: "address-level1"},
        {name: "zip", placeholder: "Code postal", type: "text", autocomplete: "postal-code"},
        {name: "phone", placeholder: "Téléphone", type: "tel", autocomplete: "tel"},
        {name: "email", placeholder: "Email", type: "email", autocomplete: "email"}
      ];
      
      var inputs = [];
      fields.forEach(function(field){
        var input = document.createElement("input");
        input.type = field.type;
        input.placeholder = field.placeholder;
        input.name = field.name;
        input.autocomplete = field.autocomplete;
        input.className = "devaito-input-field";
        input.style.cssText = "width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; color: #1f2937; box-sizing: border-box;";
        
        addressGrid.appendChild(input);
        inputs.push(input);
      });
      
      addressSection.appendChild(addressTitle);
      addressSection.appendChild(addressGrid);

      // Section produits
      var productsSection = document.createElement("div");
      productsSection.style.cssText = "margin-bottom: 20px;";
      
      var productsTitle = document.createElement("h4");
      productsTitle.textContent = "Produits";
      productsTitle.style.cssText = "margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";
      
      var productsContainer = document.createElement("div");
      productsContainer.id = "devaito-products";
      productsContainer.style.cssText = "margin-bottom: 20px;";
      
      productsSection.appendChild(productsTitle);
      productsSection.appendChild(productsContainer);

      // Bouton estimer le prix
      var estimateBtn = document.createElement("button");
      estimateBtn.id = "devaito-estimate";
      estimateBtn.className = "devaito-btn-primary";
      estimateBtn.innerHTML = "✨ Estimer les frais de port";
      estimateBtn.style.cssText = "width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;"; 

      // Div erreurs
      var errorDiv = document.createElement("div");
      errorDiv.id = "devaito-error";
      errorDiv.style.cssText = "color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;";
      
      // Div résultats
      var resultsDiv = document.createElement("div");
      resultsDiv.id = "devaito-results";
      resultsDiv.style.cssText = "margin-top: 20px;";
      
      // Div pour le prix total
      var totalDiv = document.createElement("div");
      totalDiv.id = "devaito-total";
      totalDiv.className = "devaito-total-price";
      totalDiv.style.cssText = "display: none;";
      
      // Bouton de validation
      var validateBtn = document.createElement("button");
      validateBtn.id = "devaito-validate";
      validateBtn.className = "devaito-validate-btn";
      validateBtn.innerHTML = "✅ Valider la commande";
      validateBtn.style.cssText = "display: none;";

      content.appendChild(addressSection);
      content.appendChild(productsSection);
      content.appendChild(estimateBtn);
      content.appendChild(errorDiv);
      content.appendChild(resultsDiv);
      content.appendChild(totalDiv);
      content.appendChild(validateBtn);

      // Pour le mode flottant, ajouter un header avec bouton fermer
      if (isFloating) {
        // Conteneur pour le contenu expansé
        var expandedContent = document.createElement("div");
        expandedContent.className = "devaito-floating-content";
        expandedContent.style.cssText = "overflow-y: auto; height: calc(80vh - 60px); display: none; flex-direction: column;";

        // Header avec titre et bouton fermer
        var floatingHeader = document.createElement("div");
        floatingHeader.className = "devaito-floating-header";
        floatingHeader.style.cssText = "padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb; display: none;"; // display none

        var floatingTitle = document.createElement("div");
        floatingTitle.className = "devaito-floating-title";
        floatingTitle.textContent = "Estimation livraison";

        var closeBtn = document.createElement("button");
        closeBtn.className = "devaito-close-btn";
        closeBtn.innerHTML = "×";

        floatingHeader.appendChild(floatingTitle);
        floatingHeader.appendChild(closeBtn);

        // Ajouter header et contenu au conteneur expansé
        expandedContent.appendChild(floatingHeader);
        expandedContent.appendChild(content); // ton contenu principal
        widgetCard.appendChild(expandedContent);
        
        // Gestionnaire pour le bouton fermer
        closeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          expandedContent.style.display = 'none';
          floatingHeader.style.display = 'none';
          floatingIcon.style.display = 'flex'; // revenir à l'état initial
          widgetCard.style.cssText = "background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);";
        });
        
        // Gestionnaire pour la bulle
        widgetCard.addEventListener('click', function(e) {
          if (e.target === widgetCard || e.target === floatingIcon) {
            floatingIcon.style.display = 'none';           // cacher seulement l'icône
            floatingHeader.style.display = 'flex';         // afficher le header
            expandedContent.style.display = 'block';       // afficher le contenu
            content.style.display = 'block'; // ou block
            widgetCard.style.cssText = "background: white; width: 90%; max-width: 500px; height: auto; max-height: 80vh; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: fixed; top: 150px; right: 20px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.15);";
          }
        });
      } else {
        widgetCard.appendChild(content);
        
        // Gestionnaire pour le toggle (mode intégré seulement)
        var checkbox = document.getElementById("devaito-toggle-checkbox");
        checkbox.onchange = function() {
          if(this.checked){
            content.style.display = "block";
            switchTrack.style.background = "#00d084";
            switchThumb.style.transform = "translateX(24px)";
            prodLog.debug("Widget activé");
          } else {
            content.style.display = "block";
            switchTrack.style.background = "#d1d5db";
            switchThumb.style.transform = "translateX(0)";
            prodLog.debug("Widget désactivé");
          }
        };
      }

      container.appendChild(widgetCard);

      var products = [];
      var selectedRates = {}; // Pour stocker les options sélectionnées par produit

      // Fonction pour récupérer les données du formulaire de la page
      function getFormDataFromPage() {
        const formData = {};
        const fieldMap = {
          'name': '#fullname',
          'email': '#email',
          'phone': '#phone',
          'street': '#address',
          'zip': '#postal-code',
          'city': '#city',
          'state': '#state',
          'country': '#country'
        };
        
        Object.keys(fieldMap).forEach(key => {
          const field = document.querySelector(fieldMap[key]);
          if (field) {
            formData[key] = field.value;
          }
        });
        
        return formData;
      }

      // Fonction pour mettre à jour les champs de notre formulaire à partir du formulaire de la page
      function syncWithPageForm() {
        if (!isCartOrCheckoutPage()) return;
        
        const formData = getFormDataFromPage();
        const fieldMapping = {
          'name': 0,
          'street': 1,
          'city': 2,
          'state': 3,
          'zip': 4,
          'phone': 5,
          'email': 6
        };
        
        Object.keys(fieldMapping).forEach(key => {
          const index = fieldMapping[key];
          if (formData[key] && inputs[index]) {
            inputs[index].value = formData[key];
          }
        });
        
        checkFormStatus();
      }

      // Fonction pour vérifier si le formulaire de livraison est rempli
      function checkFormStatus() {
        const formFilled = isFormFilled();
        const statusElement = document.getElementById("devaito-form-status");
        
        if (isCartOrCheckoutPage()) {
          statusElement.textContent = "Utilisation du formulaire de la page";
          statusElement.className = "devaito-form-status valid";
          // Ajouter une coche
          if (!statusElement.querySelector('.devaito-checkmark')) {
            const checkmark = document.createElement("span");
            checkmark.className = "devaito-checkmark";
            checkmark.innerHTML = " ✓";
            statusElement.appendChild(checkmark);
          }
        } else if (formFilled) {
          statusElement.textContent = "Formulaire complété";
          statusElement.className = "devaito-form-status valid";
          // Ajouter une coche
          if (!statusElement.querySelector('.devaito-checkmark')) {
            const checkmark = document.createElement("span");
            checkmark.className = "devaito-checkmark";
            checkmark.innerHTML = " ✓";
            statusElement.appendChild(checkmark);
          }
        } else {
          statusElement.textContent = "Veuillez remplir le formulaire d'adresse";
          statusElement.className = "devaito-form-status invalid";
          // Supprimer la coche si elle existe
          const checkmark = statusElement.querySelector('.devaito-checkmark');
          if (checkmark) {
            statusElement.removeChild(checkmark);
          }
        }
      }

      // Vérifier l'état du formulaire initial
      checkFormStatus();

      // Écouter les changements sur les champs d'adresse de notre widget
      inputs.forEach(input => {
        input.addEventListener('input', checkFormStatus);
        input.addEventListener('change', checkFormStatus);
      });

      // Écouter les changements sur le formulaire existant (si on est sur la page panier/checkout)
      if (isCartOrCheckoutPage()) {
        const formFields = [
          '#fullname', '#email', '#phone', '#address', 
          '#postal-code', '#country', '#state', '#city'
        ];
        
        formFields.forEach(selector => {
          const field = document.querySelector(selector);
          if (field) {
            field.addEventListener('input', syncWithPageForm);
            field.addEventListener('change', syncWithPageForm);
          }
        });
        
        // Synchroniser initialement
        syncWithPageForm();
      }

      // Fonction pour vérifier si le formulaire est rempli
      function isFormFilled() {
        const requiredFields = [inputs[0], inputs[1], inputs[2], inputs[4], inputs[6]]; // name, street, city, zip, email
        return requiredFields.every(field => field.value.trim() !== '');
      }

      // Récupération des informations des produits
      function getProductInfo(){
        var path = window.location.pathname.toLowerCase();
        prodLog.info(`Page: ${path}`);

        var products = [];

        // Page produit unique
        if (path.includes("/product/") || path.includes("/products/")) {
          const slug = path.split("/product/")[1]?.split("/")[0] || 
                       path.split("/products/")[1]?.split("/")[0];
          if (slug) {
            const productNameElement = document.querySelector('h1.product-title, h1.product-name');
            const quantityInput = document.querySelector('input[type="number"].quantity-input');
            
            const name = productNameElement ? productNameElement.textContent.trim() : 'Produit';
            const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
            
            products.push({
              slug: slug,
              name: name,
              quantity: quantity
            });
            
            prodLog.info(`Page produit, slug: ${slug}, nom: ${name}, quantité: ${quantity}`);
          }
        } 
        // Page panier ou checkout
        else if (isCartOrCheckoutPage()) {
          // Essayer de récupérer depuis le localStorage
          let cartItems = JSON.parse(localStorage.getItem('cartItems') || localStorage.getItem('checkoutItemsValide') || '[]');
          
          if (cartItems.length > 0) {
            cartItems.forEach(item => {
              products.push({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                permalink: item.permalink
              });
            });
            prodLog.info(`${products.length} produits récupérés depuis le localStorage`);
          } else {
            // Fallback: récupérer depuis le DOM
            document.querySelectorAll('.cart-item, .product-item, .order-item').forEach(function(item){
              const nameElement = item.querySelector('.product-name, .item-name');
              const quantityInput = item.querySelector('input[type="number"]');
              const id = item.getAttribute('data-product-id') || item.getAttribute('data-id');
              
              if (nameElement) {
                const name = nameElement.textContent.trim();
                const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
                
                products.push({
                  id: id,
                  name: name,
                  quantity: quantity
                });
                
                prodLog.debug(`Produit panier: ${name}, quantité: ${quantity}`);
              }
            });
          }
        }
        
        if (products.length === 0) {
          prodLog.info("Aucun produit détecté, utilisation du produit de démo");
          products = [{name: "Product Demo", quantity: 1}];
        }
        
        prodLog.info(`${products.length} produits détectés`);
        return products;
      }

      // Récupération shop + produits
      async function fetchShopData(){
        try{
          var productInfo = getProductInfo();
          
          prodLog.info(`Envoi requête avec ${productInfo.length} produits`);
          var res = await fetch(CONFIG.API_BASE+"/get_shop_data_v2",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
              shopId: shopId, 
              products: productInfo,
              // Inclure les slugs et les IDs selon ce qui est disponible
              slugs: productInfo.filter(p => p.slug).map(p => p.slug),
              productIds: productInfo.filter(p => p.id).map(p => p.id)
            })
          });
          
          if(!res.ok) throw new Error(`Erreur API: ${res.status}`);
          
          var data = await res.json();
          prodLog.info("Réponse API reçue");
          
          products = data.products.map(function(p, index){
            return {
              id: index,
              name: p.name,
              quantity: productInfo[index] ? productInfo[index].quantity : 1,
              dimensions: p.dimensions,
              fromAddress: p.shippingAddress
            };
          });
          
          productsContainer.innerHTML="";
          if (products.length === 0) {
            prodLog.info("Aucun produit dans la réponse");
            productsContainer.innerHTML = "<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible";
          } else {
            prodLog.info(`${products.length} produits chargés`);
            products.forEach(function(p){
              var productCard = document.createElement("div");
              productCard.className = "devaito-product-item";
              
              var productInfoDiv = document.createElement("div");
              productInfoDiv.className = "devaito-product-info";
              
              var productName = document.createElement("div");
              productName.className = "devaito-product-name";
              productName.textContent = p.name;
              
              var productDetails = document.createElement("div");
              productDetails.className = "devaito-product-details";
              productDetails.textContent = `${p.dimensions.length}×${p.dimensions.width}×${p.dimensions.height}cm, ${p.quantity} unité(s)`;
              
              productInfoDiv.appendChild(productName);
              productInfoDiv.appendChild(productDetails);
              
              var quantityDisplay = document.createElement("div");
              quantityDisplay.className = "devaito-product-quantity";
              quantityDisplay.textContent = p.quantity;
              quantityDisplay.readOnly = true;
              
              productCard.appendChild(productInfoDiv);
              productCard.appendChild(quantityDisplay);
              productsContainer.appendChild(productCard);
            });
          }
        }catch(err){
          showError("Erreur de chargement des produits");
          prodLog.error("Erreur fetchShopData", err.message);
        }
      }

      function getToAddress(){
        // Si on est sur une page panier/checkout, on utilise les données du formulaire de la page
        if (isCartOrCheckoutPage()) {
          const formData = getFormDataFromPage();
          return {
            name: formData.name || "",
            street1: formData.street || "",
            city: formData.city || "",
            state: formData.state || "",
            zip: formData.zip || "",
            phone: formData.phone || "",
            email: formData.email || "",
            country: formData.country || "France"
          };
        } else {
          // Sinon, on utilise les champs de notre widget
          return {
            name: inputs[0].value||"",
            street1: inputs[1].value||"",
            city: inputs[2].value||"",
            state: inputs[3].value||"",
            zip: inputs[4].value||"",
            phone: inputs[5].value||"",
            email: inputs[6].value||"",
            country: "France" // Pays fixé à France comme demandé
          };
        }
      }

      function prepareRequests(){
        var groups={};
        products.forEach(function(prod){
          var key=JSON.stringify(prod.fromAddress);
          if(!groups[key]) groups[key]={from:prod.fromAddress, parcels:[]};
          
          // Pour chaque produit, créer un colis avec les dimensions adaptées à la quantité
          // On additionne le poids et adapte les dimensions si nécessaire
          const totalWeight = prod.dimensions.weight * prod.quantity;
          const adaptedDimensions = {
            ...prod.dimensions,
            weight: totalWeight
          };
          
          groups[key].parcels.push(adaptedDimensions);
        });
        
        var result=[];
        Object.keys(groups).forEach(function(k){
          result.push({from: groups[k].from, to:getToAddress(), parcels: groups[k].parcels});
        });
        
        prodLog.info(`${result.length} groupes d'expédition préparés`);
        return result;
      }

      function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
      }

      function hideError() {
        errorDiv.style.display = "none";
      }

      // Fonction pour calculer le prix total
      function calculateTotal() {
        let total = 0;
        Object.keys(selectedRates).forEach(productId => {
          total += parseFloat(selectedRates[productId].price) || 0;
        });
        
        const totalDiv = document.getElementById("devaito-total");
        totalDiv.textContent = `Total estimation: ${total.toFixed(2)} EUR`;
        totalDiv.style.display = "block";
        
        // Afficher le bouton de validation si au moins un taux est sélectionné
        const validateBtn = document.getElementById("devaito-validate");
        validateBtn.style.display = Object.keys(selectedRates).length > 0 ? "block" : "none";
        
        return total;
      }

      // Bouton estimation
      estimateBtn.onclick = async function(){
        hideError();
        resultsDiv.innerHTML="";
        totalDiv.style.display = "none";
        validateBtn.style.display = "none";
        selectedRates = {};
        
        var originalHTML = estimateBtn.innerHTML;
        estimateBtn.innerHTML = "⏳ Calcul en cours...";
        estimateBtn.disabled = true;
        estimateBtn.style.background = "#9ca3af";
        
        prodLog.info("Début estimation");
        
        var toAddr=getToAddress();
        prodLog.debug("Adresse", toAddr);
        
        if(!toAddr.street1 || !toAddr.city || !toAddr.zip || !toAddr.email){
          showError("⚠️ Veuillez compléter tous les champs obligatoires");
          estimateBtn.innerHTML = originalHTML;
          estimateBtn.disabled = false;
          estimateBtn.style.background = "#00d084";
          prodLog.info("Champs incomplets");
          return;
        }
        
        await fetchShopData();
        if(!products.length){ 
          showError("❌ Aucun produit disponible pour l'estimation");
          estimateBtn.innerHTML = originalHTML;
          estimateBtn.disabled = false;
          estimateBtn.style.background = "#00d084";
          prodLog.info("Aucun produit");
          return; 
        }

        var reqs=prepareRequests();
        prodLog.debug("Requêtes préparées");

        try{
          var allRates=[];
          for(var req of reqs){
            prodLog.info(`Envoi requête pour ${req.parcels.length} colis`);
            prodLog.info(`Requête: ${req} `);
            var r = await fetch(CONFIG.API_BASE+"/getRates",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify(req)
            });
            if(!r.ok) throw new Error(`Erreur: ${r.status}`);
            
            var rates = await r.json();
            prodLog.info(`${rates.length} options reçues`);
            allRates.push(...rates);
          }
          
          resultsDiv.innerHTML="";
          if (allRates.length === 0) {
            resultsDiv.innerHTML = "<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>📭 Aucune option de livraison disponible";
            prodLog.info("Aucune option de livraison");
          } else {
            // Titre des résultats
            var resultsTitle = document.createElement("h4");
            resultsTitle.textContent = "Options de livraison";
            resultsTitle.style.cssText = "margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #374151;";
            resultsDiv.appendChild(resultsTitle);
            
            // Trier par prix croissant
            allRates.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            
            allRates.forEach(function(r, index){
              var rateCard = document.createElement("div");
              rateCard.className = "devaito-rate-card";
              rateCard.dataset.rateId = index;
              rateCard.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb;";
              
              var leftSection = document.createElement("div");
              leftSection.style.cssText = "display: flex; align-items: center; gap: 12px; flex: 1;";
              
              // Logo du transporteur
              var carrierLogo = document.createElement("img");
              if (r.img) {
                carrierLogo.src = r.img;
                carrierLogo.alt = r.carrier;
                carrierLogo.style.cssText = "width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;";
              } else {
                // Fallback avec emoji
                carrierLogo = document.createElement("div");
                carrierLogo.textContent = "🚚";
                carrierLogo.style.cssText = "width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;";
              }
              
              var serviceInfo = document.createElement("div");
              serviceInfo.style.cssText = "flex: 1;";
              
              var carrierService = document.createElement("div");
              carrierService.textContent = `${r.carrier} - ${r.service}`;
              carrierService.style.cssText = "font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;";
              
              var estimatedDays = document.createElement("div");
              if (r.estimated_days) {
                estimatedDays.textContent = `Livraison estimée: ${r.estimated_days} jour${r.estimated_days > 1 ? 's' : ''}`;
                estimatedDays.style.cssText = "font-size: 12px; color: #6b7280; margin-top: 2px;";
              }
              
              serviceInfo.appendChild(carrierService);
              if (r.estimated_days) serviceInfo.appendChild(estimatedDays);
              
              var priceSection = document.createElement("div");
              priceSection.style.cssText = "text-align: right;";
              
              var price = document.createElement("div");
              price.textContent = `${r.price} ${r.currency}`;
              price.style.cssText = "font-weight: 700; font-size: 16px; color: #00d084;";
              
              var badge = document.createElement("div");
              if (index === 0) {
                badge.textContent = "Le moins cher";
                badge.style.cssText = "font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;";
              }
              
              priceSection.appendChild(price);
              if (index === 0) priceSection.appendChild(badge);
              
              leftSection.appendChild(carrierLogo);
              leftSection.appendChild(serviceInfo);
              
              rateCard.appendChild(leftSection);
              rateCard.appendChild(priceSection);
              
              // Ajouter un événement de clic pour sélectionner cette option
              rateCard.addEventListener('click', function() {
                // Désélectionner toutes les autres options
                document.querySelectorAll('.devaito-rate-card').forEach(card => {
                  card.classList.remove('selected');
                });
                
                // Sélectionner cette option
                this.classList.add('selected');
                
                // Stocker la sélection pour ce produit
                // Pour l'instant, on suppose un seul produit, donc on utilise l'ID 0
                selectedRates[0] = r;
                
                // Calculer le total
                calculateTotal();
              });
              
              resultsDiv.appendChild(rateCard);
            });
            
            prodLog.info(`${allRates.length} options affichées`);
          }
        }catch(err){
          showError("❌ Erreur lors de l'estimation des frais de port");
          prodLog.error("Erreur estimation", err.message);
        }finally{
          estimateBtn.innerHTML = originalHTML;
          estimateBtn.disabled = false;
          estimateBtn.style.background = "#00d084";
        }
      };
      
      // Gestionnaire pour le bouton de validation
      validateBtn.onclick = async function() {
        if (Object.keys(selectedRates).length === 0) {
          showError("Veuillez sélectionner une option de livraison");
          return;
        }
        
        validateBtn.disabled = true;
        validateBtn.innerHTML = "⏳ Traitement...";
        
        try {
          // Récupérer les informations de la commande
          const orderData = {
            shopId: shopId,
            shopUrl: window.location.origin,
            customerEmail: getToAddress().email,
            products: products.map(p => ({
              name: p.name,
              quantity: p.quantity,
              dimensions: p.dimensions
            })),
            shippingOptions: selectedRates,
            totalPrice: calculateTotal(),
            shippingAddress: getToAddress()
          };
          
          prodLog.info("Envoi des données de commande à l'API");
          const response = await fetch(CONFIG.WAIT_COMMANDE_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
          });
          
          if (!response.ok) throw new Error("Erreur lors de l'envoi des données");
          
          const result = await response.json();
          prodLog.info("Commande enregistrée avec succès", result);
          
          // Afficher un message de succès
          showError("✅ Commande enregistrée avec succès! Vous allez être redirigé.");
          errorDiv.style.color = "#059669";
          errorDiv.style.background = "#f0fdf4";
          errorDiv.style.borderColor = "#bbf7d0";
          
          // Redirection ou autre action après succès
          setTimeout(() => {
            // Rediriger vers la page de confirmation ou de paiement
            // window.location.href = "/checkout/confirmation";
          }, 2000);
          
        } catch (error) {
          showError("❌ Erreur lors de l'enregistrement de la commande");
          prodLog.error("Erreur validation", error.message);
        } finally {
          validateBtn.disabled = false;
          validateBtn.innerHTML = "✅ Valider la commande";
        }
      };
      
      // Initialisation des données
      prodLog.info("Chargement initial");
      fetchShopData();
    }

    if(document.readyState==="loading"){
      document.addEventListener("DOMContentLoaded", initWidget);
    }else{
      initWidget();
    }
  })();
}