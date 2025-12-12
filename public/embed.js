"use strict";(()=>{typeof window.devaitoInitialized>"u"&&(window.devaitoInitialized=!0,(function(){let Y={API_BASE:"http://localhost:3000/api",DEBUG:!0},a={info:(...i)=>console.log("[DEV]",...i),error:(...i)=>console.error("[DEV-ERR]",...i),debug:(...i)=>Y.DEBUG&&console.log("[DEV-DBG]",...i)};a.info("Initialisation du widget");function Ce(){return window.location.href.includes("/admin/builder")}if(Ce()){a.info("Mode Builder d\xE9tect\xE9 : script du widget non ex\xE9cut\xE9.");return}if(!document.getElementById("devaito-widget-styles")){let i=document.createElement("style");i.id="devaito-widget-styles",i.textContent=`
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
      `,document.head.appendChild(i)}function ke(){let i=window.location.pathname.toLowerCase();return i.includes("/checkout")||i.includes("/cart")||i.includes("/panier")||i.includes("/product/")||i.includes("/products/")}function O(){let i=window.location.pathname.toLowerCase();return i.includes("/cart")||i.includes("/panier")||i.includes("/checkout")}function U(){let i=window.location.pathname.toLowerCase();return i.includes("/product/")||i.includes("/products/")}function je(i){return{50:"CD",75:"FR",148:"MA"}[i]||"FR"}function de(){return window.location.origin}async function Te(i){try{let m=de(),h=await fetch(`${m}/api/v1/ecommerce-core/get-countries`);if(!h.ok)throw new Error("Erreur de chargement des pays");let x=(await h.json()).data?.countries||[];i.innerHTML='<option value="">S\xE9lectionnez un pays</option>',x.forEach(b=>{let g=document.createElement("option");g.value=b.id,g.textContent=b.name,g.dataset.code=b.code,i.appendChild(g)}),a.info(`${x.length} pays charg\xE9s`)}catch(m){a.error("Erreur chargement pays:",m);let h=[{id:"75",name:"France",code:"FR"},{id:"148",name:"Maroc",code:"MA"},{id:"50",name:"R\xE9publique D\xE9mocratique du Congo",code:"CD"}];i.innerHTML='<option value="">S\xE9lectionnez un pays</option>',h.forEach(l=>{let x=document.createElement("option");x.value=l.id,x.textContent=l.name,x.dataset.code=l.code,i.appendChild(x)})}}async function ye(i,m){if(!i){m.innerHTML=`<option value="">S\xE9lectionnez d'abord un pays</option>`;return}try{let h=de(),l=await fetch(`${h}/api/v1/ecommerce-core/get-states-of-countries`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({country_id:i})});if(!l.ok)throw new Error("Erreur de chargement des r\xE9gions");let b=(await l.json()).data?.states||[];m.innerHTML='<option value="">S\xE9lectionnez une r\xE9gion</option>',b.forEach(g=>{let E=document.createElement("option");E.value=g.id,E.textContent=g.name,m.appendChild(E)}),a.info(`${b.length} r\xE9gions charg\xE9es pour le pays ${i}`)}catch(h){a.error("Erreur chargement r\xE9gions:",h),m.innerHTML='<option value="">Erreur de chargement</option>'}}async function be(i,m){if(!i){m.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`;return}try{let h=de(),l=await fetch(`${h}/api/v1/ecommerce-core/get-cities-of-state`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({state_id:i})});if(!l.ok)throw new Error("Erreur de chargement des villes");let b=(await l.json()).data?.cities||[];m.innerHTML='<option value="">S\xE9lectionnez une ville</option>',b.forEach(g=>{let E=document.createElement("option");E.value=g.id,E.textContent=g.name,m.appendChild(E)}),a.info(`${b.length} villes charg\xE9es pour la r\xE9gion ${i}`)}catch(h){a.error("Erreur chargement villes:",h),m.innerHTML='<option value="">Erreur de chargement</option>'}}function we(){if(!ke()){a.info("Pas sur une page avec slug, widget non initialis\xE9");return}let i=document.getElementById("devaito-widget"),m=i?i.getAttribute("data-shop-id"):null,h=!1;if(!i){if(a.info("Aucun conteneur trouv\xE9, cr\xE9ation d'un widget flottant"),typeof window.DEVAITO_SHOP_ID<"u")m=window.DEVAITO_SHOP_ID,a.info(`ShopID r\xE9cup\xE9r\xE9 depuis window.DEVAITO_SHOP_ID: ${m}`);else{a.error("Aucun shopId trouv\xE9 pour le widget flottant");return}i=document.createElement("div"),i.id="devaito-widget-floating",i.style.cssText="position: fixed; bottom: 150px; right: 20px; z-index: 10000;",document.body.appendChild(i),h=!0}if(!i){a.error("Container non trouv\xE9");return}if(i.querySelector("#devaito-toggle")){a.info("Widget d\xE9j\xE0 initialis\xE9");return}if(!m){a.error("data-shop-id manquant");return}a.info(`Boutique: ${m}`);var l=document.createElement("div");if(l.className="devaito-card-widget",h){l.className+=" devaito-floating-widget",l.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3); transition: all 0.3s ease;";var x=document.createElement("div");x.innerHTML="\u{1F4E6}",x.style.cssText="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;",l.appendChild(x)}else l.style.cssText="background: white; width: 90%; max-width: 500px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; overflow: hidden; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;";if(!h){var b=document.createElement("div");b.style.cssText="padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb;";var g=document.createElement("label");g.className="devaito-toggle-container",g.htmlFor="devaito-toggle-checkbox",g.style.cssText="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 8px; border-radius: 8px; background: transparent;";var E=document.createElement("div");E.style.cssText="display: flex; align-items: center; gap: 12px;";var se=document.createElement("div");se.innerHTML="\u{1F4E6}",se.style.cssText="font-size: 20px;";var ce=document.createElement("div"),le=document.createElement("div");le.textContent="Estimation livraison",le.style.cssText="font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";var pe=document.createElement("div");pe.textContent="Calculez vos frais de port",pe.style.cssText="font-size: 13px; color: #6b7280; margin-top: 2px;",ce.appendChild(le),ce.appendChild(pe),E.appendChild(se),E.appendChild(ce);var K=document.createElement("div");K.style.cssText="position: relative; width: 48px; height: 24px;";var P=document.createElement("input");P.type="checkbox",P.id="devaito-toggle-checkbox",P.style.cssText="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2;";var G=document.createElement("div");G.style.cssText="width: 48px; height: 24px; background: #d1d5db; border-radius: 12px; position: relative; transition: all 0.3s ease;";var Q=document.createElement("div");Q.style.cssText="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);",G.appendChild(Q),K.appendChild(P),K.appendChild(G),g.appendChild(E),g.appendChild(K),b.appendChild(g),l.appendChild(b)}var y=document.createElement("div");y.id="devaito-content",y.style.cssText="display: none; padding: 24px; background: white;";var Z=document.createElement("div");Z.style.cssText="margin-bottom: 20px;";var ee=document.createElement("h4");ee.textContent="Adresse de livraison",ee.style.cssText="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; display: flex; align-items: center;";var W=document.createElement("span");W.id="devaito-form-status",W.className="devaito-form-status invalid",W.textContent="Veuillez remplir le formulaire d'adresse",W.style.cssText="font-size: 12px; margin-left: 10px;",ee.appendChild(W);var M=document.createElement("div");M.className="devaito-grid-responsive",M.style.cssText="display: flex; flex-direction: column; gap: 12px;";var Se=[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}],w=[];Se.forEach(function(e){var t=document.createElement("input");t.type=e.type,t.placeholder=e.placeholder,t.name=e.name,t.autocomplete=e.autocomplete,t.className="devaito-input-field",t.style.cssText="width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; color: #1f2937; box-sizing: border-box;",M.appendChild(t),w.push(t)});var z=document.createElement("select");z.id="devaito-country",z.className="devaito-select-field",z.innerHTML='<option value="">Chargement des pays...</option>';var S=document.createElement("select");S.id="devaito-state",S.className="devaito-select-field",S.innerHTML=`<option value="">S\xE9lectionnez d'abord un pays</option>`;var C=document.createElement("select");C.id="devaito-city",C.className="devaito-select-field",C.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`;var k=document.createElement("input");k.type="text",k.placeholder="Code postal",k.name="zip",k.autocomplete="postal-code",k.className="devaito-input-field",k.style.cssText="width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; color: #1f2937; box-sizing: border-box;",M.appendChild(z),M.appendChild(S),M.appendChild(C),M.appendChild(k),w.push(k),Z.appendChild(ee),Z.appendChild(M);var te=document.createElement("div");te.style.cssText="margin-bottom: 20px;";var ue=document.createElement("h4");ue.textContent="Produits",ue.style.cssText="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";var F=document.createElement("div");F.id="devaito-products",F.style.cssText="margin-bottom: 20px;",te.appendChild(ue),te.appendChild(F);var f=document.createElement("button");f.id="devaito-estimate",f.className="devaito-btn-primary",f.innerHTML="\u2728 Estimer les frais de port",f.style.cssText="width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;";var v=document.createElement("div");v.id="devaito-error",v.style.cssText="color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;";var N=document.createElement("div");N.id="devaito-results",N.style.cssText="margin-top: 20px;";var J=document.createElement("div");J.id="devaito-total",J.className="devaito-total-price",J.style.cssText="display: none;";var T=document.createElement("button");if(T.id="devaito-validate",T.className="devaito-validate-btn",T.innerHTML="\u2705 Valider la commande",T.style.cssText="display: none;",y.appendChild(Z),y.appendChild(te),y.appendChild(f),y.appendChild(v),y.appendChild(N),y.appendChild(J),y.appendChild(T),h){var I=document.createElement("div");I.className="devaito-floating-content",I.style.cssText="overflow-y: auto; height: calc(80vh - 60px); display: none; flex-direction: column;";var j=document.createElement("div");j.className="devaito-floating-header",j.style.cssText="padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb; display: none;";var me=document.createElement("div");me.className="devaito-floating-title",me.textContent="Estimation livraison";var ne=document.createElement("button");ne.className="devaito-close-btn",ne.innerHTML="\xD7",j.appendChild(me),j.appendChild(ne),I.appendChild(j),I.appendChild(y),l.appendChild(I),ne.addEventListener("click",function(e){e.stopPropagation(),I.style.display="none",j.style.display="none",x.style.display="flex",l.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);"}),l.addEventListener("click",function(e){(e.target===l||e.target===x)&&(x.style.display="none",j.style.display="flex",I.style.display="block",y.style.display="block",l.style.cssText="background: white; width: 90%; max-width: 500px; height: auto; max-height: 80vh; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: fixed; top: 150px; right: 20px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.15);")})}else{l.appendChild(y);var P=document.getElementById("devaito-toggle-checkbox");P.onchange=function(){this.checked?(y.style.display="block",G.style.background="#00d084",Q.style.transform="translateX(24px)",a.debug("Widget activ\xE9")):(y.style.display="block",G.style.background="#d1d5db",Q.style.transform="translateX(0)",a.debug("Widget d\xE9sactiv\xE9"))}}i.appendChild(l);var L=[],$={};function ze(){if(U()||O())return{};let e={},t={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};return Object.keys(t).forEach(o=>{let n=t[o],r=document.querySelector(n);r&&(e[o]=r.value)}),e}function fe(){if(U()||O())return;let e=ze(),t={name:0,street:1,phone:2,email:3};Object.keys(t).forEach(o=>{let n=t[o];e[o]&&w[n]&&(w[n].value=e[o])}),e.country&&(z.value=e.country,e.country&&ye(e.country,S)),e.state&&(S.value=e.state,e.state&&be(e.state,C)),e.city&&(C.value=e.city),e.zip&&(k.value=e.zip),q()}function B(){if(U()||O())return;let e=oe(),t={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};Object.keys(t).forEach(o=>{let n=t[o],r=document.querySelector(n);if(r&&e[o]){r.value=e[o];let c=new Event("change",{bubbles:!0});r.dispatchEvent(c)}})}function q(){let e=Le(),t=document.getElementById("devaito-form-status");if(e){if(t.textContent="Formulaire compl\xE9t\xE9",t.className="devaito-form-status valid",!t.querySelector(".devaito-checkmark")){let o=document.createElement("span");o.className="devaito-checkmark",o.innerHTML=" \u2713",t.appendChild(o)}}else{t.textContent="Veuillez remplir le formulaire d'adresse",t.className="devaito-form-status invalid";let o=t.querySelector(".devaito-checkmark");o&&t.removeChild(o)}}function Le(){return[w[0],w[1],w[2],w[3],z,S,C,k].every(t=>t.value&&t.value.trim()!=="")}Te(z),z.addEventListener("change",function(){let e=this.value;ye(e,S),C.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`,q(),B()}),S.addEventListener("change",function(){let e=this.value;be(e,C),q(),B()}),C.addEventListener("change",function(){q(),B()}),k.addEventListener("input",function(){q(),B()}),w.forEach(e=>{e.addEventListener("input",function(){q(),B()}),e.addEventListener("change",function(){q(),B()})}),!U()&&!O()&&(["#fullname","#email","#phone","#address","#postal-code","#country","#state","#city",'[name="name"]','[name="email"]','[name="phone"]','[name="address"]','[name="zip"]','[name="country"]','[name="state"]','[name="city"]'].forEach(t=>{document.querySelectorAll(t).forEach(n=>{n.addEventListener("input",fe),n.addEventListener("change",fe)})}),setTimeout(fe,1e3));function $e(){var e=window.location.pathname.toLowerCase();a.info(`Page: ${e}`);var t=[];if(O()){let o=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");o.length>0?(o.forEach(n=>{t.push({id:n.id,name:n.name,quantity:n.quantity,price:n.price})}),a.info(`${t.length} produits r\xE9cup\xE9r\xE9s depuis le localStorage`)):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(function(n){let r=n.querySelector(".product-name, .item-name"),c=n.querySelector('input[type="number"]'),d=n.getAttribute("data-product-id")||n.getAttribute("data-id");if(r){let s=r.textContent.trim(),p=c&&parseInt(c.value)||1;t.push({id:d,name:s,quantity:p}),a.debug(`Produit panier: ${s}, quantit\xE9: ${p}`)}})}else if(U()){let o=e.split("/product/")[1]?.split("/")[0]||e.split("/products/")[1]?.split("/")[0];if(o){let n=document.querySelector("h1.product-title, h1.product-name"),r=document.querySelector('input[type="number"].quantity-input'),c=n?n.textContent.trim():"Produit",d=r&&parseInt(r.value)||1;t.push({slug:o,name:c,quantity:d}),a.info(`Page produit, slug: ${o}, nom: ${c}, quantit\xE9: ${d}`)}}return t.length===0&&(a.info("Aucun produit d\xE9tect\xE9, utilisation du produit de d\xE9mo"),t=[{name:"Product Demo",quantity:1}]),a.info(`${t.length} produits d\xE9tect\xE9s`),t}async function Ee(){try{var e=$e();a.info(`Envoi requ\xEAte avec ${e.length} produits`);var t=await fetch(Y.API_BASE+"/get_shop_data_v2",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shopId:m,products:e,slugs:e.filter(n=>n.slug).map(n=>n.slug),productIds:e.filter(n=>n.id).map(n=>n.id)})});if(!t.ok)throw new Error(`Erreur API: ${t.status}`);var o=await t.json();a.info("R\xE9ponse API re\xE7ue"),L=o.products.map(function(n,r){let c=n.shippingAddress||o.shop.address||{name:o.shop.name,street1:"123 Default Street",city:"Paris",state:"IDF",zip:"75001",country:"FR"},d=O()&&e[r]&&e[r].name?e[r].name:n.name;return{id:r,name:d,quantity:e[r]?e[r].quantity:1,dimensions:n.dimensions,fromAddress:c}}),F.innerHTML="",L.length===0?(a.info("Aucun produit dans la r\xE9ponse"),F.innerHTML="<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible"):(a.info(`${L.length} produits charg\xE9s`),L.forEach(function(n){var r=document.createElement("div");r.className="devaito-product-item";var c=document.createElement("div");c.className="devaito-product-info";var d=document.createElement("div");d.className="devaito-product-name",d.textContent=n.name;var s=document.createElement("div");s.className="devaito-product-details",s.textContent=`${n.dimensions.length}\xD7${n.dimensions.width}\xD7${n.dimensions.height}cm, ${n.quantity} unit\xE9(s)`,c.appendChild(d),c.appendChild(s);var p=document.createElement("div");p.className="devaito-product-quantity",p.textContent=n.quantity,p.readOnly=!0,r.appendChild(c),r.appendChild(p),F.appendChild(r)}))}catch(n){R("Erreur de chargement des produits"),a.error("Erreur fetchShopData",n.message)}}function oe(){let e=z.options[z.selectedIndex],t=S.options[S.selectedIndex],o=C.options[C.selectedIndex],n=e?e.text:"",r=t?t.text:"",c=o?o.text:"",d=e?e.dataset.code:"FR";return{name:w[0].value||"",street1:w[1].value||"",city:c,state:r,zip:k.value||"",phone:w[2]?.value||"",email:w[3]?.value||"",country:d}}function Ae(){var e={};L.forEach(function(o){if(!o.fromAddress){a.error("Adresse d'exp\xE9dition manquante pour le produit",o);return}var n=JSON.stringify(o.fromAddress);e[n]||(e[n]={from:o.fromAddress,parcels:[]});let r=o.quantity,c=o.dimensions,d=Me(c,r),s={length:d.length,width:d.width,height:d.height,distance_unit:c.distance_unit||"cm",weight:d.weight,mass_unit:c.mass_unit||"kg"};e[n].parcels.push(s)});var t=[];return Object.keys(e).forEach(function(o){t.push({from:e[o].from,to:oe(),parcels:e[o].parcels})}),a.info(`${t.length} groupes d'exp\xE9dition pr\xE9par\xE9s`),t}function Me(e,t){let n=e.height||10,r=e.width||15,c=e.length||20,d=e.weight||1.5,s=n*t,p=r,A=c;if(s>100){let H=s-100,V=Math.ceil(s/100);s=100,p=r*V,a.debug(`Hauteur ajust\xE9e: ${n} \xD7 ${t} = ${n*t}cm \u2192 ${s}cm \xD7 ${V} stacks`)}return{length:A,width:p,height:s,weight:d*t,distance_unit:e.distance_unit||"cm",mass_unit:e.mass_unit||"kg"}}function R(e){v.textContent=e,v.style.display="block"}function Ne(){v.style.display="none"}function _e(){let e=0;Object.keys($).forEach(n=>{e+=parseFloat($[n].price)||0});let t=document.getElementById("devaito-total");t.textContent=`Total estimation: ${e.toFixed(2)} EUR`,t.style.display="block";let o=document.getElementById("devaito-validate");return o.style.display=Object.keys($).length>0?"block":"none",e}f.onclick=async function(){Ne(),N.innerHTML="",J.style.display="none",T.style.display="none",$={};var e=f.innerHTML;f.innerHTML="\u23F3 Calcul en cours...",f.disabled=!0,f.style.background="#9ca3af",a.info("D\xE9but estimation");var t=oe();if(a.debug("Adresse",t),!t.street1||!t.city||!t.zip||!t.email){R("\u26A0\uFE0F Veuillez compl\xE9ter tous les champs obligatoires"),f.innerHTML=e,f.disabled=!1,f.style.background="#00d084",a.info("Champs incomplets");return}if(await Ee(),!L.length){R("\u274C Aucun produit disponible pour l'estimation"),f.innerHTML=e,f.disabled=!1,f.style.background="#00d084",a.info("Aucun produit");return}var o=Ae();a.debug("Requ\xEAtes pr\xE9par\xE9es");try{var n=[];for(var r of o){a.info(`Envoi requ\xEAte pour ${r.parcels.length} colis`);var c=await fetch(Y.API_BASE+"/getRates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!c.ok)throw new Error(`Erreur: ${c.status}`);var d=await c.json();a.info(`${d.length} options re\xE7ues`),d.forEach(s=>{s.productId=0,n.push(s)})}if(N.innerHTML="",n.length===0)N.innerHTML="<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>\u{1F4ED} Aucune option de livraison disponible",a.info("Aucune option de livraison");else{let s={};n.forEach(p=>{s[p.productId]||(s[p.productId]=[]),s[p.productId].push(p)}),Object.keys(s).forEach(p=>{let A=s[p],H=L.find(u=>u.id==p)||L[0];var V=document.createElement("h5");V.textContent=`Options pour: ${H.name}`,V.style.cssText="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;",N.appendChild(V),A.sort((u,X)=>parseFloat(u.price)-parseFloat(X.price)),A.forEach(function(u,X){var _=document.createElement("div");_.className="devaito-rate-card",_.dataset.productId=p,_.dataset.rateId=X,_.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb;";var ie=document.createElement("div");ie.style.cssText="display: flex; align-items: center; gap: 12px; flex: 1;";var D=document.createElement("img");u.img?(D.src=u.img,D.alt=u.carrier,D.style.cssText="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;"):(D=document.createElement("div"),D.textContent="\u{1F69A}",D.style.cssText="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;");var ae=document.createElement("div");ae.style.cssText="flex: 1;";var he=document.createElement("div");he.textContent=`${u.carrier} - ${u.service}`,he.style.cssText="font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;";var ge=document.createElement("div");u.estimated_days&&(ge.textContent=`Livraison estim\xE9e: ${u.estimated_days} jour${u.estimated_days>1?"s":""}`,ge.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;"),ae.appendChild(he),u.estimated_days&&ae.appendChild(ge);var re=document.createElement("div");re.style.cssText="text-align: right;";var xe=document.createElement("div");xe.textContent=`${u.price} ${u.currency}`,xe.style.cssText="font-weight: 700; font-size: 16px; color: #00d084;";var ve=document.createElement("div");X===0&&(ve.textContent="Le moins cher",ve.style.cssText="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;"),re.appendChild(xe),X===0&&re.appendChild(ve),ie.appendChild(D),ie.appendChild(ae),_.appendChild(ie),_.appendChild(re),_.addEventListener("click",function(){document.querySelectorAll(`.devaito-rate-card[data-product-id="${p}"]`).forEach(Ie=>{Ie.classList.remove("selected")}),this.classList.add("selected"),$[p]={...u,object_id:u.id||u.object_id||u.rateId,servicepoint_token:u.relayToken||u.servicepoint_token||null},console.log("[DEV] Taux s\xE9lectionn\xE9 stock\xE9:",$[p]),_e()}),N.appendChild(_)})}),a.info(`${n.length} options affich\xE9es`)}}catch(s){R("\u274C Erreur lors de l'estimation des frais de port"),a.error("Erreur estimation",s.message)}finally{f.innerHTML=e,f.disabled=!1,f.style.background="#00d084"}},T.onclick=async function(){if(Object.keys($).length===0){R("Veuillez s\xE9lectionner une option de livraison");return}T.disabled=!0,T.innerHTML="\u23F3 Cr\xE9ation du label...";try{let e=oe(),t=Object.keys($)[0],o=$[t],n={orderId:`ORDER_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,orderNumber:`#${Date.now().toString().substr(-6)}`,customerName:e.name||"Client",customerEmail:e.email||"",customerPhone:e.phone||"",shippingAddress:e,items:L.map(s=>({name:s.name,quantity:s.quantity,weight:s.dimensions?.weight||1.5}))},r={rateId:o.object_id||o.rateId,relay_token:o.servicepoint_token||null,shopUrl:window.location.origin,orderData:n};a.info("Envoi \xE0 l'API create-label:",r);let c=await fetch(Y.API_BASE+"/create-label",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!c.ok){let s=await c.text();throw new Error(`Erreur API: ${c.status} - ${s}`)}let d=await c.json();if(a.info("R\xE9ponse create-label:",d),d.success){let s=`
              <div style="text-align: center; padding: 15px;">
                <div style="font-size: 40px; color: #10b981; margin-bottom: 10px;">\u2705</div>
                <h3 style="color: #059669; margin: 10px 0;">Label cr\xE9\xE9 avec succ\xE8s !</h3>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 15px 0;">
                  <p style="margin: 5px 0;"><strong>\u{1F4E6} Num\xE9ro de suivi :</strong> ${d.shipment.trackingNumber}</p>
                  <p style="margin: 5px 0;"><strong>\u{1F69A} Transporteur :</strong> ${d.shipment.carrier}</p>
                  <p style="margin: 5px 0;"><strong>\u{1F4C4} Statut :</strong> ${d.shipment.status}</p>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                  <a href="${d.shipment.trackingUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    \u{1F50D} Suivre le colis
                  </a>
                  <a href="${d.shipment.labelUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    \u{1F4E5} T\xE9l\xE9charger le label
                  </a>
                </div>
              </div>
            `,p=`\u2705 Label cr\xE9\xE9 avec succ\xE8s!<br>
              Num\xE9ro de suivi: <strong>${d.shipment.trackingNumber}</strong><br>
              Transporteur: ${d.shipment.carrier}<br>
              <a href="${d.shipment.trackingUrl}" target="_blank" style="color: #00d084; text-decoration: underline;">Suivre le colis</a><br>
              <a href="${d.shipment.labelUrl}" target="_blank" style="color: #00d084; text-decoration: underline;">T\xE9l\xE9charger le label</a>`;v.innerHTML=p,v.style.color="#059669",v.style.background="#f0fdf4",v.style.borderColor="#bbf7d0",v.style.display="block",a.info("Label cr\xE9\xE9 avec ID:",d.shipment.id),T.style.display="none";let A=document.createElement("button");A.textContent="Continuer les achats",A.style.cssText="width: 100%; padding: 12px 20px; border-radius: 8px; border: 1px solid #00d084; background: white; color: #00d084; font-weight: 600; cursor: pointer; margin-top: 16px;",A.onclick=function(){window.location.href="/"};let H=document.createElement("button");H.textContent="Fermer",H.style.cssText="width: 100%; padding: 12px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: #f9fafb; color: #374151; font-weight: 600; cursor: pointer; margin-top: 8px;",H.onclick=function(){v.style.display="none"},v.appendChild(document.createElement("br")),v.appendChild(A),v.appendChild(H)}else throw new Error(d.error||"Erreur inconnue lors de la cr\xE9ation du label")}catch(e){R(`\u274C Erreur lors de la cr\xE9ation du label: ${e.message}`),a.error("Erreur create-label",e)}finally{T.disabled=!1,T.innerHTML="\u2705 Valider la commande"}},a.info("Chargement initial"),Ee()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",we):we()})());})();
