"use strict";(()=>{var E={API_BASE:"https://devaitoship.vercel.app/api",DEBUG:!0,MAX_HEIGHT:100,DEFAULT_DIMENSIONS:{length:20,width:15,height:10,weight:1.5,distance_unit:"cm",mass_unit:"kg"}},u={isInBuilder:()=>window.location.href.includes("/admin/builder"),isSlugPage:()=>{let r=window.location.pathname.toLowerCase();return r.includes("/checkout")||r.includes("/cart")||r.includes("/panier")||r.includes("/product/")||r.includes("/products/")},isCartOrCheckoutPage:()=>{let r=window.location.pathname.toLowerCase();return r.includes("/cart")||r.includes("/panier")||r.includes("/checkout")},isProductPage:()=>{let r=window.location.pathname.toLowerCase();return r.includes("/product/")||r.includes("/products/")},mapCountryIdToCode:r=>({50:"CD",75:"FR",148:"MA"})[r]||"FR",getShopBaseUrl:()=>window.location.origin,formatPrice:(r,e="EUR")=>`${parseFloat(r).toFixed(2)} ${e}`,isValidEmail:r=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r),calculateAdjustedDimensions:(r,e)=>{let t=E.MAX_HEIGHT,s=r.height||10,i=r.width||15,n=r.length||20,o=r.weight||1.5,l=s*e,d=i,c=n;if(l>t){let p=Math.ceil(l/t);l=t,d=i*p}return{length:c,width:d,height:l,weight:o*e,distance_unit:r.distance_unit||"cm",mass_unit:r.mass_unit||"kg"}},getProductInfo:()=>{let r=window.location.pathname.toLowerCase(),e=[];if(u.isCartOrCheckoutPage()){let t=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");t.length>0?e=t.map(s=>({id:s.id,name:s.name,quantity:s.quantity,price:s.price})):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(s=>{let i=s.querySelector(".product-name, .item-name"),n=s.querySelector('input[type="number"]'),o=s.getAttribute("data-product-id")||s.getAttribute("data-id");i&&e.push({id:o,name:i.textContent.trim(),quantity:n&&parseInt(n.value)||1})})}else if(u.isProductPage()){let t=r.split("/product/")[1]?.split("/")[0]||r.split("/products/")[1]?.split("/")[0];if(t){let s=document.querySelector("h1.product-title, h1.product-name"),i=document.querySelector('input[type="number"].quantity-input');e.push({slug:t,name:s?s.textContent.trim():"Produit",quantity:i&&parseInt(i.value)||1})}}return e.length===0&&(e=[{name:"Product Demo",quantity:1}]),e},getFormDataFromPage:()=>{if(u.isProductPage()||u.isCartOrCheckoutPage())return{};let r={},e={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};return Object.keys(e).forEach(t=>{let s=e[t],i=document.querySelector(s);i&&(r[t]=i.value)}),r}},a={info:(...r)=>console.log("[DEV]",...r),error:(...r)=>console.error("[DEV-ERR]",...r),debug:(...r)=>E.DEBUG&&console.log("[DEV-DBG]",...r)};var{isInBuilder:D,isSlugPage:L,isCartOrCheckoutPage:v,isProductPage:b,mapCountryIdToCode:q,getShopBaseUrl:S,formatPrice:M,isValidEmail:H,calculateAdjustedDimensions:j,getProductInfo:$,getFormDataFromPage:z}=u;function P(r){if(b()||v())return;["#fullname","#email","#phone","#address","#postal-code","#country","#state","#city",'[name="name"]','[name="email"]','[name="phone"]','[name="address"]','[name="zip"]','[name="country"]','[name="state"]','[name="city"]'].forEach(t=>{document.querySelectorAll(t).forEach(i=>{i.addEventListener("input",r),i.addEventListener("change",r)})})}function R(r){if(b()||v())return;let e={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};Object.keys(e).forEach(t=>{let s=e[t],i=document.querySelector(s);if(i&&r[t]){i.value=r[t];let n=new Event("change",{bubbles:!0});i.dispatchEvent(n)}})}var I=class extends EventTarget{constructor(){super()}emit(e,t={}){this.dispatchEvent(new CustomEvent(e,{detail:t}))}on(e,t){return this.addEventListener(e,t),()=>this.off(e,t)}off(e,t){this.removeEventListener(e,t)}once(e,t){let s=i=>{t(i),this.off(e,s)};this.on(e,s)}},m=new I,h={ADDRESS_CHANGE:"addressChange",PRODUCTS_CHANGE:"productsChange",RATES_CHANGE:"ratesChange",FORM_STATUS_CHANGE:"formStatusChange",SHIPPING_REQUEST:"shippingRequest",SHIPPING_RESPONSE:"shippingResponse",VALIDATION_REQUEST:"validationRequest",VALIDATION_RESPONSE:"validationResponse",ERROR:"error",LOADING_START:"loadingStart",LOADING_END:"loadingEnd"};var k=class{constructor(){this.state={shopId:null,isFloating:!1,clientAddress:{name:"",street1:"",city:"",state:"",zip:"",phone:"",email:"",country:"FR"},products:[],selectedRates:{},formStatus:"invalid",isLoading:!1,error:null,shippingRates:[],shipmentData:null},this.subscribers=new Set}setState(e){let t={...this.state};this.state={...this.state,...e},this.notifySubscribers(t,this.state),e.clientAddress&&t.clientAddress!==e.clientAddress&&m.dispatchEvent(new CustomEvent("addressChange",{detail:e.clientAddress})),e.products&&t.products!==e.products&&m.dispatchEvent(new CustomEvent("productsChange",{detail:e.products})),e.selectedRates&&t.selectedRates!==e.selectedRates&&m.dispatchEvent(new CustomEvent("ratesChange",{detail:e.selectedRates}))}getClientAddress(){return this.state.clientAddress}getProducts(){return this.state.products}getSelectedRates(){return this.state.selectedRates}getFormStatus(){return this.state.formStatus}subscribe(e){return this.subscribers.add(e),()=>this.subscribers.delete(e)}notifySubscribers(e,t){this.subscribers.forEach(s=>s(e,t))}isFormValid(){let e=this.state.clientAddress;return e.street1&&e.city&&e.zip&&e.email&&e.country}getTotalPrice(){return Object.values(this.state.selectedRates).reduce((e,t)=>e+(parseFloat(t.price)||0),0)}clearError(){this.setState({error:null})}setError(e){this.setState({error:e}),a.error("Store error:",e)}},f=null;function N(r={}){return f||(f=new k,f.setState(r),window.__DEVAITO_STORE__=f),f}function x(){if(!f)throw new Error("Store non initialis\xE9. Appelez initStore() d'abord.");return f}var F=class{constructor(){this.baseUrl=E.API_BASE}async fetchShopData(e,t){try{m.emit(h.LOADING_START,{action:"fetchShopData"}),a.info(`Envoi requ\xEAte avec ${t.length} produits`);let s=await fetch(`${this.baseUrl}/get_shop_data_v2`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shopId:e,products:t,slugs:t.filter(n=>n.slug).map(n=>n.slug),productIds:t.filter(n=>n.id).map(n=>n.id)})});if(!s.ok)throw new Error(`Erreur API: ${s.status}`);let i=await s.json();return a.info("R\xE9ponse API re\xE7ue"),m.emit(h.LOADING_END,{action:"fetchShopData"}),i}catch(s){throw m.emit(h.ERROR,{action:"fetchShopData",error:s.message}),s}}async getShippingRates(e){try{m.emit(h.LOADING_START,{action:"getShippingRates"});let t=[];for(let s of e){a.info(`Envoi requ\xEAte pour ${s.parcels.length} colis`);let i=await fetch(`${this.baseUrl}/getRates`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!i.ok)throw new Error(`Erreur: ${i.status}`);let n=await i.json();a.info(`${n.length} options re\xE7ues`),n.forEach(o=>{o.productId=0,t.push(o)})}return m.emit(h.LOADING_END,{action:"getShippingRates"}),m.emit(h.SHIPPING_RESPONSE,{rates:t}),t}catch(t){throw m.emit(h.ERROR,{action:"getShippingRates",error:t.message}),t}}async createLabel(e){try{m.emit(h.LOADING_START,{action:"createLabel"}),a.info("Envoi \xE0 l'API create-label:",e);let t=await fetch(`${this.baseUrl}/create-label`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let i=await t.text();throw new Error(`Erreur API: ${t.status} - ${i}`)}let s=await t.json();return a.info("R\xE9ponse create-label:",s),m.emit(h.LOADING_END,{action:"createLabel"}),m.emit(h.VALIDATION_RESPONSE,{result:s}),s}catch(t){throw m.emit(h.ERROR,{action:"createLabel",error:t.message}),t}}async loadCountries(){try{let e=S(),t=await fetch(`${e}/api/v1/ecommerce-core/get-countries`);if(!t.ok)throw new Error("Erreur de chargement des pays");return(await t.json()).data?.countries||[]}catch(e){return a.error("Erreur chargement pays:",e),[{id:"75",name:"France",code:"FR"},{id:"148",name:"Maroc",code:"MA"},{id:"50",name:"R\xE9publique D\xE9mocratique du Congo",code:"CD"}]}}async loadStates(e){if(!e)return[];try{let t=S(),s=await fetch(`${t}/api/v1/ecommerce-core/get-states-of-countries`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({country_id:e})});if(!s.ok)throw new Error("Erreur de chargement des r\xE9gions");return(await s.json()).data?.states||[]}catch(t){return a.error("Erreur chargement r\xE9gions:",t),[]}}async loadCities(e){if(!e)return[];try{let t=S(),s=await fetch(`${t}/api/v1/ecommerce-core/get-cities-of-state`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({state_id:e})});if(!s.ok)throw new Error("Erreur de chargement des villes");return(await s.json()).data?.cities||[]}catch(t){return a.error("Erreur chargement villes:",t),[]}}},A=null;function y(){return A||(A=new F),A}var C=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.shopId=t.shopId,this.store=x(),this.api=y(),this.elements={widgetCard:null,content:null,floatingIcon:null,modal:null,overlay:null,inputs:{},selects:{}},this.unsubscribeStore=null}init(){this.render(),this.bindEvents(),this.setupStoreSubscription(),this.syncWithPageForm(),this.loadCountries()}render(){this.createWidgetStructure(),this.createAddressSection(),!this.isFloating&&this.elements.content&&(this.elements.content.style.display="block")}createWidgetStructure(){this.elements.widgetCard=document.createElement("div"),this.elements.widgetCard.className="devaito-card-widget",this.isFloating?(this.elements.widgetCard.className+=" devaito-floating-widget",this.elements.widgetCard.style.cssText=`
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
      `,this.elements.floatingIcon=document.createElement("div"),this.elements.floatingIcon.innerHTML="\u{1F4E6}",this.elements.floatingIcon.style.cssText=`
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: 100%; 
        height: 100%;
        cursor: pointer;
      `,this.elements.widgetCard.appendChild(this.elements.floatingIcon)):(this.elements.widgetCard.style.cssText=`
        background: white; 
        width: 90%; 
        max-width: 500px; 
        border-radius: 12px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
        border: 1px solid #e5e7eb; 
        overflow: hidden; 
        margin: 20px auto; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `,this.createHeader(),this.elements.content=document.createElement("div"),this.elements.content.id="devaito-content",this.elements.content.style.cssText="padding: 24px; background: white;",this.elements.widgetCard.appendChild(this.elements.content)),this.container.appendChild(this.elements.widgetCard)}createHeader(){let e=document.createElement("div");e.style.cssText=`
      padding: 20px; 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
      border-bottom: 1px solid #e5e7eb;
    `;let t=document.createElement("label");t.className="devaito-toggle-container",t.htmlFor="devaito-toggle-checkbox",t.style.cssText=`
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      cursor: pointer; 
      padding: 8px; 
      border-radius: 8px; 
      background: transparent;
    `;let s=document.createElement("div");s.style.cssText="display: flex; align-items: center; gap: 12px;";let i=document.createElement("div");i.innerHTML="\u{1F4E6}",i.style.cssText="font-size: 20px;";let n=document.createElement("div"),o=document.createElement("div");o.textContent="Estimation livraison",o.style.cssText="font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";let l=document.createElement("div");l.textContent="Calculez vos frais de port",l.style.cssText="font-size: 13px; color: #6b7280; margin-top: 2px;",n.appendChild(o),n.appendChild(l),s.appendChild(i),s.appendChild(n);let d=document.createElement("div");d.style.cssText="position: relative; width: 48px; height: 24px;",this.elements.checkbox=document.createElement("input"),this.elements.checkbox.type="checkbox",this.elements.checkbox.id="devaito-toggle-checkbox",this.elements.checkbox.checked=!0,this.elements.checkbox.style.cssText=`
      position: absolute; 
      opacity: 0; 
      width: 100%; 
      height: 100%; 
      cursor: pointer; 
      z-index: 2;
    `;let c=document.createElement("div");c.style.cssText=`
      width: 48px; 
      height: 24px; 
      background: #00d084; 
      border-radius: 12px; 
      position: relative; 
      transition: all 0.3s ease;
    `;let p=document.createElement("div");p.style.cssText=`
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
    `,c.appendChild(p),d.appendChild(this.elements.checkbox),d.appendChild(c),t.appendChild(s),t.appendChild(d),e.appendChild(t),this.elements.widgetCard.insertBefore(e,this.elements.content)}createAddressSection(){!this.elements.content&&!this.isFloating&&(this.elements.content=document.createElement("div"),this.elements.content.id="devaito-content",this.elements.content.style.cssText="padding: 24px; background: white;",this.elements.widgetCard.appendChild(this.elements.content));let e=document.createElement("div");e.style.cssText="margin-bottom: 20px;";let t=document.createElement("h4");t.textContent="Adresse de livraison",t.style.cssText=`
      margin: 0 0 16px 0; 
      font-size: 14px; 
      font-weight: 600; 
      color: #374151; 
      display: flex; 
      align-items: center;
    `,this.elements.formStatus=document.createElement("span"),this.elements.formStatus.id="devaito-form-status",this.elements.formStatus.className="devaito-form-status invalid",this.elements.formStatus.textContent="Veuillez remplir le formulaire d'adresse",this.elements.formStatus.style.cssText="font-size: 12px; margin-left: 10px;",t.appendChild(this.elements.formStatus);let s=document.createElement("div");s.className="devaito-grid-responsive",s.style.cssText="display: flex; flex-direction: column; gap: 12px;",[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}].forEach(n=>{let o=document.createElement("input");o.type=n.type,o.placeholder=n.placeholder,o.name=n.name,o.autocomplete=n.autocomplete,o.className="devaito-input-field",o.style.cssText=`
        width: 100%; 
        padding: 12px 16px; 
        border: 1.5px solid #d1d5db; 
        border-radius: 8px; 
        font-size: 14px; 
        background: #f9fafb; 
        color: #1f2937; 
        box-sizing: border-box;
      `,this.elements.inputs[n.name]=o,s.appendChild(o)}),this.elements.selects.country=this.createSelect("devaito-country","Chargement des pays..."),this.elements.selects.state=this.createSelect("devaito-state","S\xE9lectionnez d'abord un pays"),this.elements.selects.city=this.createSelect("devaito-city","S\xE9lectionnez d'abord une r\xE9gion"),this.elements.inputs.zip=this.createInput("zip","Code postal","postal-code"),s.appendChild(this.elements.selects.country),s.appendChild(this.elements.selects.state),s.appendChild(this.elements.selects.city),s.appendChild(this.elements.inputs.zip),e.appendChild(t),e.appendChild(s),this.isFloating?this.elements.modalAddressSection=e:this.elements.content.appendChild(e)}createSelect(e,t){let s=document.createElement("select");return s.id=e,s.className="devaito-select-field",s.innerHTML=`<option value="">${t}</option>`,s.style.cssText=`
      width: 100%; 
      padding: 12px 16px; 
      border: 1.5px solid #d1d5db; 
      border-radius: 8px; 
      font-size: 14px; 
      background: #f9fafb; 
      color: #1f2937; 
      box-sizing: border-box;
    `,s}createInput(e,t,s){let i=document.createElement("input");return i.type="text",i.placeholder=t,i.name=e,i.autocomplete=s,i.className="devaito-input-field",i.style.cssText=`
      width: 100%; 
      padding: 12px 16px; 
      border: 1.5px solid #d1d5db; 
      border-radius: 8px; 
      font-size: 14px; 
      background: #f9fafb; 
      color: #1f2937; 
      box-sizing: border-box;
    `,i}async loadCountries(){try{let e=await this.api.loadCountries();this.elements.selects.country.innerHTML='<option value="">S\xE9lectionnez un pays</option>',e.forEach(t=>{let s=document.createElement("option");s.value=t.id,s.textContent=t.name,s.dataset.code=t.code,this.elements.selects.country.appendChild(s)})}catch(e){a.error("Erreur chargement pays:",e)}}bindEvents(){this.elements.selects.country.addEventListener("change",async e=>{let t=e.target.value;await this.loadStates(t),this.elements.selects.city.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`,this.updateStoreFromForm()}),this.elements.selects.state.addEventListener("change",async e=>{let t=e.target.value;await this.loadCities(t),this.updateStoreFromForm()}),this.elements.selects.city.addEventListener("change",()=>{this.updateStoreFromForm()}),Object.values(this.elements.inputs).forEach(e=>{e.addEventListener("input",()=>this.updateStoreFromForm()),e.addEventListener("change",()=>this.updateStoreFromForm())}),this.isFloating?(this.elements.floatingIcon.addEventListener("click",e=>{e.stopPropagation(),this.expandFloatingWidget()}),this.elements.widgetCard.addEventListener("click",e=>{e.target===this.elements.widgetCard&&this.expandFloatingWidget()})):this.elements.checkbox&&this.elements.checkbox.addEventListener("change",()=>{this.elements.checkbox.checked?this.elements.content.style.display="block":this.elements.content.style.display="none"}),!b()&&!v()&&P(()=>this.syncWithPageForm())}async loadStates(e){try{let t=await this.api.loadStates(e);this.elements.selects.state.innerHTML='<option value="">S\xE9lectionnez une r\xE9gion</option>',t.forEach(s=>{let i=document.createElement("option");i.value=s.id,i.textContent=s.name,this.elements.selects.state.appendChild(i)})}catch(t){a.error("Erreur chargement r\xE9gions:",t)}}async loadCities(e){try{let t=await this.api.loadCities(e);this.elements.selects.city.innerHTML='<option value="">S\xE9lectionnez une ville</option>',t.forEach(s=>{let i=document.createElement("option");i.value=s.id,i.textContent=s.name,this.elements.selects.city.appendChild(i)})}catch(t){a.error("Erreur chargement villes:",t)}}expandFloatingWidget(){this.createModalContent(),this.elements.modal=document.createElement("div"),this.elements.modal.className="devaito-floating-expanded-modal",this.elements.modal.style.cssText=`
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
    `;let e=document.createElement("div");e.className="devaito-floating-header",e.style.cssText=`
      padding: 16px; 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
      border-bottom: 1px solid #e5e7eb; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    `;let t=document.createElement("div");t.className="devaito-floating-title",t.textContent="Estimation livraison";let s=document.createElement("button");s.className="devaito-close-btn",s.innerHTML="\xD7",s.style.cssText=`
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
    `,s.addEventListener("click",n=>{n.stopPropagation(),this.collapseFloatingWidget()}),e.appendChild(t),e.appendChild(s);let i=document.createElement("div");i.style.cssText=`
      padding: 24px; 
      background: white; 
      flex-grow: 1; 
      overflow-y: auto;
    `,i.appendChild(this.elements.modalAddressSection),this.elements.modal.appendChild(e),this.elements.modal.appendChild(i),document.body.appendChild(this.elements.modal),this.createOverlay()}createModalContent(){this.elements.modalAddressSection=this.elements.modalAddressSection||document.createElement("div"),this.elements.modalAddressSection.style.cssText="margin-bottom: 20px;";let e=document.createElement("h4");e.textContent="Adresse de livraison",e.style.cssText=`
      margin: 0 0 16px 0; 
      font-size: 14px; 
      font-weight: 600; 
      color: #374151; 
      display: flex; 
      align-items: center;
    `;let t=document.createElement("span");t.id="devaito-modal-form-status",t.className="devaito-form-status invalid",t.textContent="Veuillez remplir le formulaire d'adresse",t.style.cssText="font-size: 12px; margin-left: 10px;",e.appendChild(t);let s=document.createElement("div");s.className="devaito-grid-responsive",s.style.cssText="display: flex; flex-direction: column; gap: 12px;",[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}].forEach(c=>{let p=document.createElement("input");p.type=c.type,p.placeholder=c.placeholder,p.name=c.name,p.autocomplete=c.autocomplete,p.className="devaito-input-field",p.style.cssText=`
        width: 100%; 
        padding: 12px 16px; 
        border: 1.5px solid #d1d5db; 
        border-radius: 8px; 
        font-size: 14px; 
        background: #f9fafb; 
        color: #1f2937; 
        box-sizing: border-box;
      `,p.value=this.elements.inputs[c.name]?.value||"",p.addEventListener("input",()=>{this.elements.inputs[c.name]&&(this.elements.inputs[c.name].value=p.value),this.updateStoreFromForm()}),s.appendChild(p)});let n=this.createSelect("devaito-modal-country","S\xE9lectionnez un pays"),o=this.createSelect("devaito-modal-state","S\xE9lectionnez d'abord un pays"),l=this.createSelect("devaito-modal-city","S\xE9lectionnez d'abord une r\xE9gion"),d=this.createInput("zip","Code postal","postal-code");d.value=this.elements.inputs.zip?.value||"",d.addEventListener("input",()=>{this.elements.inputs.zip&&(this.elements.inputs.zip.value=d.value),this.updateStoreFromForm()}),s.appendChild(n),s.appendChild(o),s.appendChild(l),s.appendChild(d),this.elements.modalAddressSection.innerHTML="",this.elements.modalAddressSection.appendChild(e),this.elements.modalAddressSection.appendChild(s),this.loadCountriesForModal(n,o,l)}async loadCountriesForModal(e,t,s){try{let i=await this.api.loadCountries();e.innerHTML='<option value="">S\xE9lectionnez un pays</option>',i.forEach(n=>{let o=document.createElement("option");o.value=n.id,o.textContent=n.name,o.dataset.code=n.code,this.elements.selects.country.value===n.id&&(o.selected=!0),e.appendChild(o)}),e.addEventListener("change",async n=>{let o=n.target.value;await this.loadStatesForModal(o,t),s.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`,this.updateStoreFromForm()}),t.addEventListener("change",async n=>{let o=n.target.value;await this.loadCitiesForModal(o,s),this.updateStoreFromForm()}),s.addEventListener("change",()=>{this.updateStoreFromForm()}),this.elements.selects.country.value&&await this.loadStatesForModal(this.elements.selects.country.value,t)}catch(i){a.error("Erreur chargement pays modal:",i)}}async loadStatesForModal(e,t){try{let s=await this.api.loadStates(e);t.innerHTML='<option value="">S\xE9lectionnez une r\xE9gion</option>',s.forEach(i=>{let n=document.createElement("option");n.value=i.id,n.textContent=i.name,this.elements.selects.state.value===i.id&&(n.selected=!0),t.appendChild(n)})}catch(s){a.error("Erreur chargement r\xE9gions modal:",s)}}async loadCitiesForModal(e,t){try{let s=await this.api.loadCities(e);t.innerHTML='<option value="">S\xE9lectionnez une ville</option>',s.forEach(i=>{let n=document.createElement("option");n.value=i.id,n.textContent=i.name,this.elements.selects.city.value===i.id&&(n.selected=!0),t.appendChild(n)})}catch(s){a.error("Erreur chargement villes modal:",s)}}createOverlay(){this.elements.overlay=document.createElement("div"),this.elements.overlay.id="devaito-overlay",this.elements.overlay.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      display: block;
    `,document.body.appendChild(this.elements.overlay),this.elements.overlay.addEventListener("click",()=>{this.collapseFloatingWidget()})}collapseFloatingWidget(){this.elements.modal&&this.elements.modal.parentNode&&(this.elements.modal.parentNode.removeChild(this.elements.modal),this.elements.modal=null),this.elements.overlay&&this.elements.overlay.parentNode&&(this.elements.overlay.parentNode.removeChild(this.elements.overlay),this.elements.overlay=null)}updateStoreFromForm(){let e=this.getFormAddress(),t=this.isFormValid(e);this.store.setState({clientAddress:e,formStatus:t?"valid":"invalid"}),this.updateFormStatusUI(t),this.syncToPageForm(e)}getFormAddress(){let e=this.elements.selects.country.options[this.elements.selects.country.selectedIndex],t=this.elements.selects.state.options[this.elements.selects.state.selectedIndex],s=this.elements.selects.city.options[this.elements.selects.city.selectedIndex];return{name:this.elements.inputs.name?.value||"",street1:this.elements.inputs.street?.value||"",city:s?s.text:"",state:t?t.text:"",zip:this.elements.inputs.zip?.value||"",phone:this.elements.inputs.phone?.value||"",email:this.elements.inputs.email?.value||"",country:e?e.dataset.code:"FR"}}isFormValid(e){return e.street1&&e.city&&e.zip&&e.email&&e.country&&u.isValidEmail(e.email)}updateFormStatusUI(e){let t=e?"Formulaire compl\xE9t\xE9":"Veuillez remplir le formulaire d'adresse",s=e?"devaito-form-status valid":"devaito-form-status invalid";this.elements.formStatus&&(this.elements.formStatus.textContent=t,this.elements.formStatus.className=s);let i=document.getElementById("devaito-modal-form-status");i&&(i.textContent=t,i.className=s)}syncWithPageForm(){if(b()||v())return;let e=z();e.name&&this.elements.inputs.name&&(this.elements.inputs.name.value=e.name),e.street&&this.elements.inputs.street&&(this.elements.inputs.street.value=e.street),e.phone&&this.elements.inputs.phone&&(this.elements.inputs.phone.value=e.phone),e.email&&this.elements.inputs.email&&(this.elements.inputs.email.value=e.email),e.zip&&this.elements.inputs.zip&&(this.elements.inputs.zip.value=e.zip),this.updateStoreFromForm()}syncToPageForm(e){R(e)}setupStoreSubscription(){this.unsubscribeStore=this.store.subscribe((e,t)=>{e.formStatus!==t.formStatus&&this.updateFormStatusUI(t.formStatus==="valid")})}destroy(){this.unsubscribeStore&&this.unsubscribeStore(),this.collapseFloatingWidget()}};var w=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.store=x(),this.api=y(),this.elements={productsSection:null,productsContainer:null}}init(){this.render(),this.bindEvents(),this.loadProducts()}render(){this.elements.productsSection=document.createElement("div"),this.elements.productsSection.style.cssText="margin-bottom: 20px;";let e=document.createElement("h4");e.textContent="Produits",e.style.cssText="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;",this.elements.productsContainer=document.createElement("div"),this.elements.productsContainer.id="devaito-products",this.elements.productsContainer.style.cssText="margin-bottom: 20px;",this.elements.productsSection.appendChild(e),this.elements.productsSection.appendChild(this.elements.productsContainer);let t=document.getElementById("devaito-content")||this.container.querySelector(".devaito-floating-content");t&&t.appendChild(this.elements.productsSection)}async loadProducts(){try{let e=this.getProductInfo(),t=this.store.state,s=await this.api.fetchShopData(t.shopId,e),i=s.products.map((n,o)=>{let l=n.shippingAddress||s.shop.address||{name:s.shop.name,street1:"123 Default Street",city:"Paris",state:"IDF",zip:"75001",country:"FR"},d=u.isCartOrCheckoutPage()&&e[o]&&e[o].name?e[o].name:n.name;return{id:o,name:d,quantity:e[o]?e[o].quantity:1,dimensions:n.dimensions,fromAddress:l}});this.store.setState({products:i}),this.renderProducts(i)}catch(e){a.error("Erreur chargement produits:",e),m.emit(h.ERROR,{action:"loadProducts",error:e.message})}}getProductInfo(){let e=window.location.pathname.toLowerCase(),t=[];if(u.isCartOrCheckoutPage()){let s=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");s.length>0?t=s.map(i=>({id:i.id,name:i.name,quantity:i.quantity,price:i.price})):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(i=>{let n=i.querySelector(".product-name, .item-name"),o=i.querySelector('input[type="number"]'),l=i.getAttribute("data-product-id")||i.getAttribute("data-id");n&&t.push({id:l,name:n.textContent.trim(),quantity:o&&parseInt(o.value)||1})})}else if(u.isProductPage()){let s=e.split("/product/")[1]?.split("/")[0]||e.split("/products/")[1]?.split("/")[0];if(s){let i=document.querySelector("h1.product-title, h1.product-name"),n=document.querySelector('input[type="number"].quantity-input');t.push({slug:s,name:i?i.textContent.trim():"Produit",quantity:n&&parseInt(n.value)||1})}}return t.length===0&&(t=[{name:"Product Demo",quantity:1}]),t}renderProducts(e){if(this.elements.productsContainer.innerHTML="",e.length===0){this.elements.productsContainer.innerHTML="<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible";return}e.forEach(t=>{let s=document.createElement("div");s.className="devaito-product-item";let i=document.createElement("div");i.className="devaito-product-info";let n=document.createElement("div");n.className="devaito-product-name",n.textContent=t.name;let o=document.createElement("div");o.className="devaito-product-details",o.textContent=`${t.dimensions.length}\xD7${t.dimensions.width}\xD7${t.dimensions.height}cm, ${t.quantity} unit\xE9(s)`,i.appendChild(n),i.appendChild(o);let l=document.createElement("div");l.className="devaito-product-quantity",l.textContent=t.quantity,l.readOnly=!0,s.appendChild(i),s.appendChild(l),this.elements.productsContainer.appendChild(s)})}prepareShippingRequests(){let e=this.store.getProducts(),t=this.store.getClientAddress(),s={};return e.forEach(i=>{if(!i.fromAddress)return;let n=JSON.stringify(i.fromAddress);s[n]||(s[n]={from:i.fromAddress,parcels:[]});let o=u.calculateAdjustedDimensions(i.dimensions,i.quantity);s[n].parcels.push({length:o.length,width:o.width,height:o.height,distance_unit:o.distance_unit,weight:o.weight,mass_unit:o.mass_unit})}),Object.keys(s).map(i=>({from:s[i].from,to:t,parcels:s[i].parcels}))}bindEvents(){m.on(h.ADDRESS_CHANGE,()=>{})}};var T=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.store=x(),this.api=y(),this.elements={estimateBtn:null,errorDiv:null,resultsDiv:null,totalDiv:null,validateBtn:null},this.unsubscribeStore=null}init(){this.render(),this.bindEvents(),this.setupStoreSubscription()}render(){this.elements.estimateBtn=document.createElement("button"),this.elements.estimateBtn.id="devaito-estimate",this.elements.estimateBtn.className="devaito-btn-primary",this.elements.estimateBtn.innerHTML="\u2728 Estimer les frais de port",this.elements.estimateBtn.style.cssText="width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;",this.elements.errorDiv=document.createElement("div"),this.elements.errorDiv.id="devaito-error",this.elements.errorDiv.style.cssText="color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;",this.elements.resultsDiv=document.createElement("div"),this.elements.resultsDiv.id="devaito-results",this.elements.resultsDiv.style.cssText="margin-top: 20px;",this.elements.totalDiv=document.createElement("div"),this.elements.totalDiv.id="devaito-total",this.elements.totalDiv.className="devaito-total-price",this.elements.totalDiv.style.cssText="display: none;",this.elements.validateBtn=document.createElement("button"),this.elements.validateBtn.id="devaito-validate",this.elements.validateBtn.className="devaito-validate-btn",this.elements.validateBtn.innerHTML="\u2705 Valider la commande",this.elements.validateBtn.style.cssText="display: none;";let e=document.getElementById("devaito-content")||this.container.querySelector(".devaito-floating-content");e&&(e.appendChild(this.elements.estimateBtn),e.appendChild(this.elements.errorDiv),e.appendChild(this.elements.resultsDiv),e.appendChild(this.elements.totalDiv),e.appendChild(this.elements.validateBtn))}bindEvents(){this.elements.estimateBtn.addEventListener("click",()=>this.handleEstimate()),this.elements.validateBtn.addEventListener("click",()=>this.handleValidation()),this.unsubscribeStore=this.store.subscribe((e,t)=>{e.selectedRates!==t.selectedRates&&this.updateTotal(),e.formStatus!==t.formStatus&&this.updateEstimateButtonState()})}async handleEstimate(){this.hideError(),this.clearResults();let e=this.store.getClientAddress(),t=this.store.getProducts();if(!this.isValidAddress(e)){this.showError("\u26A0\uFE0F Veuillez compl\xE9ter tous les champs obligatoires");return}if(t.length===0){this.showError("\u274C Aucun produit disponible pour l'estimation");return}this.setLoading(!0);try{let s=this.store.state.productComponent?.prepareShippingRequests()||[],i=await this.api.getShippingRates(s);this.displayRates(i)}catch(s){this.showError("\u274C Erreur lors de l'estimation des frais de port"),a.error("Erreur estimation",s)}finally{this.setLoading(!1)}}isValidAddress(e){return e.street1&&e.city&&e.zip&&e.email&&e.country&&u.isValidEmail(e.email)}displayRates(e){if(this.elements.resultsDiv.innerHTML="",e.length===0){this.elements.resultsDiv.innerHTML="<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>\u{1F4ED} Aucune option de livraison disponible";return}let t={0:e};Object.keys(t).forEach(s=>{let i=t[s],n=this.store.getProducts()[s]||this.store.getProducts()[0],o=document.createElement("h5");o.textContent=`Options pour: ${n.name}`,o.style.cssText="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;",this.elements.resultsDiv.appendChild(o),i.sort((l,d)=>parseFloat(l.price)-parseFloat(d.price)),i.forEach((l,d)=>{let c=this.createRateCard(l,s,d);this.elements.resultsDiv.appendChild(c)})})}createRateCard(e,t,s){let i=document.createElement("div");i.className="devaito-rate-card",i.dataset.productId=t,i.dataset.rateId=s,i.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb; cursor: pointer;";let n=document.createElement("div");n.style.cssText="display: flex; align-items: center; gap: 12px; flex: 1;";let o=e.img?this.createCarrierLogo(e.img,e.carrier):this.createDefaultLogo(),l=document.createElement("div");l.style.cssText="flex: 1;";let d=document.createElement("div");if(d.textContent=`${e.carrier} - ${e.service}`,d.style.cssText="font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;",l.appendChild(d),e.estimated_days){let g=document.createElement("div");g.textContent=`Livraison estim\xE9e: ${e.estimated_days} jour${e.estimated_days>1?"s":""}`,g.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;",l.appendChild(g)}let c=document.createElement("div");c.style.cssText="text-align: right;";let p=document.createElement("div");if(p.textContent=`${e.price} ${e.currency}`,p.style.cssText="font-weight: 700; font-size: 16px; color: #00d084;",c.appendChild(p),s===0){let g=document.createElement("div");g.textContent="Le moins cher",g.style.cssText="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;",c.appendChild(g)}return n.appendChild(o),n.appendChild(l),i.appendChild(n),i.appendChild(c),i.addEventListener("click",()=>this.selectRate(e,t,i)),i}selectRate(e,t,s){document.querySelectorAll(`.devaito-rate-card[data-product-id="${t}"]`).forEach(i=>{i.classList.remove("selected")}),s.classList.add("selected"),this.store.setState({selectedRates:{...this.store.getSelectedRates(),[t]:{...e,object_id:e.id||e.object_id||e.rateId,servicepoint_token:e.relayToken||e.servicepoint_token||null}}}),a.info("Taux s\xE9lectionn\xE9:",e)}updateTotal(){let e=this.store.getTotalPrice();if(e>0){this.elements.totalDiv.textContent=`Total estimation: ${u.formatPrice(e)}`,this.elements.totalDiv.style.display="block";let t=Object.keys(this.store.getSelectedRates()).length>0;this.elements.validateBtn.style.display=t?"block":"none"}else this.elements.totalDiv.style.display="none",this.elements.validateBtn.style.display="none"}async handleValidation(){let e=this.store.getSelectedRates(),t=this.store.getClientAddress(),s=this.store.getProducts();if(Object.keys(e).length===0){this.showError("Veuillez s\xE9lectionner une option de livraison");return}this.setLoading(!0,"Cr\xE9ation du label...");try{let i=Object.keys(e)[0],n=e[i],o={orderId:`ORDER_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,orderNumber:`#${Date.now().toString().substr(-6)}`,customerName:t.name||"Client",customerEmail:t.email||"",customerPhone:t.phone||"",shippingAddress:t,items:s.map(c=>({name:c.name,quantity:c.quantity,weight:c.dimensions?.weight||1.5}))},l={rateId:n.object_id||n.rateId,relay_token:n.servicepoint_token||null,shopUrl:window.location.origin,orderData:o},d=await this.api.createLabel(l);if(d.success)this.showSuccess(d.shipment);else throw new Error(d.error||"Erreur inconnue")}catch(i){this.showError(`\u274C Erreur lors de la cr\xE9ation du label: ${i.message}`)}finally{this.setLoading(!1)}}showSuccess(e){let t=`
      <div style="text-align: center; padding: 15px;">
        <div style="font-size: 40px; color: #10b981; margin-bottom: 10px;">\u2705</div>
        <h3 style="color: #059669; margin: 10px 0;">Label cr\xE9\xE9 avec succ\xE8s !</h3>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>\u{1F4E6} Num\xE9ro de suivi :</strong> ${e.trackingNumber}</p>
          <p style="margin: 5px 0;"><strong>\u{1F69A} Transporteur :</strong> ${e.carrier}</p>
          <p style="margin: 5px 0;"><strong>\u{1F4C4} Statut :</strong> ${e.status}</p>
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          <a href="${e.trackingUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            \u{1F50D} Suivre le colis
          </a>
          <a href="${e.labelUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            \u{1F4E5} T\xE9l\xE9charger le label
          </a>
        </div>
      </div>
    `;this.elements.errorDiv.innerHTML=t,this.elements.errorDiv.style.color="#059669",this.elements.errorDiv.style.background="#f0fdf4",this.elements.errorDiv.style.borderColor="#bbf7d0",this.elements.errorDiv.style.display="block",this.elements.validateBtn.style.display="none"}showError(e){this.elements.errorDiv.textContent=e,this.elements.errorDiv.style.display="block"}hideError(){this.elements.errorDiv.style.display="none"}clearResults(){this.elements.resultsDiv.innerHTML="",this.elements.totalDiv.style.display="none",this.elements.validateBtn.style.display="none",this.store.setState({selectedRates:{}})}setLoading(e,t=null){e?(this.elements.estimateBtn.disabled=!0,this.elements.estimateBtn.style.background="#9ca3af",this.elements.estimateBtn.innerHTML=t||"\u23F3 Calcul en cours...",this.elements.validateBtn.disabled=!0,this.elements.validateBtn.innerHTML="\u23F3 Traitement..."):(this.elements.estimateBtn.disabled=!1,this.elements.estimateBtn.style.background="#00d084",this.elements.estimateBtn.innerHTML="\u2728 Estimer les frais de port",this.elements.validateBtn.disabled=!1,this.elements.validateBtn.innerHTML="\u2705 Valider la commande")}updateEstimateButtonState(){let e=this.store.isFormValid();this.elements.estimateBtn.disabled=!e,this.elements.estimateBtn.style.opacity=e?"1":"0.6"}createCarrierLogo(e,t){let s=document.createElement("img");return s.src=e,s.alt=t,s.style.cssText="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;",s}createDefaultLogo(){let e=document.createElement("div");return e.textContent="\u{1F69A}",e.style.cssText="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;",e}setupStoreSubscription(){this.unsubscribeStore=this.store.subscribe((e,t)=>{e.formStatus!==t.formStatus&&this.updateEstimateButtonState()})}destroy(){this.unsubscribeStore&&this.unsubscribeStore()}};function O(){if(!document.getElementById("devaito-widget-styles")){let r=document.createElement("style");r.id="devaito-widget-styles",r.textContent=`
      /* Copier tout le CSS de l'original embed.js ici */
      .devaito-card-widget { transition: all 0.3s ease; }
      .devaito-card-widget:hover { box-shadow: 0 8px 25px rgba(0,208,132,0.15) !important; }
      .devaito-btn-primary { transition: all 0.3s ease; }
      .devaito-btn-primary:hover { background: #00b870 !important; transform: translateY(-1px); }
      .devaito-input-field { transition: border-color 0.2s ease; }
      .devaito-input-field:focus { border-color: #00d084 !important; outline: none; box-shadow: 0 0 0 2px rgba(0,208,132,0.1); }
      .devaito-rate-card { transition: all 0.2s ease; cursor: pointer; }
      .devaito-rate-card:hover { border-color: #00d084 !important; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,208,132,0.1); }
      .devaito-rate-card.selected { border: 2px solid #00d084 !important; background-color: #f0fff8; }
      .devaito-toggle-container { transition: all 0.2s ease; }
      .devaito-toggle-container:hover { background: #f0f9ff !important; }
      
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
      
      .devaito-select-field {
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        background: #f9fafb;
        color: #1f2937;
        box-sizing: border-box;
      }
      
      @media (min-width: 550px) {
        .devaito-grid-responsive {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 12px !important;
        }
      }

      // Dans le fichier style.js, ajoutez :
      #devaito-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: none;
      }
    `,document.head.appendChild(r)}}typeof window.devaitoInitialized>"u"&&(window.devaitoInitialized=!0,(function(){if(a.info("Initialisation du widget modulaire"),D()){a.info("Mode Builder d\xE9tect\xE9 : script du widget non ex\xE9cut\xE9.");return}if(!L()){a.info("Pas sur une page avec slug, widget non initialis\xE9");return}O();function r(){let e=document.getElementById("devaito-widget"),t=e?e.getAttribute("data-shop-id"):null,s=!1;if(!e){if(a.info("Aucun conteneur trouv\xE9, cr\xE9ation d'un widget flottant"),typeof window.DEVAITO_SHOP_ID<"u")t=window.DEVAITO_SHOP_ID,a.info(`ShopID r\xE9cup\xE9r\xE9 depuis window.DEVAITO_SHOP_ID: ${t}`);else{a.error("Aucun shopId trouv\xE9 pour le widget flottant");return}e=document.createElement("div"),e.id="devaito-widget-floating",e.style.cssText="position: fixed; bottom: 150px; right: 20px; z-index: 10000;",document.body.appendChild(e),s=!0}if(!e){a.error("Container non trouv\xE9");return}if(e.querySelector("#devaito-toggle")){a.info("Widget d\xE9j\xE0 initialis\xE9");return}if(!t){a.error("data-shop-id manquant");return}N({shopId:t,isFloating:s,clientAddress:{name:"",street1:"",city:"",state:"",zip:"",phone:"",email:"",country:"FR"},products:[],selectedRates:{},formStatus:"invalid",isLoading:!1,error:null,shippingRates:[],shipmentData:null});let i=new C(e,{isFloating:s,shopId:t}),n=new w(e,{isFloating:s,shopId:t}),o=new T(e,{isFloating:s});i.init(),n.init(),o.init(),window.devaitoWidget={formComponent:i,productComponent:n,shippingComponent:o,store:window.__DEVAITO_STORE__}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()})());})();
