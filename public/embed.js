"use strict";(()=>{var b={API_BASE:"https://devaitoship.vercel.app/api",DEBUG:!0,MAX_HEIGHT:100,DEFAULT_DIMENSIONS:{length:20,width:15,height:10,weight:1.5,distance_unit:"cm",mass_unit:"kg"}},h={isInBuilder:()=>window.location.href.includes("/admin/builder"),isSlugPage:()=>{let r=window.location.pathname.toLowerCase();return r.includes("/checkout")||r.includes("/cart")||r.includes("/panier")||r.includes("/product/")||r.includes("/products/")},isCartOrCheckoutPage:()=>{let r=window.location.pathname.toLowerCase();return r.includes("/cart")||r.includes("/panier")||r.includes("/checkout")},isProductPage:()=>{let r=window.location.pathname.toLowerCase();return r.includes("/product/")||r.includes("/products/")},mapCountryIdToCode:r=>({50:"CD",75:"FR",148:"MA"})[r]||"FR",getShopBaseUrl:()=>window.location.origin,formatPrice:(r,e="EUR")=>`${parseFloat(r).toFixed(2)} ${e}`,isValidEmail:r=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r),calculateAdjustedDimensions:(r,e)=>{let t=b.MAX_HEIGHT,i=r.height||10,s=r.width||15,n=r.length||20,o=r.weight||1.5,c=i*e,l=s,m=n;if(c>t){let d=Math.ceil(c/t);c=t,l=s*d}return{length:m,width:l,height:c,weight:o*e,distance_unit:r.distance_unit||"cm",mass_unit:r.mass_unit||"kg"}},getProductInfo:()=>{let r=window.location.pathname.toLowerCase(),e=[];if(h.isCartOrCheckoutPage()){let t=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");t.length>0?e=t.map(i=>({id:i.id,name:i.name,quantity:i.quantity,price:i.price})):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(i=>{let s=i.querySelector(".product-name, .item-name"),n=i.querySelector('input[type="number"]'),o=i.getAttribute("data-product-id")||i.getAttribute("data-id");s&&e.push({id:o,name:s.textContent.trim(),quantity:n&&parseInt(n.value)||1})})}else if(h.isProductPage()){let t=r.split("/product/")[1]?.split("/")[0]||r.split("/products/")[1]?.split("/")[0];if(t){let i=document.querySelector("h1.product-title, h1.product-name"),s=document.querySelector('input[type="number"].quantity-input');e.push({slug:t,name:i?i.textContent.trim():"Produit",quantity:s&&parseInt(s.value)||1})}}return e.length===0&&(e=[{name:"Product Demo",quantity:1}]),e},getFormDataFromPage:()=>{if(h.isProductPage()||h.isCartOrCheckoutPage())return{};let r={},e={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};return Object.keys(e).forEach(t=>{let i=e[t],s=document.querySelector(i);s&&(r[t]=s.value)}),r}},a={info:(...r)=>console.log("[DEV]",...r),error:(...r)=>console.error("[DEV-ERR]",...r),debug:(...r)=>b.DEBUG&&console.log("[DEV-DBG]",...r)};var{isInBuilder:L,isSlugPage:F,isCartOrCheckoutPage:v,isProductPage:y,mapCountryIdToCode:B,getShopBaseUrl:w,formatPrice:H,isValidEmail:j,calculateAdjustedDimensions:$,getProductInfo:I,getFormDataFromPage:P}=h;function D(r){if(y()||v())return;["#fullname","#email","#phone","#address","#postal-code","#country","#state","#city",'[name="name"]','[name="email"]','[name="phone"]','[name="address"]','[name="zip"]','[name="country"]','[name="state"]','[name="city"]'].forEach(t=>{document.querySelectorAll(t).forEach(s=>{s.addEventListener("input",r),s.addEventListener("change",r)})})}function R(r){if(y()||v())return;let e={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};Object.keys(e).forEach(t=>{let i=e[t],s=document.querySelector(i);if(s&&r[t]){s.value=r[t];let n=new Event("change",{bubbles:!0});s.dispatchEvent(n)}})}var T=class extends EventTarget{constructor(){super()}emit(e,t={}){this.dispatchEvent(new CustomEvent(e,{detail:t}))}on(e,t){return this.addEventListener(e,t),()=>this.off(e,t)}off(e,t){this.removeEventListener(e,t)}once(e,t){let i=s=>{t(s),this.off(e,i)};this.on(e,i)}},p=new T,u={ADDRESS_CHANGE:"addressChange",PRODUCTS_CHANGE:"productsChange",RATES_CHANGE:"ratesChange",FORM_STATUS_CHANGE:"formStatusChange",SHIPPING_REQUEST:"shippingRequest",SHIPPING_RESPONSE:"shippingResponse",VALIDATION_REQUEST:"validationRequest",VALIDATION_RESPONSE:"validationResponse",ERROR:"error",LOADING_START:"loadingStart",LOADING_END:"loadingEnd"};var k=class{constructor(){this.state={shopId:null,isFloating:!1,clientAddress:{name:"",street1:"",city:"",state:"",zip:"",phone:"",email:"",country:"FR"},products:[],selectedRates:{},formStatus:"invalid",isLoading:!1,error:null,shippingRates:[],shipmentData:null},this.subscribers=new Set}setState(e){let t={...this.state};this.state={...this.state,...e},this.notifySubscribers(t,this.state),e.clientAddress&&t.clientAddress!==e.clientAddress&&p.dispatchEvent(new CustomEvent("addressChange",{detail:e.clientAddress})),e.products&&t.products!==e.products&&p.dispatchEvent(new CustomEvent("productsChange",{detail:e.products})),e.selectedRates&&t.selectedRates!==e.selectedRates&&p.dispatchEvent(new CustomEvent("ratesChange",{detail:e.selectedRates}))}getClientAddress(){return this.state.clientAddress}getProducts(){return this.state.products}getSelectedRates(){return this.state.selectedRates}getFormStatus(){return this.state.formStatus}subscribe(e){return this.subscribers.add(e),()=>this.subscribers.delete(e)}notifySubscribers(e,t){this.subscribers.forEach(i=>i(e,t))}isFormValid(){let e=this.state.clientAddress;return e.street1&&e.zip&&e.email&&e.country}getTotalPrice(){return Object.values(this.state.selectedRates).reduce((e,t)=>e+(parseFloat(t.price)||0),0)}clearError(){this.setState({error:null})}setError(e){this.setState({error:e}),a.error("Store error:",e)}},g=null;function N(r={}){return g||(g=new k,g.setState(r),window.__DEVAITO_STORE__=g),g}function f(){if(!g)throw new Error("Store non initialis\xE9. Appelez initStore() d'abord.");return g}var z=class{constructor(){this.baseUrl=b.API_BASE}async fetchShopData(e,t){try{p.emit(u.LOADING_START,{action:"fetchShopData"}),a.info(`Envoi requ\xEAte avec ${t.length} produits`);let i=await fetch(`${this.baseUrl}/get_shop_data_v2`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shopId:e,products:t,slugs:t.filter(n=>n.slug).map(n=>n.slug),productIds:t.filter(n=>n.id).map(n=>n.id)})});if(!i.ok)throw new Error(`Erreur API: ${i.status}`);let s=await i.json();return a.info("R\xE9ponse API re\xE7ue"),p.emit(u.LOADING_END,{action:"fetchShopData"}),s}catch(i){throw p.emit(u.ERROR,{action:"fetchShopData",error:i.message}),i}}async getShippingRates(e){try{p.emit(u.LOADING_START,{action:"getShippingRates"});let t=[];for(let i of e){a.info(`Envoi requ\xEAte pour ${i.parcels.length} colis`);let s=await fetch(`${this.baseUrl}/getRates`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!s.ok)throw new Error(`Erreur: ${s.status}`);let n=await s.json();a.info(`${n.length} options re\xE7ues`),n.forEach(o=>{o.productId=0,t.push(o)})}return p.emit(u.LOADING_END,{action:"getShippingRates"}),p.emit(u.SHIPPING_RESPONSE,{rates:t}),t}catch(t){throw p.emit(u.ERROR,{action:"getShippingRates",error:t.message}),t}}async createLabel(e){try{p.emit(u.LOADING_START,{action:"createLabel"}),a.info("Envoi \xE0 l'API create-label:",e);let t=await fetch(`${this.baseUrl}/create-label`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let s=await t.text();throw new Error(`Erreur API: ${t.status} - ${s}`)}let i=await t.json();return a.info("R\xE9ponse create-label:",i),p.emit(u.LOADING_END,{action:"createLabel"}),p.emit(u.VALIDATION_RESPONSE,{result:i}),i}catch(t){throw p.emit(u.ERROR,{action:"createLabel",error:t.message}),t}}async loadCountries(){try{let e=w(),t=await fetch(`${e}/api/v1/ecommerce-core/get-countries`);if(!t.ok)throw new Error("Erreur de chargement des pays");return((await t.json()).data?.countries||[]).map(n=>({id:n.id,name:n.name,code:n.code||this.mapCountryIdToCode(n.id)}))}catch(e){return a.error("Erreur chargement pays:",e),[{id:"75",name:"France",code:"FR"},{id:"148",name:"Maroc",code:"MA"},{id:"50",name:"R\xE9publique D\xE9mocratique du Congo",code:"CD"}]}}async loadStates(e){if(!e)return[];try{let t=w(),i=await fetch(`${t}/api/v1/ecommerce-core/get-states-of-countries`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({country_id:e})});if(!i.ok)throw new Error("Erreur de chargement des r\xE9gions");return(await i.json()).data?.states||[]}catch(t){return a.error("Erreur chargement r\xE9gions:",t),[]}}async loadCities(e){if(!e)return[];try{let t=w(),i=await fetch(`${t}/api/v1/ecommerce-core/get-cities-of-state`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({state_id:e})});return i.ok?(await i.json()).data?.cities||[]:[]}catch(t){return a.error("Erreur chargement villes:",t),[]}}mapCountryIdToCode(e){return{50:"CD",75:"FR",148:"MA"}[e]||"FR"}},A=null;function x(){return A||(A=new z),A}var E=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.shopId=t.shopId,this.store=f(),this.api=x(),this.elements={widgetCard:null,content:null,floatingIcon:null,modal:null,overlay:null,inputs:{},selects:{}},this.unsubscribeStore=null}init(){this.render(),this.bindEvents(),this.setupStoreSubscription(),this.syncWithPageForm(),this.loadCountries()}render(){this.createWidgetStructure(),this.createAddressSection(),!this.isFloating&&this.elements.content&&(this.elements.content.style.display="block")}createWidgetStructure(){this.elements.widgetCard=document.createElement("div"),this.elements.widgetCard.className="devaito-card-widget",this.isFloating?(this.elements.widgetCard.className+=" devaito-floating-widget",this.elements.widgetCard.style.cssText=`
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
      `,this.elements.floatingIcon=document.createElement("div"),this.elements.floatingIcon.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-open-icon lucide-package-open"><path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/></svg>
      `,this.elements.floatingIcon.style.cssText=`
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
    `;let i=document.createElement("div");i.style.cssText="display: flex; align-items: center; gap: 12px;";let s=document.createElement("div");s.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-open-icon lucide-package-open"><path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/></svg>
    `,s.style.cssText="font-size: 20px;";let n=document.createElement("div"),o=document.createElement("div");o.textContent="Estimation livraison",o.style.cssText="font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";let c=document.createElement("div");c.textContent="Calculez vos frais de port",c.style.cssText="font-size: 13px; color: #6b7280; margin-top: 2px;",n.appendChild(o),n.appendChild(c),i.appendChild(s),i.appendChild(n);let l=document.createElement("div");l.style.cssText="position: relative; width: 48px; height: 24px;",this.elements.checkbox=document.createElement("input"),this.elements.checkbox.type="checkbox",this.elements.checkbox.id="devaito-toggle-checkbox",this.elements.checkbox.checked=!0,this.elements.checkbox.style.cssText=`
      position: absolute; 
      opacity: 0; 
      width: 100%; 
      height: 100%; 
      cursor: pointer; 
      z-index: 2;
    `;let m=document.createElement("div");m.style.cssText=`
      width: 48px; 
      height: 24px; 
      background: #00d084; 
      border-radius: 12px; 
      position: relative; 
      transition: all 0.3s ease;
    `;let d=document.createElement("div");d.style.cssText=`
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
    `,m.appendChild(d),l.appendChild(this.elements.checkbox),l.appendChild(m),t.appendChild(i),t.appendChild(l),e.appendChild(t),this.elements.widgetCard.insertBefore(e,this.elements.content)}createAddressSection(){!this.elements.content&&!this.isFloating&&(this.elements.content=document.createElement("div"),this.elements.content.id="devaito-content",this.elements.content.style.cssText="padding: 24px; background: white;",this.elements.widgetCard.appendChild(this.elements.content));let e=document.createElement("div");e.style.cssText="margin-bottom: 20px;";let t=document.createElement("h4");t.textContent="Adresse de livraison",t.style.cssText=`
      margin: 0 0 16px 0; 
      font-size: 14px; 
      font-weight: 600; 
      color: #374151; 
      display: flex; 
      align-items: center;
    `,this.elements.formStatus=document.createElement("span"),this.elements.formStatus.id="devaito-form-status",this.elements.formStatus.className="devaito-form-status invalid",this.elements.formStatus.textContent="Veuillez remplir le formulaire d'adresse",this.elements.formStatus.style.cssText="font-size: 12px; margin-left: 10px;",t.appendChild(this.elements.formStatus);let i=document.createElement("div");i.className="devaito-grid-responsive",i.style.cssText="display: flex; flex-direction: column; gap: 12px;",[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}].forEach(n=>{let o=document.createElement("input");o.type=n.type,o.placeholder=n.placeholder,o.name=n.name,o.autocomplete=n.autocomplete,o.className="devaito-input-field",o.style.cssText=`
        width: 100%; 
        padding: 12px 16px; 
        border: 1.5px solid #d1d5db; 
        border-radius: 8px; 
        font-size: 14px; 
        background: #f9fafb; 
        color: #1f2937; 
        box-sizing: border-box;
      `,this.elements.inputs[n.name]=o,i.appendChild(o)}),this.elements.selects.country=this.createSelect("devaito-country","Chargement des pays..."),this.elements.selects.state=this.createSelect("devaito-state","S\xE9lectionnez d'abord un pays"),this.elements.selects.city=this.createSelect("devaito-city","S\xE9lectionnez d'abord une r\xE9gion"),this.elements.inputs.zip=this.createInput("zip","Code postal","postal-code"),i.appendChild(this.elements.selects.country),i.appendChild(this.elements.selects.state),i.appendChild(this.elements.selects.city),i.appendChild(this.elements.inputs.zip),e.appendChild(t),e.appendChild(i),this.isFloating?this.elements.modalAddressSection=e:this.elements.content.appendChild(e)}createSelect(e,t){let i=document.createElement("select");return i.id=e,i.className="devaito-select-field",i.innerHTML=`<option value="">${t}</option>`,i.style.cssText=`
      width: 100%; 
      padding: 12px 16px; 
      border: 1.5px solid #d1d5db; 
      border-radius: 8px; 
      font-size: 14px; 
      background: #f9fafb; 
      color: #1f2937; 
      box-sizing: border-box;
    `,i}createInput(e,t,i){let s=document.createElement("input");return s.type="text",s.placeholder=t,s.name=e,s.autocomplete=i,s.className="devaito-input-field",s.style.cssText=`
      width: 100%; 
      padding: 12px 16px; 
      border: 1.5px solid #d1d5db; 
      border-radius: 8px; 
      font-size: 14px; 
      background: #f9fafb; 
      color: #1f2937; 
      box-sizing: border-box;
    `,s}async loadCountries(){try{let e=await this.api.loadCountries();this.elements.selects.country.innerHTML='<option value="">S\xE9lectionnez un pays</option>',e.forEach(t=>{let i=document.createElement("option");i.value=t.id,i.textContent=t.name,i.dataset.code=t.code,this.elements.selects.country.appendChild(i)})}catch(e){a.error("Erreur chargement pays:",e)}}bindEvents(){this.elements.selects.country.addEventListener("change",async e=>{let t=e.target.value,s=e.target.options[e.target.selectedIndex].dataset.code||"FR";this.updateStoreFromForm(),await this.loadStates(t),this.elements.selects.city.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`}),this.elements.selects.state.addEventListener("change",async e=>{let t=e.target.value;await this.loadCities(t),this.updateStoreFromForm()}),this.elements.selects.city.addEventListener("change",()=>{this.updateStoreFromForm()}),Object.values(this.elements.inputs).forEach(e=>{e.addEventListener("input",()=>this.updateStoreFromForm()),e.addEventListener("change",()=>this.updateStoreFromForm())}),this.isFloating?(this.elements.floatingIcon.addEventListener("click",e=>{e.stopPropagation(),this.expandFloatingWidget()}),this.elements.widgetCard.addEventListener("click",e=>{e.target===this.elements.widgetCard&&this.expandFloatingWidget()})):this.elements.checkbox&&this.elements.checkbox.addEventListener("change",()=>{this.elements.checkbox.checked?this.elements.content.style.display="block":this.elements.content.style.display="none"}),!y()&&!v()&&D(()=>this.syncWithPageForm())}async loadStates(e){try{let t=await this.api.loadStates(e);this.elements.selects.state.innerHTML='<option value="">S\xE9lectionnez une r\xE9gion</option>',t.forEach(i=>{let s=document.createElement("option");s.value=i.id,s.textContent=i.name,this.elements.selects.state.appendChild(s)})}catch(t){a.error("Erreur chargement r\xE9gions:",t),this.elements.selects.state.innerHTML='<option value="">Pas de r\xE9gions disponibles</option>',this.elements.selects.city.innerHTML='<option value="">Pas de villes disponibles</option>'}}async loadCities(e){try{if(!e||e===""){this.elements.selects.city.innerHTML='<option value="">Pas de villes disponibles</option>';return}let t=await this.api.loadCities(e);this.elements.selects.city.innerHTML='<option value="">S\xE9lectionnez une ville</option>',t.length===0?this.elements.selects.city.innerHTML='<option value="">Pas de villes disponibles</option>':t.forEach(i=>{let s=document.createElement("option");s.value=i.id,s.textContent=i.name,this.elements.selects.city.appendChild(s)})}catch(t){a.error("Erreur chargement villes:",t),this.elements.selects.city.innerHTML='<option value="">Pas de villes disponibles</option>'}}expandFloatingWidget(){this.createModalContent(),this.elements.modal=document.createElement("div"),this.elements.modal.className="devaito-floating-expanded-modal",this.elements.modal.style.cssText=`
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
    `;let t=document.createElement("div");t.className="devaito-floating-title",t.textContent="Estimation livraison";let i=document.createElement("button");i.className="devaito-close-btn",i.innerHTML="\xD7",i.style.cssText=`
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
    `,i.addEventListener("click",n=>{n.stopPropagation(),this.collapseFloatingWidget()}),e.appendChild(t),e.appendChild(i);let s=document.createElement("div");if(s.style.cssText=`
      padding: 24px; 
      background: white; 
      flex-grow: 1; 
      overflow-y: auto;
    `,s.appendChild(this.elements.modalAddressSection),window.devaitoModalComponents){let{product:n,shipping:o}=window.devaitoModalComponents;n&&n.elements.productsSection&&(s.appendChild(n.elements.productsSection),n.loadProducts()),o&&o.elements.shippingSection&&s.appendChild(o.elements.shippingSection)}this.elements.modal.appendChild(e),this.elements.modal.appendChild(s),document.body.appendChild(this.elements.modal),this.createOverlay()}createOverlay(){this.elements.overlay=document.createElement("div"),this.elements.overlay.id="devaito-overlay",this.elements.overlay.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      display: block;
    `,document.body.appendChild(this.elements.overlay),this.elements.overlay.addEventListener("click",()=>{this.collapseFloatingWidget()})}createModalContent(){this.elements.modalAddressSection=this.elements.modalAddressSection||document.createElement("div"),this.elements.modalAddressSection.style.cssText="margin-bottom: 20px;";let e=document.createElement("h4");e.textContent="Adresse de livraison",e.style.cssText=`
      margin: 0 0 16px 0; 
      font-size: 14px; 
      font-weight: 600; 
      color: #374151; 
      display: flex; 
      align-items: center;
    `;let t=document.createElement("span");t.id="devaito-modal-form-status",t.className="devaito-form-status invalid",t.textContent="Veuillez remplir le formulaire d'adresse",t.style.cssText="font-size: 12px; margin-left: 10px;",e.appendChild(t);let i=document.createElement("div");i.className="devaito-grid-responsive",i.style.cssText="display: flex; flex-direction: column; gap: 12px;",[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}].forEach(m=>{let d=document.createElement("input");d.type=m.type,d.placeholder=m.placeholder,d.name=m.name,d.autocomplete=m.autocomplete,d.className="devaito-input-field",d.style.cssText=`
        width: 100%; 
        padding: 12px 16px; 
        border: 1.5px solid #d1d5db; 
        border-radius: 8px; 
        font-size: 14px; 
        background: #f9fafb; 
        color: #1f2937; 
        box-sizing: border-box;
      `,d.value=this.elements.inputs[m.name]?.value||"",d.addEventListener("input",()=>{this.elements.inputs[m.name]&&(this.elements.inputs[m.name].value=d.value),this.updateStoreFromForm()}),i.appendChild(d)});let n=this.createSelect("devaito-modal-country","S\xE9lectionnez un pays"),o=this.createSelect("devaito-modal-state","S\xE9lectionnez d'abord un pays"),c=this.createSelect("devaito-modal-city","S\xE9lectionnez d'abord une r\xE9gion"),l=this.createInput("zip","Code postal","postal-code");l.value=this.elements.inputs.zip?.value||"",l.addEventListener("input",()=>{this.elements.inputs.zip&&(this.elements.inputs.zip.value=l.value),this.updateStoreFromForm()}),i.appendChild(n),i.appendChild(o),i.appendChild(c),i.appendChild(l),this.elements.modalAddressSection.innerHTML="",this.elements.modalAddressSection.appendChild(e),this.elements.modalAddressSection.appendChild(i),this.loadCountriesForModal(n,o,c)}async loadCountriesForModal(e,t,i){try{let s=await this.api.loadCountries();e.innerHTML='<option value="">S\xE9lectionnez un pays</option>',s.forEach(n=>{let o=document.createElement("option");o.value=n.id,o.textContent=n.name,o.dataset.code=n.code,this.elements.selects.country.value===n.id&&(o.selected=!0),e.appendChild(o)}),e.addEventListener("change",async n=>{let o=n.target.value,l=n.target.options[n.target.selectedIndex].dataset.code||"FR";await this.loadStatesForModal(o,t),i.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`,this.updateStoreFromForm()}),t.addEventListener("change",async n=>{let o=n.target.value;await this.loadCitiesForModal(o,i),this.updateStoreFromForm()}),i.addEventListener("change",()=>{this.updateStoreFromForm()}),this.elements.selects.country.value&&await this.loadStatesForModal(this.elements.selects.country.value,t)}catch(s){a.error("Erreur chargement pays modal:",s)}}async loadStatesForModal(e,t){try{let i=await this.api.loadStates(e);if(t.innerHTML='<option value="">S\xE9lectionnez une r\xE9gion</option>',i.length===0){t.innerHTML='<option value="">Pas de r\xE9gions disponibles</option>';return}i.forEach(s=>{let n=document.createElement("option");n.value=s.id,n.textContent=s.name,this.elements.selects.state.value===s.id&&(n.selected=!0),t.appendChild(n)})}catch(i){a.error("Erreur chargement r\xE9gions modal:",i),t.innerHTML='<option value="">Pas de r\xE9gions disponibles</option>'}}async loadCitiesForModal(e,t){try{if(!e||e===""){t.innerHTML='<option value="">Pas de villes disponibles</option>';return}let i=await this.api.loadCities(e);t.innerHTML='<option value="">S\xE9lectionnez une ville</option>',i.length===0?t.innerHTML='<option value="">Pas de villes disponibles</option>':i.forEach(s=>{let n=document.createElement("option");n.value=s.id,n.textContent=s.name,this.elements.selects.city.value===s.id&&(n.selected=!0),t.appendChild(n)})}catch(i){a.error("Erreur chargement villes modal:",i),t.innerHTML='<option value="">Pas de villes disponibles</option>'}}collapseFloatingWidget(){this.elements.modal&&this.elements.modal.parentNode&&(this.elements.modal.parentNode.removeChild(this.elements.modal),this.elements.modal=null),this.elements.overlay&&this.elements.overlay.parentNode&&(this.elements.overlay.parentNode.removeChild(this.elements.overlay),this.elements.overlay=null)}updateStoreFromForm(){let e=this.getFormAddress(),t=this.isFormValid(e);this.store.setState({clientAddress:e,formStatus:t?"valid":"invalid"}),this.updateFormStatusUI(t),this.syncToPageForm(e)}getFormAddress(){let e=this.elements.selects.country,t=this.elements.selects.state,i=this.elements.selects.city,s=e.options[e.selectedIndex],n=t.options[t.selectedIndex],o=i.options[i.selectedIndex],c=s?s.text:"",l=n?n.text:"",m=o?o.text:"",d=s&&s.dataset.code||"FR";return{name:this.elements.inputs.name?.value||"",street1:this.elements.inputs.street?.value||"",city:m,state:l,zip:this.elements.inputs.zip?.value||"",phone:this.elements.inputs.phone?.value||"",email:this.elements.inputs.email?.value||"",country:d}}isFormValid(e){return e.street1&&e.zip&&e.email&&e.country&&h.isValidEmail(e.email)}updateFormStatusUI(e){let t=e?"Formulaire compl\xE9t\xE9":"Veuillez remplir le formulaire d'adresse",i=e?"devaito-form-status valid":"devaito-form-status invalid";this.elements.formStatus&&(this.elements.formStatus.textContent=t,this.elements.formStatus.className=i);let s=document.getElementById("devaito-modal-form-status");s&&(s.textContent=t,s.className=i)}syncWithPageForm(){if(y()||v())return;let e=P();e.name&&this.elements.inputs.name&&(this.elements.inputs.name.value=e.name),e.street&&this.elements.inputs.street&&(this.elements.inputs.street.value=e.street),e.phone&&this.elements.inputs.phone&&(this.elements.inputs.phone.value=e.phone),e.email&&this.elements.inputs.email&&(this.elements.inputs.email.value=e.email),e.zip&&this.elements.inputs.zip&&(this.elements.inputs.zip.value=e.zip),this.updateStoreFromForm()}syncToPageForm(e){R(e)}setupStoreSubscription(){this.unsubscribeStore=this.store.subscribe((e,t)=>{e.formStatus!==t.formStatus&&this.updateFormStatusUI(t.formStatus==="valid")})}destroy(){this.unsubscribeStore&&this.unsubscribeStore(),this.collapseFloatingWidget()}};var S=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.shopId=t.shopId,this.store=f(),this.api=x(),this.elements={productsSection:null,productsContainer:null,productsTitle:null}}init(e=!1){this.isFloating&&!e||(this.render(),e||(this.loadProducts(),this.bindEvents()))}render(){if(this.elements.productsSection=document.createElement("div"),this.elements.productsSection.id="devaito-products-section",this.elements.productsSection.className="devaito-products-section",this.elements.productsSection.style.cssText="margin-bottom: 20px;",this.elements.productsTitle=document.createElement("h4"),this.elements.productsTitle.textContent="Produits",this.elements.productsTitle.style.cssText="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;",this.elements.productsContainer=document.createElement("div"),this.elements.productsContainer.id="devaito-products-container",this.elements.productsContainer.style.cssText="margin-bottom: 20px; min-height: 80px;",this.elements.productsSection.appendChild(this.elements.productsTitle),this.elements.productsSection.appendChild(this.elements.productsContainer),this.isFloating)this.container.productsSection=this.elements.productsSection;else{let e=document.getElementById("devaito-content");e?e.appendChild(this.elements.productsSection):console.error("Contenu non trouv\xE9 pour ajouter la section produits")}}async loadProducts(){try{let e=I();if(e.length===0){this.showNoProducts();return}let t=this.store.state,i=await this.api.fetchShopData(this.shopId,e),s=i.products.map((n,o)=>{let c=n.shippingAddress||i.shop.address||{name:i.shop.name,street1:"123 Default Street",city:"Paris",state:"IDF",zip:"75001",country:"FR"},l=h.isCartOrCheckoutPage()&&e[o]&&e[o].name?e[o].name:n.name;return{id:o,name:l,quantity:e[o]?e[o].quantity:1,dimensions:n.dimensions||{length:20,width:15,height:10,weight:1.5},fromAddress:c}});this.store.setState({products:s}),this.renderProducts(s),p.emit(u.PRODUCTS_CHANGE,{products:s})}catch(e){a.error("Erreur chargement produits:",e),this.showError("Erreur de chargement des produits"),p.emit(u.ERROR,{action:"loadProducts",error:e.message})}}renderProducts(e){if(this.elements.productsContainer){if(this.elements.productsContainer.innerHTML="",e.length===0){this.showNoProducts();return}e.forEach(t=>{let i=this.createProductCard(t);this.elements.productsContainer.appendChild(i)}),this.elements.productsTitle.textContent=`Produits (${e.length})`}}createProductCard(e){let t=document.createElement("div");t.className="devaito-product-item",t.style.cssText=`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 8px;
    `;let i=document.createElement("div");i.className="devaito-product-info",i.style.cssText="flex-grow: 1; margin-right: 12px;";let s=document.createElement("div");s.className="devaito-product-name",s.textContent=e.name||"Produit sans nom",s.style.cssText="font-weight: 500; color: #374151; font-size: 14px;";let n=document.createElement("div");n.className="devaito-product-details",e.dimensions?n.textContent=`${e.dimensions.length}\xD7${e.dimensions.width}\xD7${e.dimensions.height}cm, ${e.quantity} unit\xE9(s)`:n.textContent=`${e.quantity} unit\xE9(s)`,n.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;",i.appendChild(s),i.appendChild(n);let o=document.createElement("div");return o.className="devaito-product-quantity",o.textContent=e.quantity,o.style.cssText=`
      width: 60px;
      padding: 8px;
      border: 1.5px solid #d1d5db;
      color: #1f2937;
      border-radius: 6px;
      text-align: center;
      font-size: 14px;
      background: #f9fafb;
    `,o.readOnly=!0,t.appendChild(i),t.appendChild(o),t}showNoProducts(){this.elements.productsContainer&&(this.elements.productsContainer.innerHTML=`
      <div style="text-align: center; padding: 20px; color: #6b7280; background: #f9fafb; border-radius: 8px; border: 1px dashed #d1d5db;">
        <div style="font-size: 24px; margin-bottom: 8px;">\u{1F4E6}</div>
        <div>Aucun produit d\xE9tect\xE9</div>
        <div style="font-size: 12px; margin-top: 4px;">Ajoutez des produits \xE0 votre panier</div>
      </div>
    `)}showError(e){this.elements.productsContainer&&(this.elements.productsContainer.innerHTML=`
      <div style="text-align: center; padding: 15px; color: #dc2626; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
        <div style="font-size: 20px; margin-bottom: 8px;">\u26A0\uFE0F</div>
        <div>${e}</div>
      </div>
    `)}bindEvents(){p.on(u.ADDRESS_CHANGE,()=>{})}getProductsForShipping(){return this.store.getProducts()}prepareShippingRequests(){let e=this.store.getProducts(),t=this.store.getClientAddress();if(e.length===0||!t||!t.country)return[];let i={};return e.forEach(s=>{if(!s.fromAddress)return;let n=JSON.stringify(s.fromAddress);i[n]||(i[n]={from:s.fromAddress,parcels:[]});let o=h.calculateAdjustedDimensions(s.dimensions,s.quantity);i[n].parcels.push({length:o.length,width:o.width,height:o.height,distance_unit:o.distance_unit||"cm",weight:o.weight,mass_unit:o.mass_unit||"kg"})}),Object.keys(i).map(s=>({from:i[s].from,to:t,parcels:i[s].parcels}))}};var C=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.store=f(),this.api=x(),this.elements={estimateBtn:null,errorDiv:null,resultsDiv:null,totalDiv:null,validateBtn:null,shippingSection:null},this.selectedRates={},this.unsubscribeStore=null}init(){this.render(),this.bindEvents(),this.setupStoreSubscription()}render(){if(this.elements.shippingSection=document.createElement("div"),this.elements.shippingSection.id="devaito-shipping-section",this.elements.shippingSection.className="devaito-shipping-section",this.elements.shippingSection.style.cssText="margin-top: 20px;",this.elements.estimateBtn=this.createButton("devaito-estimate","\u2728 Estimer les frais de port","#00d084","devaito-btn-primary"),this.elements.errorDiv=this.createErrorDiv(),this.elements.resultsDiv=this.createResultsDiv(),this.elements.totalDiv=this.createTotalDiv(),this.elements.validateBtn=this.createButton("devaito-validate","\u2705 Valider la commande","#10b981","devaito-validate-btn"),this.elements.validateBtn.style.display="none",this.elements.shippingSection.appendChild(this.elements.estimateBtn),this.elements.shippingSection.appendChild(this.elements.errorDiv),this.elements.shippingSection.appendChild(this.elements.resultsDiv),this.elements.shippingSection.appendChild(this.elements.totalDiv),this.elements.shippingSection.appendChild(this.elements.validateBtn),this.isFloating)this.container.shippingSection=this.elements.shippingSection;else{let e=document.getElementById("devaito-products-section");if(e)e.parentNode.insertBefore(this.elements.shippingSection,e.nextSibling);else{let t=document.getElementById("devaito-content");t&&t.appendChild(this.elements.shippingSection)}}}createButton(e,t,i,s){let n=document.createElement("button");return n.id=e,n.className=s,n.textContent=t,n.style.cssText=`
      width: 100%;
      padding: 14px 20px;
      border-radius: 10px;
      border: none;
      background: ${i};
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
    `,n}createErrorDiv(){let e=document.createElement("div");return e.id="devaito-error",e.style.cssText=`
      color: #dc2626;
      margin-top: 12px;
      font-size: 14px;
      padding: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      display: none;
    `,e}createResultsDiv(){let e=document.createElement("div");return e.id="devaito-results",e.style.cssText=`
      margin-top: 20px;
      max-height: 300px;
      overflow-y: auto;
    `,e}createTotalDiv(){let e=document.createElement("div");return e.id="devaito-total",e.className="devaito-total-price",e.style.cssText=`
      font-weight: 700;
      font-size: 18px;
      color: #1f2937;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      display: none;
    `,e}bindEvents(){this.elements.estimateBtn.addEventListener("click",()=>this.handleEstimate()),this.elements.validateBtn.addEventListener("click",()=>this.handleValidation()),p.on(u.PRODUCTS_CHANGE,()=>{this.updateEstimateButtonState()}),p.on(u.ADDRESS_CHANGE,()=>{this.updateEstimateButtonState()})}async handleEstimate(){this.hideError(),this.clearResults(),this.setLoading(!0,"\u23F3 Calcul en cours...");try{let e=this.store.getClientAddress(),t=this.store.getProducts();if(!this.isValidAddress(e)){this.showError("\u26A0\uFE0F Veuillez compl\xE9ter tous les champs obligatoires"),this.setLoading(!1);return}if(t.length===0){this.showError("\u274C Aucun produit disponible pour l'estimation"),this.setLoading(!1);return}let i=this.prepareShippingRequests();if(i.length===0){this.showError("\u274C Impossible de pr\xE9parer les demandes d'exp\xE9dition"),this.setLoading(!1);return}let s=await this.api.getShippingRates(i);this.displayRates(s)}catch(e){this.showError(`\u274C ${e.message}`),a.error("Erreur estimation",e)}finally{this.setLoading(!1)}}prepareShippingRequests(){let e=this.store.getProducts(),t=this.store.getClientAddress();if(!t||!t.country)return[];let i={};return e.forEach(s=>{if(!s.fromAddress)return;let n=JSON.stringify(s.fromAddress);i[n]||(i[n]={from:s.fromAddress,parcels:[]});let o=h.calculateAdjustedDimensions(s.dimensions,s.quantity);i[n].parcels.push({length:o.length,width:o.width,height:o.height,distance_unit:o.distance_unit||"cm",weight:o.weight,mass_unit:o.mass_unit||"kg"})}),Object.keys(i).map(s=>({from:i[s].from,to:t,parcels:i[s].parcels}))}isValidAddress(e){return e.street1&&e.zip&&e.email&&e.country&&h.isValidEmail(e.email)}displayRates(e){if(this.elements.resultsDiv.innerHTML="",!e||e.length===0){this.elements.resultsDiv.innerHTML=`
        <div style="text-align: center; color: #6b7280; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <div style="font-size: 24px; margin-bottom: 8px;">\u{1F4ED}</div>
          <div>Aucune option de livraison disponible</div>
          <div style="font-size: 12px; margin-top: 4px;">V\xE9rifiez votre adresse de livraison</div>
        </div>
      `;return}e.sort((t,i)=>parseFloat(t.price)-parseFloat(i.price)),e.forEach((t,i)=>{let s=this.createRateCard(t,i===0);this.elements.resultsDiv.appendChild(s)})}createRateCard(e,t=!1){let i=document.createElement("div");i.className="devaito-rate-card",i.dataset.rateId=e.id||e.object_id,i.style.cssText=`
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
    `;let s=document.createElement("div");s.style.cssText="display: flex; align-items: center; gap: 12px; flex: 1;";let n=document.createElement("div");if(e.img){let d=document.createElement("img");d.src=e.img,d.alt=e.carrier,d.style.cssText="width: 40px; height: 40px; object-fit: contain; border-radius: 6px;",n.appendChild(d)}else n.innerHTML="\u{1F69A}",n.style.cssText="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;";let o=document.createElement("div");o.style.cssText="flex: 1;";let c=document.createElement("div");if(c.textContent=`${e.carrier} - ${e.service||"Service standard"}`,c.style.cssText="font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;",o.appendChild(c),e.estimated_days){let d=document.createElement("div");d.textContent=`Livraison estim\xE9e: ${e.estimated_days} jour${e.estimated_days>1?"s":""}`,d.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;",o.appendChild(d)}let l=document.createElement("div");l.style.cssText="text-align: right;";let m=document.createElement("div");if(m.textContent=`${parseFloat(e.price||0).toFixed(2)} ${e.currency||"EUR"}`,m.style.cssText="font-weight: 700; font-size: 16px; color: #00d084;",l.appendChild(m),t){let d=document.createElement("div");d.textContent="Le moins cher",d.style.cssText="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;",l.appendChild(d)}return s.appendChild(n),s.appendChild(o),i.appendChild(s),i.appendChild(l),i.addEventListener("click",()=>this.selectRate(e,i)),i}selectRate(e,t){this.elements.resultsDiv.querySelectorAll(".devaito-rate-card").forEach(s=>{s.classList.remove("selected"),s.style.borderColor="#e5e7eb"}),t.classList.add("selected"),t.style.borderColor="#00d084",this.selectedRates={[e.carrier]:{...e,object_id:e.id||e.object_id,servicepoint_token:e.relayToken||e.servicepoint_token}},this.updateTotal(),a.info("Taux s\xE9lectionn\xE9:",e)}updateTotal(){let e=Object.values(this.selectedRates);if(e.length===0){this.elements.totalDiv.style.display="none",this.elements.validateBtn.style.display="none";return}let t=e.reduce((i,s)=>i+parseFloat(s.price||0),0);this.elements.totalDiv.textContent=`Total estimation: ${t.toFixed(2)} EUR`,this.elements.totalDiv.style.display="block",this.elements.validateBtn.style.display="block"}async handleValidation(){let e=Object.values(this.selectedRates);if(e.length===0){this.showError("Veuillez s\xE9lectionner une option de livraison");return}let t=e[0],i=this.store.getClientAddress(),s=this.store.getProducts();this.setLoading(!0,"\u23F3 Cr\xE9ation du label...",!0);try{let n={orderId:`ORDER_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,orderNumber:`#${Date.now().toString().substr(-6)}`,customerName:i.name||"Client",customerEmail:i.email||"",customerPhone:i.phone||"",shippingAddress:i,items:s.map(l=>({name:l.name,quantity:l.quantity,weight:l.dimensions?.weight||1.5}))},o={rateId:t.object_id,relay_token:t.servicepoint_token||null,shopUrl:window.location.origin,orderData:n},c=await this.api.createLabel(o);if(c.success)this.showSuccess(c.shipment);else throw new Error(c.error||"Erreur inconnue lors de la cr\xE9ation du label")}catch(n){this.showError(`\u274C Erreur lors de la cr\xE9ation du label: ${n.message}`)}finally{this.setLoading(!1,null,!0)}}showSuccess(e){let t=`
      <div style="text-align: center; padding: 15px;">
        <div style="font-size: 40px; color: #10b981; margin-bottom: 10px;">\u2705</div>
        <h3 style="color: #059669; margin: 10px 0;">Label cr\xE9\xE9 avec succ\xE8s !</h3>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>\u{1F4E6} Num\xE9ro de suivi :</strong> ${e.trackingNumber||"N/A"}</p>
          <p style="margin: 5px 0;"><strong>\u{1F69A} Transporteur :</strong> ${e.carrier||"Inconnu"}</p>
          <p style="margin: 5px 0;"><strong>\u{1F4C4} Statut :</strong> ${e.status||"En traitement"}</p>
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          ${e.trackingUrl?`
            <a href="${e.trackingUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              \u{1F50D} Suivre le colis
            </a>
          `:""}
          ${e.labelUrl?`
            <a href="${e.labelUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              \u{1F4E5} T\xE9l\xE9charger le label
            </a>
          `:""}
        </div>
      </div>
    `;this.elements.errorDiv.innerHTML=t,this.elements.errorDiv.style.color="#059669",this.elements.errorDiv.style.background="#f0fdf4",this.elements.errorDiv.style.borderColor="#bbf7d0",this.elements.errorDiv.style.display="block",this.elements.validateBtn.style.display="none"}showError(e){this.elements.errorDiv.textContent=e,this.elements.errorDiv.style.display="block"}hideError(){this.elements.errorDiv.style.display="none"}clearResults(){this.elements.resultsDiv.innerHTML="",this.elements.totalDiv.style.display="none",this.elements.validateBtn.style.display="none",this.selectedRates={}}setLoading(e,t=null,i=!1){e?i?(this.elements.validateBtn.disabled=!0,this.elements.validateBtn.innerHTML=t||"\u23F3 Traitement...",this.elements.validateBtn.style.background="#9ca3af"):(this.elements.estimateBtn.disabled=!0,this.elements.estimateBtn.innerHTML=t||"\u23F3 Calcul en cours...",this.elements.estimateBtn.style.background="#9ca3af"):i?(this.elements.validateBtn.disabled=!1,this.elements.validateBtn.innerHTML="\u2705 Valider la commande",this.elements.validateBtn.style.background="#10b981"):(this.elements.estimateBtn.disabled=!1,this.elements.estimateBtn.innerHTML="\u2728 Estimer les frais de port",this.elements.estimateBtn.style.background="#00d084")}updateEstimateButtonState(){let e=this.store.isFormValid(),t=this.store.getProducts().length>0;this.elements.estimateBtn&&(this.elements.estimateBtn.disabled=!e||!t,this.elements.estimateBtn.style.opacity=e&&t?"1":"0.6",this.elements.estimateBtn.title=e?t?"Cliquez pour estimer les frais de port":"Aucun produit disponible":"Veuillez remplir le formulaire d'adresse")}setupStoreSubscription(){this.unsubscribeStore=this.store.subscribe((e,t)=>{(e.formStatus!==t.formStatus||e.products!==t.products)&&this.updateEstimateButtonState()})}destroy(){this.unsubscribeStore&&this.unsubscribeStore()}};function _(){if(!document.getElementById("devaito-widget-styles")){let r=document.createElement("style");r.id="devaito-widget-styles",r.textContent=`
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

      // ***************
      // Dans le fichier style.js, ajoutez ces styles :
      .devaito-products-section {
        margin-bottom: 20px;
      }

      .devaito-shipping-section {
        margin-top: 20px;
      }

      .devaito-rate-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        margin: 8px 0;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .devaito-rate-option:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      .devaito-rate-option.selected {
        background: #f0fdf4;
        border-color: #86efac;
        border-width: 2px;
      }

      .devaito-rate-info {
        flex: 1;
      }

      .devaito-rate-carrier {
        font-weight: 600;
        color: #1e293b;
      }

      .devaito-rate-service {
        font-size: 12px;
        color: #64748b;
      }

      .devaito-rate-price {
        font-weight: 700;
        color: #059669;
        font-size: 16px;
      }

      .devaito-loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #00d084;
        border-radius: 50%;
        animation: devaito-spin 1s linear infinite;
      }

      @keyframes devaito-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      // Ajoutez \xE0 la fin du fichier style.js
      #devaito-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: none;
      }

      #devaito-modal {
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
        display: none;
        flex-direction: column;
      }

      .devaito-modal-content {
        padding: 24px;
        overflow-y: auto;
        max-height: calc(80vh - 60px);
      }

      /* Styles pour les composants dans le modal */
      #devaito-modal .devaito-products-section,
      #devaito-modal .devaito-shipping-section {
        margin: 20px 0;
      }

      /* Animation d'ouverture */
      @keyframes devaito-modal-fadein {
        from { opacity: 0; transform: translate(-50%, -48%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }

      #devaito-modal {
        animation: devaito-modal-fadein 0.3s ease-out;
      }
    `,document.head.appendChild(r)}}typeof window.devaitoInitialized>"u"&&(window.devaitoInitialized=!0,(function(){if(a.info("Initialisation du widget modulaire"),L()){a.info("Mode Builder d\xE9tect\xE9 : script du widget non ex\xE9cut\xE9.");return}if(!F()){a.info("Pas sur une page avec slug, widget non initialis\xE9");return}_();function r(){let e=document.getElementById("devaito-widget"),t=e?e.getAttribute("data-shop-id"):null,i=!1,s=null;if(!e){if(a.info("Aucun conteneur trouv\xE9, cr\xE9ation d'un widget flottant"),typeof window.DEVAITO_SHOP_ID<"u")t=window.DEVAITO_SHOP_ID,a.info(`ShopID r\xE9cup\xE9r\xE9 depuis window.DEVAITO_SHOP_ID: ${t}`);else{a.error("Aucun shopId trouv\xE9 pour le widget flottant");return}s=document.createElement("div"),s.id="devaito-widget-floating",s.style.cssText="position: fixed; bottom: 150px; right: 20px; z-index: 10000;",document.body.appendChild(s),e=document.createElement("div"),e.id="devaito-modal-container",e.style.cssText="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10001;",document.body.appendChild(e),i=!0}if(!e){a.error("Container non trouv\xE9");return}if(document.getElementById("devaito-toggle")){a.info("Widget d\xE9j\xE0 initialis\xE9");return}if(!t){a.error("data-shop-id manquant");return}N({shopId:t,isFloating:i,clientAddress:{name:"",street1:"",city:"",state:"",zip:"",phone:"",email:"",country:"FR"},products:[],selectedRates:{},formStatus:"invalid",isLoading:!1,error:null,shippingRates:[],shipmentData:null});let n={form:new E(i?s:e,{isFloating:i,shopId:t}),product:new S(e,{isFloating:i,shopId:t}),shipping:new C(e,{isFloating:i})};n.form.init(),i?(window.devaitoModalComponents={product:n.product,shipping:n.shipping,modalContainer:e,form:n.form},n.product.init(!0),n.shipping.init()):(n.product.init(),n.shipping.init()),window.devaitoWidget={...n,store:window.__DEVAITO_STORE__,isFloating:i},a.info("Widget compl\xE8tement initialis\xE9")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r()})());})();
