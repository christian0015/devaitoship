//embed-projet/FormComponent.js
import { getStore } from './store.js';
import { eventBus } from './EventBus.js';
import { getApiService } from './api.js';
import { prodLog, utils } from './config.js';
import { 
  isProductPage, 
  isCartOrCheckoutPage, 
  getFormDataFromPage,
  syncToPageForm as utilsSyncToPageForm,
  setupPageFormSync 
} from './utils.js';

export class FormComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.isFloating = options.isFloating || false;
    this.shopId = options.shopId;
    this.store = getStore();
    this.api = getApiService();
    
    this.elements = {
      widgetCard: null,
      content: null,
      floatingIcon: null,
      modal: null,
      overlay: null,
      inputs: {},
      selects: {}
    };
    
    this.unsubscribeStore = null;
  }

  init() {
    this.render();
    this.bindEvents();
    this.setupStoreSubscription();
    this.syncWithPageForm();
    
    this.loadCountries();
  }

  render() {
    this.createWidgetStructure();
    this.createAddressSection();
    
    // Pour le widget intégré, activer directement le contenu
    if (!this.isFloating && this.elements.content) {
      this.elements.content.style.display = "block";
    }
  }

  createWidgetStructure() {
    this.elements.widgetCard = document.createElement("div");
    this.elements.widgetCard.className = "devaito-card-widget";
    
    if (this.isFloating) {
      this.elements.widgetCard.className += " devaito-floating-widget";
      this.elements.widgetCard.style.cssText = `
        background: #00d084; 
        width: 60px; 
        height: 60px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 24px; 
        cursor: pointer; 
        box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3); 
        transition: all 0.3s ease;
        position: fixed;
        bottom: 150px;
        right: 20px;
        z-index: 10001;
      `;
      
      this.elements.floatingIcon = document.createElement("div");
      this.elements.floatingIcon.innerHTML = "📦";
      this.elements.floatingIcon.style.cssText = `
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: 100%; 
        height: 100%;
        cursor: pointer;
      `;
      this.elements.widgetCard.appendChild(this.elements.floatingIcon);
      
    } else {
      this.elements.widgetCard.style.cssText = `
        background: white; 
        width: 90%; 
        max-width: 500px; 
        border-radius: 12px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
        border: 1px solid #e5e7eb; 
        overflow: hidden; 
        margin: 20px auto; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      this.createHeader();
      this.elements.content = document.createElement("div");
      this.elements.content.id = "devaito-content";
      this.elements.content.style.cssText = "padding: 24px; background: white;";
      this.elements.widgetCard.appendChild(this.elements.content);
    }
    
    this.container.appendChild(this.elements.widgetCard);
  }

  createHeader() {
    const header = document.createElement("div");
    header.style.cssText = `
      padding: 20px; 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
      border-bottom: 1px solid #e5e7eb;
    `;

    const toggleContainer = document.createElement("label");
    toggleContainer.className = "devaito-toggle-container";
    toggleContainer.htmlFor = "devaito-toggle-checkbox";
    toggleContainer.style.cssText = `
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      cursor: pointer; 
      padding: 8px; 
      border-radius: 8px; 
      background: transparent;
    `;
    
    const toggleText = document.createElement("div");
    toggleText.style.cssText = "display: flex; align-items: center; gap: 12px;";
    
    const icon = document.createElement("div");
    icon.innerHTML = "📦";
    icon.style.cssText = "font-size: 20px;";
    
    const textContent = document.createElement("div");
    const title = document.createElement("div");
    title.textContent = "Estimation livraison";
    title.style.cssText = "font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";
    
    const subtitle = document.createElement("div");
    subtitle.textContent = "Calculez vos frais de port";
    subtitle.style.cssText = "font-size: 13px; color: #6b7280; margin-top: 2px;";
    
    textContent.appendChild(title);
    textContent.appendChild(subtitle);
    toggleText.appendChild(icon);
    toggleText.appendChild(textContent);
    
    const switchContainer = document.createElement("div");
    switchContainer.style.cssText = "position: relative; width: 48px; height: 24px;";
    
    this.elements.checkbox = document.createElement("input");
    this.elements.checkbox.type = "checkbox";
    this.elements.checkbox.id = "devaito-toggle-checkbox";
    this.elements.checkbox.checked = true;
    this.elements.checkbox.style.cssText = `
      position: absolute; 
      opacity: 0; 
      width: 100%; 
      height: 100%; 
      cursor: pointer; 
      z-index: 2;
    `;
    
    const switchTrack = document.createElement("div");
    switchTrack.style.cssText = `
      width: 48px; 
      height: 24px; 
      background: #00d084; 
      border-radius: 12px; 
      position: relative; 
      transition: all 0.3s ease;
    `;
    
    const switchThumb = document.createElement("div");
    switchThumb.style.cssText = `
      width: 20px; 
      height: 20px; 
      background: white; 
      border-radius: 50%; 
      position: absolute; 
      top: 2px; 
      left: 2px; 
      transition: all 0.3s ease; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transform: translateX(24px);
    `;
    
    switchTrack.appendChild(switchThumb);
    switchContainer.appendChild(this.elements.checkbox);
    switchContainer.appendChild(switchTrack);
    
    toggleContainer.appendChild(toggleText);
    toggleContainer.appendChild(switchContainer);
    header.appendChild(toggleContainer);
    this.elements.widgetCard.insertBefore(header, this.elements.content);
  }

  createAddressSection() {
    if (!this.elements.content && !this.isFloating) {
      this.elements.content = document.createElement("div");
      this.elements.content.id = "devaito-content";
      this.elements.content.style.cssText = "padding: 24px; background: white;";
      this.elements.widgetCard.appendChild(this.elements.content);
    }
    
    const addressSection = document.createElement("div");
    addressSection.style.cssText = "margin-bottom: 20px;";
    
    const addressTitle = document.createElement("h4");
    addressTitle.textContent = "Adresse de livraison";
    addressTitle.style.cssText = `
      margin: 0 0 16px 0; 
      font-size: 14px; 
      font-weight: 600; 
      color: #374151; 
      display: flex; 
      align-items: center;
    `;
    
    this.elements.formStatus = document.createElement("span");
    this.elements.formStatus.id = "devaito-form-status";
    this.elements.formStatus.className = "devaito-form-status invalid";
    this.elements.formStatus.textContent = "Veuillez remplir le formulaire d'adresse";
    this.elements.formStatus.style.cssText = "font-size: 12px; margin-left: 10px;";
    
    addressTitle.appendChild(this.elements.formStatus);
    
    const addressGrid = document.createElement("div");
    addressGrid.className = "devaito-grid-responsive";
    addressGrid.style.cssText = "display: flex; flex-direction: column; gap: 12px;";

    const fields = [
      {name: "name", placeholder: "Nom complet", type: "text", autocomplete: "name"},
      {name: "street", placeholder: "Adresse", type: "text", autocomplete: "street-address"},
      {name: "phone", placeholder: "Téléphone", type: "tel", autocomplete: "tel"},
      {name: "email", placeholder: "Email", type: "email", autocomplete: "email"}
    ];
    
    fields.forEach(field => {
      const input = document.createElement("input");
      input.type = field.type;
      input.placeholder = field.placeholder;
      input.name = field.name;
      input.autocomplete = field.autocomplete;
      input.className = "devaito-input-field";
      input.style.cssText = `
        width: 100%; 
        padding: 12px 16px; 
        border: 1.5px solid #d1d5db; 
        border-radius: 8px; 
        font-size: 14px; 
        background: #f9fafb; 
        color: #1f2937; 
        box-sizing: border-box;
      `;
      
      this.elements.inputs[field.name] = input;
      addressGrid.appendChild(input);
    });

    this.elements.selects.country = this.createSelect('devaito-country', 'Chargement des pays...');
    this.elements.selects.state = this.createSelect('devaito-state', 'Sélectionnez d\'abord un pays');
    this.elements.selects.city = this.createSelect('devaito-city', 'Sélectionnez d\'abord une région');
    
    this.elements.inputs.zip = this.createInput('zip', 'Code postal', 'postal-code');
    
    addressGrid.appendChild(this.elements.selects.country);
    addressGrid.appendChild(this.elements.selects.state);
    addressGrid.appendChild(this.elements.selects.city);
    addressGrid.appendChild(this.elements.inputs.zip);
    
    addressSection.appendChild(addressTitle);
    addressSection.appendChild(addressGrid);
    
    if (this.isFloating) {
      // Stocker la section d'adresse pour le modal
      this.elements.modalAddressSection = addressSection;
    } else {
      this.elements.content.appendChild(addressSection);
    }
  }

  createSelect(id, placeholder) {
    const select = document.createElement("select");
    select.id = id;
    select.className = "devaito-select-field";
    select.innerHTML = `<option value="">${placeholder}</option>`;
    select.style.cssText = `
      width: 100%; 
      padding: 12px 16px; 
      border: 1.5px solid #d1d5db; 
      border-radius: 8px; 
      font-size: 14px; 
      background: #f9fafb; 
      color: #1f2937; 
      box-sizing: border-box;
    `;
    return select;
  }

  createInput(name, placeholder, autocomplete) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.name = name;
    input.autocomplete = autocomplete;
    input.className = "devaito-input-field";
    input.style.cssText = `
      width: 100%; 
      padding: 12px 16px; 
      border: 1.5px solid #d1d5db; 
      border-radius: 8px; 
      font-size: 14px; 
      background: #f9fafb; 
      color: #1f2937; 
      box-sizing: border-box;
    `;
    return input;
  }

  async loadCountries() {
    try {
      const countries = await this.api.loadCountries();
      this.elements.selects.country.innerHTML = '<option value="">Sélectionnez un pays</option>';
      
      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.id;
        option.textContent = country.name;
        option.dataset.code = country.code;
        this.elements.selects.country.appendChild(option);
      });
    } catch (error) {
      prodLog.error("Erreur chargement pays:", error);
    }
  }

  bindEvents() {
    this.elements.selects.country.addEventListener('change', async (e) => {
      const countryId = e.target.value;
      await this.loadStates(countryId);
      this.elements.selects.city.innerHTML = '<option value="">Sélectionnez d\'abord une région</option>';
      this.updateStoreFromForm();
    });
    
    this.elements.selects.state.addEventListener('change', async (e) => {
      const stateId = e.target.value;
      await this.loadCities(stateId);
      this.updateStoreFromForm();
    });
    
    this.elements.selects.city.addEventListener('change', () => {
      this.updateStoreFromForm();
    });
    
    Object.values(this.elements.inputs).forEach(input => {
      input.addEventListener('input', () => this.updateStoreFromForm());
      input.addEventListener('change', () => this.updateStoreFromForm());
    });
    
    if (this.isFloating) {
      this.elements.floatingIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.expandFloatingWidget();
      });
      
      this.elements.widgetCard.addEventListener('click', (e) => {
        if (e.target === this.elements.widgetCard) {
          this.expandFloatingWidget();
        }
      });
    } else if (this.elements.checkbox) {
      this.elements.checkbox.addEventListener('change', () => {
        if (this.elements.checkbox.checked) {
          this.elements.content.style.display = "block";
        } else {
          this.elements.content.style.display = "none";
        }
      });
    }
    
    if (!isProductPage() && !isCartOrCheckoutPage()) {
      setupPageFormSync(() => this.syncWithPageForm());
    }
  }

  async loadStates(countryId) {
    try {
      const states = await this.api.loadStates(countryId);
      this.elements.selects.state.innerHTML = '<option value="">Sélectionnez une région</option>';
      
      states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.id;
        option.textContent = state.name;
        this.elements.selects.state.appendChild(option);
      });
    } catch (error) {
      prodLog.error("Erreur chargement régions:", error);
    }
  }

  async loadCities(stateId) {
    try {
      const cities = await this.api.loadCities(stateId);
      this.elements.selects.city.innerHTML = '<option value="">Sélectionnez une ville</option>';
      
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.name;
        this.elements.selects.city.appendChild(option);
      });
    } catch (error) {
      prodLog.error("Erreur chargement villes:", error);
    }
  }

  expandFloatingWidget() {
    this.createModalContent();
    
    this.elements.modal = document.createElement("div");
    this.elements.modal.className = "devaito-floating-expanded-modal";
    this.elements.modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      z-index: 10002;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `;
    
    const floatingHeader = document.createElement("div");
    floatingHeader.className = "devaito-floating-header";
    floatingHeader.style.cssText = `
      padding: 16px; 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
      border-bottom: 1px solid #e5e7eb; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    `;
    
    const floatingTitle = document.createElement("div");
    floatingTitle.className = "devaito-floating-title";
    floatingTitle.textContent = "Estimation livraison";
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "devaito-close-btn";
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
    `;
    
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.collapseFloatingWidget();
    });
    
    floatingHeader.appendChild(floatingTitle);
    floatingHeader.appendChild(closeBtn);
    
    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      padding: 24px; 
      background: white; 
      flex-grow: 1; 
      overflow-y: auto;
    `;
    
    modalContent.appendChild(this.elements.modalAddressSection);
    
    this.elements.modal.appendChild(floatingHeader);
    this.elements.modal.appendChild(modalContent);
    
    document.body.appendChild(this.elements.modal);
    
    this.createOverlay();
  }

  createModalContent() {
    this.elements.modalAddressSection = this.elements.modalAddressSection || document.createElement("div");
    this.elements.modalAddressSection.style.cssText = "margin-bottom: 20px;";
    
    const addressTitle = document.createElement("h4");
    addressTitle.textContent = "Adresse de livraison";
    addressTitle.style.cssText = `
      margin: 0 0 16px 0; 
      font-size: 14px; 
      font-weight: 600; 
      color: #374151; 
      display: flex; 
      align-items: center;
    `;
    
    const formStatus = document.createElement("span");
    formStatus.id = "devaito-modal-form-status";
    formStatus.className = "devaito-form-status invalid";
    formStatus.textContent = "Veuillez remplir le formulaire d'adresse";
    formStatus.style.cssText = "font-size: 12px; margin-left: 10px;";
    
    addressTitle.appendChild(formStatus);
    
    const addressGrid = document.createElement("div");
    addressGrid.className = "devaito-grid-responsive";
    addressGrid.style.cssText = "display: flex; flex-direction: column; gap: 12px;";

    const fields = [
      {name: "name", placeholder: "Nom complet", type: "text", autocomplete: "name"},
      {name: "street", placeholder: "Adresse", type: "text", autocomplete: "street-address"},
      {name: "phone", placeholder: "Téléphone", type: "tel", autocomplete: "tel"},
      {name: "email", placeholder: "Email", type: "email", autocomplete: "email"}
    ];
    
    fields.forEach(field => {
      const input = document.createElement("input");
      input.type = field.type;
      input.placeholder = field.placeholder;
      input.name = field.name;
      input.autocomplete = field.autocomplete;
      input.className = "devaito-input-field";
      input.style.cssText = `
        width: 100%; 
        padding: 12px 16px; 
        border: 1.5px solid #d1d5db; 
        border-radius: 8px; 
        font-size: 14px; 
        background: #f9fafb; 
        color: #1f2937; 
        box-sizing: border-box;
      `;
      
      input.value = this.elements.inputs[field.name]?.value || "";
      input.addEventListener('input', () => {
        if (this.elements.inputs[field.name]) {
          this.elements.inputs[field.name].value = input.value;
        }
        this.updateStoreFromForm();
      });
      
      addressGrid.appendChild(input);
    });

    const countrySelect = this.createSelect('devaito-modal-country', 'Sélectionnez un pays');
    const stateSelect = this.createSelect('devaito-modal-state', 'Sélectionnez d\'abord un pays');
    const citySelect = this.createSelect('devaito-modal-city', 'Sélectionnez d\'abord une région');
    
    const zipInput = this.createInput('zip', 'Code postal', 'postal-code');
    zipInput.value = this.elements.inputs.zip?.value || "";
    zipInput.addEventListener('input', () => {
      if (this.elements.inputs.zip) {
        this.elements.inputs.zip.value = zipInput.value;
      }
      this.updateStoreFromForm();
    });
    
    addressGrid.appendChild(countrySelect);
    addressGrid.appendChild(stateSelect);
    addressGrid.appendChild(citySelect);
    addressGrid.appendChild(zipInput);
    
    this.elements.modalAddressSection.innerHTML = '';
    this.elements.modalAddressSection.appendChild(addressTitle);
    this.elements.modalAddressSection.appendChild(addressGrid);
    
    this.loadCountriesForModal(countrySelect, stateSelect, citySelect);
  }

  async loadCountriesForModal(countrySelect, stateSelect, citySelect) {
    try {
      const countries = await this.api.loadCountries();
      countrySelect.innerHTML = '<option value="">Sélectionnez un pays</option>';
      
      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.id;
        option.textContent = country.name;
        option.dataset.code = country.code;
        if (this.elements.selects.country.value === country.id) {
          option.selected = true;
        }
        countrySelect.appendChild(option);
      });
      
      countrySelect.addEventListener('change', async (e) => {
        const countryId = e.target.value;
        await this.loadStatesForModal(countryId, stateSelect);
        citySelect.innerHTML = '<option value="">Sélectionnez d\'abord une région</option>';
        this.updateStoreFromForm();
      });
      
      stateSelect.addEventListener('change', async (e) => {
        const stateId = e.target.value;
        await this.loadCitiesForModal(stateId, citySelect);
        this.updateStoreFromForm();
      });
      
      citySelect.addEventListener('change', () => {
        this.updateStoreFromForm();
      });
      
      if (this.elements.selects.country.value) {
        await this.loadStatesForModal(this.elements.selects.country.value, stateSelect);
      }
      
    } catch (error) {
      prodLog.error("Erreur chargement pays modal:", error);
    }
  }

  async loadStatesForModal(countryId, stateSelect) {
    try {
      const states = await this.api.loadStates(countryId);
      stateSelect.innerHTML = '<option value="">Sélectionnez une région</option>';
      
      states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.id;
        option.textContent = state.name;
        if (this.elements.selects.state.value === state.id) {
          option.selected = true;
        }
        stateSelect.appendChild(option);
      });
    } catch (error) {
      prodLog.error("Erreur chargement régions modal:", error);
    }
  }

  async loadCitiesForModal(stateId, citySelect) {
    try {
      const cities = await this.api.loadCities(stateId);
      citySelect.innerHTML = '<option value="">Sélectionnez une ville</option>';
      
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.name;
        if (this.elements.selects.city.value === city.id) {
          option.selected = true;
        }
        citySelect.appendChild(option);
      });
    } catch (error) {
      prodLog.error("Erreur chargement villes modal:", error);
    }
  }

  createOverlay() {
    this.elements.overlay = document.createElement('div');
    this.elements.overlay.id = 'devaito-overlay';
    this.elements.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      display: block;
    `;
    
    document.body.appendChild(this.elements.overlay);
    
    this.elements.overlay.addEventListener('click', () => {
      this.collapseFloatingWidget();
    });
  }

  collapseFloatingWidget() {
    if (this.elements.modal && this.elements.modal.parentNode) {
      this.elements.modal.parentNode.removeChild(this.elements.modal);
      this.elements.modal = null;
    }
    
    if (this.elements.overlay && this.elements.overlay.parentNode) {
      this.elements.overlay.parentNode.removeChild(this.elements.overlay);
      this.elements.overlay = null;
    }
  }

  updateStoreFromForm() {
    const address = this.getFormAddress();
    const isValid = this.isFormValid(address);
    
    this.store.setState({
      clientAddress: address,
      formStatus: isValid ? 'valid' : 'invalid'
    });
    
    this.updateFormStatusUI(isValid);
    this.syncToPageForm(address);
  }

  getFormAddress() {
    const countryOption = this.elements.selects.country.options[this.elements.selects.country.selectedIndex];
    const stateOption = this.elements.selects.state.options[this.elements.selects.state.selectedIndex];
    const cityOption = this.elements.selects.city.options[this.elements.selects.city.selectedIndex];
    
    return {
      name: this.elements.inputs.name?.value || "",
      street1: this.elements.inputs.street?.value || "",
      city: cityOption ? cityOption.text : "",
      state: stateOption ? stateOption.text : "",
      zip: this.elements.inputs.zip?.value || "",
      phone: this.elements.inputs.phone?.value || "",
      email: this.elements.inputs.email?.value || "",
      country: countryOption ? countryOption.dataset.code : 'FR'
    };
  }

  isFormValid(address) {
    return address.street1 && address.city && address.zip && 
           address.email && address.country && utils.isValidEmail(address.email);
  }

  updateFormStatusUI(isValid) {
    const statusText = isValid ? "Formulaire complété" : "Veuillez remplir le formulaire d'adresse";
    const statusClass = isValid ? "devaito-form-status valid" : "devaito-form-status invalid";
    
    if (this.elements.formStatus) {
      this.elements.formStatus.textContent = statusText;
      this.elements.formStatus.className = statusClass;
    }
    
    const modalStatus = document.getElementById('devaito-modal-form-status');
    if (modalStatus) {
      modalStatus.textContent = statusText;
      modalStatus.className = statusClass;
    }
  }

  syncWithPageForm() {
    if (isProductPage() || isCartOrCheckoutPage()) {
      return;
    }
    
    const formData = getFormDataFromPage();
    
    if (formData.name && this.elements.inputs.name) {
      this.elements.inputs.name.value = formData.name;
    }
    if (formData.street && this.elements.inputs.street) {
      this.elements.inputs.street.value = formData.street;
    }
    if (formData.phone && this.elements.inputs.phone) {
      this.elements.inputs.phone.value = formData.phone;
    }
    if (formData.email && this.elements.inputs.email) {
      this.elements.inputs.email.value = formData.email;
    }
    if (formData.zip && this.elements.inputs.zip) {
      this.elements.inputs.zip.value = formData.zip;
    }
    
    this.updateStoreFromForm();
  }

  syncToPageForm(address) {
    utilsSyncToPageForm(address);
  }

  setupStoreSubscription() {
    this.unsubscribeStore = this.store.subscribe((oldState, newState) => {
      if (oldState.formStatus !== newState.formStatus) {
        this.updateFormStatusUI(newState.formStatus === 'valid');
      }
    });
  }

  destroy() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
    
    this.collapseFloatingWidget();
  }
}