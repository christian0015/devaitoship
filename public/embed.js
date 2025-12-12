"use strict";(()=>{var k=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames;var $=Object.prototype.hasOwnProperty;var M=(n,e)=>()=>(n&&(e=n(n=0)),e);var V=(n,e)=>{for(var t in e)k(n,t,{get:e[t],enumerable:!0})},G=(n,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of j(e))!$.call(n,i)&&i!==t&&k(n,i,{get:()=>e[i],enumerable:!(s=q(e,i))||s.enumerable});return n};var U=n=>G(k({},"__esModule",{value:!0}),n);var L={};V(L,{CONFIG:()=>v,prodLog:()=>a,utils:()=>m});var v,m,a,g=M(()=>{"use strict";v={API_BASE:"https://devaitoship.vercel.app/api",DEBUG:!0,MAX_HEIGHT:100,DEFAULT_DIMENSIONS:{length:20,width:15,height:10,weight:1.5,distance_unit:"cm",mass_unit:"kg"}},m={isInBuilder:()=>window.location.href.includes("/admin/builder"),isSlugPage:()=>{let n=window.location.pathname.toLowerCase();return n.includes("/checkout")||n.includes("/cart")||n.includes("/panier")||n.includes("/product/")||n.includes("/products/")},isCartOrCheckoutPage:()=>{let n=window.location.pathname.toLowerCase();return n.includes("/cart")||n.includes("/panier")||n.includes("/checkout")},isProductPage:()=>{let n=window.location.pathname.toLowerCase();return n.includes("/product/")||n.includes("/products/")},mapCountryIdToCode:n=>({50:"CD",75:"FR",148:"MA"})[n]||"FR",getShopBaseUrl:()=>window.location.origin,formatPrice:(n,e="EUR")=>`${parseFloat(n).toFixed(2)} ${e}`,isValidEmail:n=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n),calculateAdjustedDimensions:(n,e)=>{let t=v.MAX_HEIGHT,s=n.height||10,i=n.width||15,o=n.length||20,r=n.weight||1.5,d=s*e,l=i,p=o;if(d>t){let h=Math.ceil(d/t);d=t,l=i*h}return{length:p,width:l,height:d,weight:r*e,distance_unit:n.distance_unit||"cm",mass_unit:n.mass_unit||"kg"}},getProductInfo:()=>{let n=window.location.pathname.toLowerCase(),e=[];if(m.isCartOrCheckoutPage()){let t=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");t.length>0?e=t.map(s=>({id:s.id,name:s.name,quantity:s.quantity,price:s.price})):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(s=>{let i=s.querySelector(".product-name, .item-name"),o=s.querySelector('input[type="number"]'),r=s.getAttribute("data-product-id")||s.getAttribute("data-id");i&&e.push({id:r,name:i.textContent.trim(),quantity:o&&parseInt(o.value)||1})})}else if(m.isProductPage()){let t=n.split("/product/")[1]?.split("/")[0]||n.split("/products/")[1]?.split("/")[0];if(t){let s=document.querySelector("h1.product-title, h1.product-name"),i=document.querySelector('input[type="number"].quantity-input');e.push({slug:t,name:s?s.textContent.trim():"Produit",quantity:i&&parseInt(i.value)||1})}}return e.length===0&&(e=[{name:"Product Demo",quantity:1}]),e},getFormDataFromPage:()=>{if(m.isProductPage()||m.isCartOrCheckoutPage())return{};let n={},e={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};return Object.keys(e).forEach(t=>{let s=e[t],i=document.querySelector(s);i&&(n[t]=i.value)}),n}},a={info:(...n)=>console.log("[DEV]",...n),error:(...n)=>console.error("[DEV-ERR]",...n),debug:(...n)=>v.DEBUG&&console.log("[DEV-DBG]",...n)}});g();g();var{isInBuilder:F,isSlugPage:z,isCartOrCheckoutPage:E,isProductPage:w,mapCountryIdToCode:X,getShopBaseUrl:S,formatPrice:Y,isValidEmail:Q,calculateAdjustedDimensions:K,getProductInfo:Z,getFormDataFromPage:N}=m;function O(n){if(w()||E())return;["#fullname","#email","#phone","#address","#postal-code","#country","#state","#city",'[name="name"]','[name="email"]','[name="phone"]','[name="address"]','[name="zip"]','[name="country"]','[name="state"]','[name="city"]'].forEach(t=>{document.querySelectorAll(t).forEach(i=>{i.addEventListener("input",n),i.addEventListener("change",n)})})}function _(n){if(w()||E())return;let e={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};Object.keys(e).forEach(t=>{let s=e[t],i=document.querySelector(s);if(i&&n[t]){i.value=n[t];let o=new Event("change",{bubbles:!0});i.dispatchEvent(o)}})}var D=class extends EventTarget{constructor(){super()}emit(e,t={}){this.dispatchEvent(new CustomEvent(e,{detail:t}))}on(e,t){return this.addEventListener(e,t),()=>this.off(e,t)}off(e,t){this.removeEventListener(e,t)}once(e,t){let s=i=>{t(i),this.off(e,s)};this.on(e,s)}},c=new D,u={ADDRESS_CHANGE:"addressChange",PRODUCTS_CHANGE:"productsChange",RATES_CHANGE:"ratesChange",FORM_STATUS_CHANGE:"formStatusChange",SHIPPING_REQUEST:"shippingRequest",SHIPPING_RESPONSE:"shippingResponse",VALIDATION_REQUEST:"validationRequest",VALIDATION_RESPONSE:"validationResponse",ERROR:"error",LOADING_START:"loadingStart",LOADING_END:"loadingEnd"};g();var A=class{constructor(){this.state={shopId:null,isFloating:!1,clientAddress:{name:"",street1:"",city:"",state:"",zip:"",phone:"",email:"",country:"FR"},products:[],selectedRates:{},formStatus:"invalid",isLoading:!1,error:null,shippingRates:[],shipmentData:null},this.subscribers=new Set}setState(e){let t={...this.state};this.state={...this.state,...e},this.notifySubscribers(t,this.state),e.clientAddress&&t.clientAddress!==e.clientAddress&&c.dispatchEvent(new CustomEvent("addressChange",{detail:e.clientAddress})),e.products&&t.products!==e.products&&c.dispatchEvent(new CustomEvent("productsChange",{detail:e.products})),e.selectedRates&&t.selectedRates!==e.selectedRates&&c.dispatchEvent(new CustomEvent("ratesChange",{detail:e.selectedRates}))}getClientAddress(){return this.state.clientAddress}getProducts(){return this.state.products}getSelectedRates(){return this.state.selectedRates}getFormStatus(){return this.state.formStatus}subscribe(e){return this.subscribers.add(e),()=>this.subscribers.delete(e)}notifySubscribers(e,t){this.subscribers.forEach(s=>s(e,t))}isFormValid(){let e=this.state.clientAddress;return e.street1&&e.city&&e.zip&&e.email&&e.country}getTotalPrice(){return Object.values(this.state.selectedRates).reduce((e,t)=>e+(parseFloat(t.price)||0),0)}clearError(){this.setState({error:null})}setError(e){this.setState({error:e}),a.error("Store error:",e)}},x=null;function B(n={}){return x||(x=new A,x.setState(n),window.__DEVAITO_STORE__=x),x}function y(){if(!x)throw new Error("Store non initialis\xE9. Appelez initStore() d'abord.");return x}g();var R=class{constructor(){this.baseUrl=v.API_BASE}async fetchShopData(e,t){try{c.emit(u.LOADING_START,{action:"fetchShopData"}),a.info(`Envoi requ\xEAte avec ${t.length} produits`);let s=await fetch(`${this.baseUrl}/get_shop_data_v2`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shopId:e,products:t,slugs:t.filter(o=>o.slug).map(o=>o.slug),productIds:t.filter(o=>o.id).map(o=>o.id)})});if(!s.ok)throw new Error(`Erreur API: ${s.status}`);let i=await s.json();return a.info("R\xE9ponse API re\xE7ue"),c.emit(u.LOADING_END,{action:"fetchShopData"}),i}catch(s){throw c.emit(u.ERROR,{action:"fetchShopData",error:s.message}),s}}async getShippingRates(e){try{c.emit(u.LOADING_START,{action:"getShippingRates"});let t=[];for(let s of e){a.info(`Envoi requ\xEAte pour ${s.parcels.length} colis`);let i=await fetch(`${this.baseUrl}/getRates`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!i.ok)throw new Error(`Erreur: ${i.status}`);let o=await i.json();a.info(`${o.length} options re\xE7ues`),o.forEach(r=>{r.productId=0,t.push(r)})}return c.emit(u.LOADING_END,{action:"getShippingRates"}),c.emit(u.SHIPPING_RESPONSE,{rates:t}),t}catch(t){throw c.emit(u.ERROR,{action:"getShippingRates",error:t.message}),t}}async createLabel(e){try{c.emit(u.LOADING_START,{action:"createLabel"}),a.info("Envoi \xE0 l'API create-label:",e);let t=await fetch(`${this.baseUrl}/create-label`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let i=await t.text();throw new Error(`Erreur API: ${t.status} - ${i}`)}let s=await t.json();return a.info("R\xE9ponse create-label:",s),c.emit(u.LOADING_END,{action:"createLabel"}),c.emit(u.VALIDATION_RESPONSE,{result:s}),s}catch(t){throw c.emit(u.ERROR,{action:"createLabel",error:t.message}),t}}async loadCountries(){try{let e=S(),t=await fetch(`${e}/api/v1/ecommerce-core/get-countries`);if(!t.ok)throw new Error("Erreur de chargement des pays");return(await t.json()).data?.countries||[]}catch(e){return a.error("Erreur chargement pays:",e),[{id:"75",name:"France",code:"FR"},{id:"148",name:"Maroc",code:"MA"},{id:"50",name:"R\xE9publique D\xE9mocratique du Congo",code:"CD"}]}}async loadStates(e){if(!e)return[];try{let t=S(),s=await fetch(`${t}/api/v1/ecommerce-core/get-states-of-countries`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({country_id:e})});if(!s.ok)throw new Error("Erreur de chargement des r\xE9gions");return(await s.json()).data?.states||[]}catch(t){return a.error("Erreur chargement r\xE9gions:",t),[]}}async loadCities(e){if(!e)return[];try{let t=S(),s=await fetch(`${t}/api/v1/ecommerce-core/get-cities-of-state`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({state_id:e})});if(!s.ok)throw new Error("Erreur de chargement des villes");return(await s.json()).data?.cities||[]}catch(t){return a.error("Erreur chargement villes:",t),[]}}},P=null;function b(){return P||(P=new R),P}g();var C=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.shopId=t.shopId,this.store=y(),this.api=b(),this.elements={widgetCard:null,content:null,floatingIcon:null,floatingHeader:null,expandedContent:null,closeBtn:null,inputs:{},selects:{}},this.unsubscribeStore=null}init(){this.render(),this.bindEvents(),this.setupStoreSubscription(),this.syncWithPageForm(),this.loadCountries()}render(){this.createWidgetStructure(),this.createAddressSection(),this.isFloating?this.setupFloatingWidget():this.setupIntegratedWidget()}createWidgetStructure(){if(this.elements.widgetCard=document.createElement("div"),this.elements.widgetCard.className="devaito-card-widget",this.isFloating){this.elements.widgetCard.className+=" devaito-floating-widget",this.elements.widgetCard.style.cssText=`
        background: white; 
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
        z-index: 10000;
      `,this.elements.floatingIcon=document.createElement("div"),this.elements.floatingIcon.innerHTML="\u{1F4E6}",this.elements.floatingIcon.style.cssText=`
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: 100%; 
        height: 100%;
      `,this.elements.widgetCard.appendChild(this.elements.floatingIcon),this.elements.expandedContent=document.createElement("div"),this.elements.expandedContent.className="devaito-floating-content",this.elements.expandedContent.style.cssText=`
        overflow-y: auto; 
        height: calc(80vh - 60px); 
        display: none; 
        flex-direction: column;
      `,this.elements.floatingHeader=document.createElement("div"),this.elements.floatingHeader.className="devaito-floating-header",this.elements.floatingHeader.style.cssText=`
        padding: 16px; 
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
        border-bottom: 1px solid #e5e7eb; 
        display: none;
      `;let e=document.createElement("div");e.className="devaito-floating-title",e.textContent="Estimation livraison",this.elements.closeBtn=document.createElement("button"),this.elements.closeBtn.className="devaito-close-btn",this.elements.closeBtn.innerHTML="\xD7",this.elements.floatingHeader.appendChild(e),this.elements.floatingHeader.appendChild(this.elements.closeBtn),this.elements.expandedContent.appendChild(this.elements.floatingHeader),this.elements.content=document.createElement("div"),this.elements.content.id="devaito-content",this.elements.content.style.cssText="padding: 24px; background: white;",this.elements.expandedContent.appendChild(this.elements.content),this.elements.widgetCard.appendChild(this.elements.expandedContent)}else this.elements.widgetCard.style.cssText=`
        background: white; 
        width: 90%; 
        max-width: 500px; 
        border-radius: 12px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
        border: 1px solid #e5e7eb; 
        overflow: hidden; 
        margin: 20px auto; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `,this.createHeader(),this.elements.content=document.createElement("div"),this.elements.content.id="devaito-content",this.elements.content.style.cssText="display: none; padding: 24px; background: white;",this.elements.widgetCard.appendChild(this.elements.content);this.container.appendChild(this.elements.widgetCard)}createHeader(){let e=document.createElement("div");e.style.cssText=`
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
    `;let s=document.createElement("div");s.style.cssText="display: flex; align-items: center; gap: 12px;";let i=document.createElement("div");i.innerHTML="\u{1F4E6}",i.style.cssText="font-size: 20px;";let o=document.createElement("div"),r=document.createElement("div");r.textContent="Estimation livraison",r.style.cssText="font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";let d=document.createElement("div");d.textContent="Calculez vos frais de port",d.style.cssText="font-size: 13px; color: #6b7280; margin-top: 2px;",o.appendChild(r),o.appendChild(d),s.appendChild(i),s.appendChild(o);let l=document.createElement("div");l.style.cssText="position: relative; width: 48px; height: 24px;",this.elements.checkbox=document.createElement("input"),this.elements.checkbox.type="checkbox",this.elements.checkbox.id="devaito-toggle-checkbox",this.elements.checkbox.style.cssText=`
      position: absolute; 
      opacity: 0; 
      width: 100%; 
      height: 100%; 
      cursor: pointer; 
      z-index: 2;
    `;let p=document.createElement("div");p.style.cssText=`
      width: 48px; 
      height: 24px; 
      background: #d1d5db; 
      border-radius: 12px; 
      position: relative; 
      transition: all 0.3s ease;
    `;let h=document.createElement("div");h.style.cssText=`
      width: 20px; 
      height: 20px; 
      background: white; 
      border-radius: 50%; 
      position: absolute; 
      top: 2px; 
      left: 2px; 
      transition: all 0.3s ease; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `,p.appendChild(h),l.appendChild(this.elements.checkbox),l.appendChild(p),t.appendChild(s),t.appendChild(l),e.appendChild(t),this.elements.widgetCard.insertBefore(e,this.elements.content),this.elements.checkbox.addEventListener("change",()=>{this.elements.checkbox.checked?(this.elements.content.style.display="block",p.style.background="#00d084",h.style.transform="translateX(24px)",a.debug("Widget activ\xE9")):(this.elements.content.style.display="none",p.style.background="#d1d5db",h.style.transform="translateX(0)",a.debug("Widget d\xE9sactiv\xE9"))})}createAddressSection(){let e=document.createElement("div");e.style.cssText="margin-bottom: 20px;";let t=document.createElement("h4");t.textContent="Adresse de livraison",t.style.cssText=`
      margin: 0 0 16px 0; 
      font-size: 14px; 
      font-weight: 600; 
      color: #374151; 
      display: flex; 
      align-items: center;
    `,this.elements.formStatus=document.createElement("span"),this.elements.formStatus.id="devaito-form-status",this.elements.formStatus.className="devaito-form-status invalid",this.elements.formStatus.textContent="Veuillez remplir le formulaire d'adresse",this.elements.formStatus.style.cssText="font-size: 12px; margin-left: 10px;",t.appendChild(this.elements.formStatus);let s=document.createElement("div");s.className="devaito-grid-responsive",s.style.cssText="display: flex; flex-direction: column; gap: 12px;",[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}].forEach(o=>{let r=document.createElement("input");r.type=o.type,r.placeholder=o.placeholder,r.name=o.name,r.autocomplete=o.autocomplete,r.className="devaito-input-field",r.style.cssText=`
        width: 100%; 
        padding: 12px 16px; 
        border: 1.5px solid #d1d5db; 
        border-radius: 8px; 
        font-size: 14px; 
        background: #f9fafb; 
        color: #1f2937; 
        box-sizing: border-box;
      `,this.elements.inputs[o.name]=r,s.appendChild(r)}),this.elements.selects.country=this.createSelect("devaito-country","Chargement des pays..."),this.elements.selects.state=this.createSelect("devaito-state","S\xE9lectionnez d'abord un pays"),this.elements.selects.city=this.createSelect("devaito-city","S\xE9lectionnez d'abord une r\xE9gion"),this.elements.inputs.zip=this.createInput("zip","Code postal","postal-code"),s.appendChild(this.elements.selects.country),s.appendChild(this.elements.selects.state),s.appendChild(this.elements.selects.city),s.appendChild(this.elements.inputs.zip),e.appendChild(t),e.appendChild(s),this.elements.content.appendChild(e)}createSelect(e,t){let s=document.createElement("select");return s.id=e,s.className="devaito-select-field",s.innerHTML=`<option value="">${t}</option>`,s.style.cssText=`
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
    `,i}async loadCountries(){try{let e=await this.api.loadCountries();this.elements.selects.country.innerHTML='<option value="">S\xE9lectionnez un pays</option>',e.forEach(t=>{let s=document.createElement("option");s.value=t.id,s.textContent=t.name,s.dataset.code=t.code,this.elements.selects.country.appendChild(s)})}catch(e){a.error("Erreur chargement pays:",e)}}bindEvents(){this.elements.selects.country.addEventListener("change",async e=>{let t=e.target.value;await this.loadStates(t),this.elements.selects.city.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`,this.updateStoreFromForm()}),this.elements.selects.state.addEventListener("change",async e=>{let t=e.target.value;await this.loadCities(t),this.updateStoreFromForm()}),this.elements.selects.city.addEventListener("change",()=>{this.updateStoreFromForm()}),Object.values(this.elements.inputs).forEach(e=>{e.addEventListener("input",()=>this.updateStoreFromForm()),e.addEventListener("change",()=>this.updateStoreFromForm())}),this.isFloating&&(this.elements.floatingIcon.addEventListener("click",e=>{e.stopPropagation(),this.expandFloatingWidget()}),this.elements.widgetCard.addEventListener("click",e=>{e.target===this.elements.widgetCard&&this.expandFloatingWidget()}),this.elements.closeBtn.addEventListener("click",e=>{e.stopPropagation(),this.collapseFloatingWidget()}),this.elements.expandedContent.addEventListener("click",e=>{e.stopPropagation()})),!w()&&!E()&&O(()=>this.syncWithPageForm())}async loadStates(e){try{let t=await this.api.loadStates(e);this.elements.selects.state.innerHTML='<option value="">S\xE9lectionnez une r\xE9gion</option>',t.forEach(s=>{let i=document.createElement("option");i.value=s.id,i.textContent=s.name,this.elements.selects.state.appendChild(i)})}catch(t){a.error("Erreur chargement r\xE9gions:",t)}}async loadCities(e){try{let t=await this.api.loadCities(e);this.elements.selects.city.innerHTML='<option value="">S\xE9lectionnez une ville</option>',t.forEach(s=>{let i=document.createElement("option");i.value=s.id,i.textContent=s.name,this.elements.selects.city.appendChild(i)})}catch(t){a.error("Erreur chargement villes:",t)}}expandFloatingWidget(){this.elements.floatingIcon.style.display="none",this.elements.floatingHeader.style.display="flex",this.elements.expandedContent.style.display="block",this.elements.content.style.display="block";let e=window.innerWidth,t=window.innerHeight,s=Math.min(500,e-40),i=Math.min(600,t-100);this.elements.widgetCard.style.cssText=`
      background: white; 
      width: ${s}px; 
      height: ${i}px; 
      border-radius: 12px; 
      overflow: hidden; 
      display: flex; 
      flex-direction: column; 
      position: fixed; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%);
      z-index: 10001; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `,this.createOverlay()}createOverlay(){let e=document.getElementById("devaito-overlay");e?e.style.display="block":(e=document.createElement("div"),e.id="devaito-overlay",e.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: block;
      `,document.body.appendChild(e),e.addEventListener("click",()=>{this.collapseFloatingWidget()})),this.elements.overlay=e}collapseFloatingWidget(){this.elements.expandedContent.style.display="none",this.elements.floatingHeader.style.display="none",this.elements.floatingIcon.style.display="flex",this.elements.widgetCard.style.cssText=`
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
    `,this.elements.overlay&&(this.elements.overlay.style.display="none")}updateStoreFromForm(){let e=this.getFormAddress(),t=this.isFormValid(e);this.store.setState({clientAddress:e,formStatus:t?"valid":"invalid"}),this.updateFormStatusUI(t),this.syncToPageForm(e)}getFormAddress(){let e=this.elements.selects.country.options[this.elements.selects.country.selectedIndex],t=this.elements.selects.state.options[this.elements.selects.state.selectedIndex],s=this.elements.selects.city.options[this.elements.selects.city.selectedIndex];return{name:this.elements.inputs.name.value||"",street1:this.elements.inputs.street.value||"",city:s?s.text:"",state:t?t.text:"",zip:this.elements.inputs.zip.value||"",phone:this.elements.inputs.phone.value||"",email:this.elements.inputs.email.value||"",country:e?e.dataset.code:"FR"}}isFormValid(e){let{isValidEmail:t}=(g(),U(L)).utils;return e.street1&&e.city&&e.zip&&e.email&&e.country&&t(e.email)}updateFormStatusUI(e){e?(this.elements.formStatus.textContent="Formulaire compl\xE9t\xE9",this.elements.formStatus.className="devaito-form-status valid"):(this.elements.formStatus.textContent="Veuillez remplir le formulaire d'adresse",this.elements.formStatus.className="devaito-form-status invalid")}syncWithPageForm(){if(w()||E())return;let e=N();e.name&&this.elements.inputs.name&&(this.elements.inputs.name.value=e.name),e.street&&this.elements.inputs.street&&(this.elements.inputs.street.value=e.street),e.phone&&this.elements.inputs.phone&&(this.elements.inputs.phone.value=e.phone),e.email&&this.elements.inputs.email&&(this.elements.inputs.email.value=e.email),e.zip&&this.elements.inputs.zip&&(this.elements.inputs.zip.value=e.zip),this.updateStoreFromForm()}syncToPageForm(e){_(e)}setupStoreSubscription(){this.unsubscribeStore=this.store.subscribe((e,t)=>{e.formStatus!==t.formStatus&&this.updateFormStatusUI(t.formStatus==="valid")})}destroy(){this.unsubscribeStore&&this.unsubscribeStore()}};g();var T=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.store=y(),this.api=b(),this.elements={productsSection:null,productsContainer:null}}init(){this.render(),this.bindEvents(),this.loadProducts()}render(){this.elements.productsSection=document.createElement("div"),this.elements.productsSection.style.cssText="margin-bottom: 20px;";let e=document.createElement("h4");e.textContent="Produits",e.style.cssText="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;",this.elements.productsContainer=document.createElement("div"),this.elements.productsContainer.id="devaito-products",this.elements.productsContainer.style.cssText="margin-bottom: 20px;",this.elements.productsSection.appendChild(e),this.elements.productsSection.appendChild(this.elements.productsContainer);let t=document.getElementById("devaito-content")||this.container.querySelector(".devaito-floating-content");t&&t.appendChild(this.elements.productsSection)}async loadProducts(){try{let e=this.getProductInfo(),t=this.store.state,s=await this.api.fetchShopData(t.shopId,e),i=s.products.map((o,r)=>{let d=o.shippingAddress||s.shop.address||{name:s.shop.name,street1:"123 Default Street",city:"Paris",state:"IDF",zip:"75001",country:"FR"},l=m.isCartOrCheckoutPage()&&e[r]&&e[r].name?e[r].name:o.name;return{id:r,name:l,quantity:e[r]?e[r].quantity:1,dimensions:o.dimensions,fromAddress:d}});this.store.setState({products:i}),this.renderProducts(i)}catch(e){a.error("Erreur chargement produits:",e),c.emit(u.ERROR,{action:"loadProducts",error:e.message})}}getProductInfo(){let e=window.location.pathname.toLowerCase(),t=[];if(m.isCartOrCheckoutPage()){let s=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");s.length>0?t=s.map(i=>({id:i.id,name:i.name,quantity:i.quantity,price:i.price})):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(i=>{let o=i.querySelector(".product-name, .item-name"),r=i.querySelector('input[type="number"]'),d=i.getAttribute("data-product-id")||i.getAttribute("data-id");o&&t.push({id:d,name:o.textContent.trim(),quantity:r&&parseInt(r.value)||1})})}else if(m.isProductPage()){let s=e.split("/product/")[1]?.split("/")[0]||e.split("/products/")[1]?.split("/")[0];if(s){let i=document.querySelector("h1.product-title, h1.product-name"),o=document.querySelector('input[type="number"].quantity-input');t.push({slug:s,name:i?i.textContent.trim():"Produit",quantity:o&&parseInt(o.value)||1})}}return t.length===0&&(t=[{name:"Product Demo",quantity:1}]),t}renderProducts(e){if(this.elements.productsContainer.innerHTML="",e.length===0){this.elements.productsContainer.innerHTML="<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible";return}e.forEach(t=>{let s=document.createElement("div");s.className="devaito-product-item";let i=document.createElement("div");i.className="devaito-product-info";let o=document.createElement("div");o.className="devaito-product-name",o.textContent=t.name;let r=document.createElement("div");r.className="devaito-product-details",r.textContent=`${t.dimensions.length}\xD7${t.dimensions.width}\xD7${t.dimensions.height}cm, ${t.quantity} unit\xE9(s)`,i.appendChild(o),i.appendChild(r);let d=document.createElement("div");d.className="devaito-product-quantity",d.textContent=t.quantity,d.readOnly=!0,s.appendChild(i),s.appendChild(d),this.elements.productsContainer.appendChild(s)})}prepareShippingRequests(){let e=this.store.getProducts(),t=this.store.getClientAddress(),s={};return e.forEach(i=>{if(!i.fromAddress)return;let o=JSON.stringify(i.fromAddress);s[o]||(s[o]={from:i.fromAddress,parcels:[]});let r=m.calculateAdjustedDimensions(i.dimensions,i.quantity);s[o].parcels.push({length:r.length,width:r.width,height:r.height,distance_unit:r.distance_unit,weight:r.weight,mass_unit:r.mass_unit})}),Object.keys(s).map(i=>({from:s[i].from,to:t,parcels:s[i].parcels}))}bindEvents(){c.on(u.ADDRESS_CHANGE,()=>{})}};g();var I=class{constructor(e,t={}){this.container=e,this.isFloating=t.isFloating||!1,this.store=y(),this.api=b(),this.elements={estimateBtn:null,errorDiv:null,resultsDiv:null,totalDiv:null,validateBtn:null},this.unsubscribeStore=null}init(){this.render(),this.bindEvents(),this.setupStoreSubscription()}render(){this.elements.estimateBtn=document.createElement("button"),this.elements.estimateBtn.id="devaito-estimate",this.elements.estimateBtn.className="devaito-btn-primary",this.elements.estimateBtn.innerHTML="\u2728 Estimer les frais de port",this.elements.estimateBtn.style.cssText="width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;",this.elements.errorDiv=document.createElement("div"),this.elements.errorDiv.id="devaito-error",this.elements.errorDiv.style.cssText="color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;",this.elements.resultsDiv=document.createElement("div"),this.elements.resultsDiv.id="devaito-results",this.elements.resultsDiv.style.cssText="margin-top: 20px;",this.elements.totalDiv=document.createElement("div"),this.elements.totalDiv.id="devaito-total",this.elements.totalDiv.className="devaito-total-price",this.elements.totalDiv.style.cssText="display: none;",this.elements.validateBtn=document.createElement("button"),this.elements.validateBtn.id="devaito-validate",this.elements.validateBtn.className="devaito-validate-btn",this.elements.validateBtn.innerHTML="\u2705 Valider la commande",this.elements.validateBtn.style.cssText="display: none;";let e=document.getElementById("devaito-content")||this.container.querySelector(".devaito-floating-content");e&&(e.appendChild(this.elements.estimateBtn),e.appendChild(this.elements.errorDiv),e.appendChild(this.elements.resultsDiv),e.appendChild(this.elements.totalDiv),e.appendChild(this.elements.validateBtn))}bindEvents(){this.elements.estimateBtn.addEventListener("click",()=>this.handleEstimate()),this.elements.validateBtn.addEventListener("click",()=>this.handleValidation()),this.unsubscribeStore=this.store.subscribe((e,t)=>{e.selectedRates!==t.selectedRates&&this.updateTotal(),e.formStatus!==t.formStatus&&this.updateEstimateButtonState()})}async handleEstimate(){this.hideError(),this.clearResults();let e=this.store.getClientAddress(),t=this.store.getProducts();if(!this.isValidAddress(e)){this.showError("\u26A0\uFE0F Veuillez compl\xE9ter tous les champs obligatoires");return}if(t.length===0){this.showError("\u274C Aucun produit disponible pour l'estimation");return}this.setLoading(!0);try{let s=this.store.state.productComponent?.prepareShippingRequests()||[],i=await this.api.getShippingRates(s);this.displayRates(i)}catch(s){this.showError("\u274C Erreur lors de l'estimation des frais de port"),a.error("Erreur estimation",s)}finally{this.setLoading(!1)}}isValidAddress(e){return e.street1&&e.city&&e.zip&&e.email&&e.country&&m.isValidEmail(e.email)}displayRates(e){if(this.elements.resultsDiv.innerHTML="",e.length===0){this.elements.resultsDiv.innerHTML="<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>\u{1F4ED} Aucune option de livraison disponible";return}let t={0:e};Object.keys(t).forEach(s=>{let i=t[s],o=this.store.getProducts()[s]||this.store.getProducts()[0],r=document.createElement("h5");r.textContent=`Options pour: ${o.name}`,r.style.cssText="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;",this.elements.resultsDiv.appendChild(r),i.sort((d,l)=>parseFloat(d.price)-parseFloat(l.price)),i.forEach((d,l)=>{let p=this.createRateCard(d,s,l);this.elements.resultsDiv.appendChild(p)})})}createRateCard(e,t,s){let i=document.createElement("div");i.className="devaito-rate-card",i.dataset.productId=t,i.dataset.rateId=s,i.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb; cursor: pointer;";let o=document.createElement("div");o.style.cssText="display: flex; align-items: center; gap: 12px; flex: 1;";let r=e.img?this.createCarrierLogo(e.img,e.carrier):this.createDefaultLogo(),d=document.createElement("div");d.style.cssText="flex: 1;";let l=document.createElement("div");if(l.textContent=`${e.carrier} - ${e.service}`,l.style.cssText="font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;",d.appendChild(l),e.estimated_days){let f=document.createElement("div");f.textContent=`Livraison estim\xE9e: ${e.estimated_days} jour${e.estimated_days>1?"s":""}`,f.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;",d.appendChild(f)}let p=document.createElement("div");p.style.cssText="text-align: right;";let h=document.createElement("div");if(h.textContent=`${e.price} ${e.currency}`,h.style.cssText="font-weight: 700; font-size: 16px; color: #00d084;",p.appendChild(h),s===0){let f=document.createElement("div");f.textContent="Le moins cher",f.style.cssText="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;",p.appendChild(f)}return o.appendChild(r),o.appendChild(d),i.appendChild(o),i.appendChild(p),i.addEventListener("click",()=>this.selectRate(e,t,i)),i}selectRate(e,t,s){document.querySelectorAll(`.devaito-rate-card[data-product-id="${t}"]`).forEach(i=>{i.classList.remove("selected")}),s.classList.add("selected"),this.store.setState({selectedRates:{...this.store.getSelectedRates(),[t]:{...e,object_id:e.id||e.object_id||e.rateId,servicepoint_token:e.relayToken||e.servicepoint_token||null}}}),a.info("Taux s\xE9lectionn\xE9:",e)}updateTotal(){let e=this.store.getTotalPrice();if(e>0){this.elements.totalDiv.textContent=`Total estimation: ${m.formatPrice(e)}`,this.elements.totalDiv.style.display="block";let t=Object.keys(this.store.getSelectedRates()).length>0;this.elements.validateBtn.style.display=t?"block":"none"}else this.elements.totalDiv.style.display="none",this.elements.validateBtn.style.display="none"}async handleValidation(){let e=this.store.getSelectedRates(),t=this.store.getClientAddress(),s=this.store.getProducts();if(Object.keys(e).length===0){this.showError("Veuillez s\xE9lectionner une option de livraison");return}this.setLoading(!0,"Cr\xE9ation du label...");try{let i=Object.keys(e)[0],o=e[i],r={orderId:`ORDER_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,orderNumber:`#${Date.now().toString().substr(-6)}`,customerName:t.name||"Client",customerEmail:t.email||"",customerPhone:t.phone||"",shippingAddress:t,items:s.map(p=>({name:p.name,quantity:p.quantity,weight:p.dimensions?.weight||1.5}))},d={rateId:o.object_id||o.rateId,relay_token:o.servicepoint_token||null,shopUrl:window.location.origin,orderData:r},l=await this.api.createLabel(d);if(l.success)this.showSuccess(l.shipment);else throw new Error(l.error||"Erreur inconnue")}catch(i){this.showError(`\u274C Erreur lors de la cr\xE9ation du label: ${i.message}`)}finally{this.setLoading(!1)}}showSuccess(e){let t=`
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
    `;this.elements.errorDiv.innerHTML=t,this.elements.errorDiv.style.color="#059669",this.elements.errorDiv.style.background="#f0fdf4",this.elements.errorDiv.style.borderColor="#bbf7d0",this.elements.errorDiv.style.display="block",this.elements.validateBtn.style.display="none"}showError(e){this.elements.errorDiv.textContent=e,this.elements.errorDiv.style.display="block"}hideError(){this.elements.errorDiv.style.display="none"}clearResults(){this.elements.resultsDiv.innerHTML="",this.elements.totalDiv.style.display="none",this.elements.validateBtn.style.display="none",this.store.setState({selectedRates:{}})}setLoading(e,t=null){e?(this.elements.estimateBtn.disabled=!0,this.elements.estimateBtn.style.background="#9ca3af",this.elements.estimateBtn.innerHTML=t||"\u23F3 Calcul en cours...",this.elements.validateBtn.disabled=!0,this.elements.validateBtn.innerHTML="\u23F3 Traitement..."):(this.elements.estimateBtn.disabled=!1,this.elements.estimateBtn.style.background="#00d084",this.elements.estimateBtn.innerHTML="\u2728 Estimer les frais de port",this.elements.validateBtn.disabled=!1,this.elements.validateBtn.innerHTML="\u2705 Valider la commande")}updateEstimateButtonState(){let e=this.store.isFormValid();this.elements.estimateBtn.disabled=!e,this.elements.estimateBtn.style.opacity=e?"1":"0.6"}createCarrierLogo(e,t){let s=document.createElement("img");return s.src=e,s.alt=t,s.style.cssText="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;",s}createDefaultLogo(){let e=document.createElement("div");return e.textContent="\u{1F69A}",e.style.cssText="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;",e}setupStoreSubscription(){this.unsubscribeStore=this.store.subscribe((e,t)=>{e.formStatus!==t.formStatus&&this.updateEstimateButtonState()})}destroy(){this.unsubscribeStore&&this.unsubscribeStore()}};function H(){if(!document.getElementById("devaito-widget-styles")){let n=document.createElement("style");n.id="devaito-widget-styles",n.textContent=`
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
    `,document.head.appendChild(n)}}typeof window.devaitoInitialized>"u"&&(window.devaitoInitialized=!0,(function(){if(a.info("Initialisation du widget modulaire"),F()){a.info("Mode Builder d\xE9tect\xE9 : script du widget non ex\xE9cut\xE9.");return}if(!z()){a.info("Pas sur une page avec slug, widget non initialis\xE9");return}H();function n(){let e=document.getElementById("devaito-widget"),t=e?e.getAttribute("data-shop-id"):null,s=!1;if(!e){if(a.info("Aucun conteneur trouv\xE9, cr\xE9ation d'un widget flottant"),typeof window.DEVAITO_SHOP_ID<"u")t=window.DEVAITO_SHOP_ID,a.info(`ShopID r\xE9cup\xE9r\xE9 depuis window.DEVAITO_SHOP_ID: ${t}`);else{a.error("Aucun shopId trouv\xE9 pour le widget flottant");return}e=document.createElement("div"),e.id="devaito-widget-floating",e.style.cssText="position: fixed; bottom: 150px; right: 20px; z-index: 10000;",document.body.appendChild(e),s=!0}if(!e){a.error("Container non trouv\xE9");return}if(e.querySelector("#devaito-toggle")){a.info("Widget d\xE9j\xE0 initialis\xE9");return}if(!t){a.error("data-shop-id manquant");return}B({shopId:t,isFloating:s,clientAddress:{name:"",street1:"",city:"",state:"",zip:"",phone:"",email:"",country:"FR"},products:[],selectedRates:{},formStatus:"invalid",isLoading:!1,error:null,shippingRates:[],shipmentData:null});let i=new C(e,{isFloating:s,shopId:t}),o=new T(e,{isFloating:s,shopId:t}),r=new I(e,{isFloating:s});i.init(),o.init(),r.init(),window.devaitoWidget={formComponent:i,productComponent:o,shippingComponent:r,store:window.__DEVAITO_STORE__}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",n):n()})());})();
