"use strict";(()=>{typeof window.devaitoInitialized>"u"&&(window.devaitoInitialized=!0,(function(){let X={API_BASE:"http://localhost:3000/api",DEBUG:!0},a={info:(...o)=>console.log("[DEV]",...o),error:(...o)=>console.error("[DEV-ERR]",...o),debug:(...o)=>X.DEBUG&&console.log("[DEV-DBG]",...o)};a.info("Initialisation du widget");function Te(){return window.location.href.includes("/admin/builder")}if(Te()){a.info("Mode Builder d\xE9tect\xE9 : script du widget non ex\xE9cut\xE9.");return}if(!document.getElementById("devaito-widget-styles")){let o=document.createElement("style");o.id="devaito-widget-styles",o.textContent=`
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
      `,document.head.appendChild(o)}function ke(){let o=window.location.pathname.toLowerCase();return o.includes("/checkout")||o.includes("/cart")||o.includes("/panier")||o.includes("/product/")||o.includes("/products/")}function D(){let o=window.location.pathname.toLowerCase();return o.includes("/cart")||o.includes("/panier")||o.includes("/checkout")}function V(){let o=window.location.pathname.toLowerCase();return o.includes("/product/")||o.includes("/products/")}function Ne(o){return{50:"CD",75:"FR",148:"MA"}[o]||"FR"}function re(){return window.location.origin}async function Se(o){try{let p=re(),f=await fetch(`${p}/api/v1/ecommerce-core/get-countries`);if(!f.ok)throw new Error("Erreur de chargement des pays");let g=(await f.json()).data?.countries||[];o.innerHTML='<option value="">S\xE9lectionnez un pays</option>',g.forEach(y=>{let h=document.createElement("option");h.value=y.id,h.textContent=y.name,h.dataset.code=y.code,o.appendChild(h)}),a.info(`${g.length} pays charg\xE9s`)}catch(p){a.error("Erreur chargement pays:",p);let f=[{id:"75",name:"France",code:"FR"},{id:"148",name:"Maroc",code:"MA"},{id:"50",name:"R\xE9publique D\xE9mocratique du Congo",code:"CD"}];o.innerHTML='<option value="">S\xE9lectionnez un pays</option>',f.forEach(c=>{let g=document.createElement("option");g.value=c.id,g.textContent=c.name,g.dataset.code=c.code,o.appendChild(g)})}}async function xe(o,p){if(!o){p.innerHTML=`<option value="">S\xE9lectionnez d'abord un pays</option>`;return}try{let f=re(),c=await fetch(`${f}/api/v1/ecommerce-core/get-states-of-countries`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({country_id:o})});if(!c.ok)throw new Error("Erreur de chargement des r\xE9gions");let y=(await c.json()).data?.states||[];p.innerHTML='<option value="">S\xE9lectionnez une r\xE9gion</option>',y.forEach(h=>{let E=document.createElement("option");E.value=h.id,E.textContent=h.name,p.appendChild(E)}),a.info(`${y.length} r\xE9gions charg\xE9es pour le pays ${o}`)}catch(f){a.error("Erreur chargement r\xE9gions:",f),p.innerHTML='<option value="">Erreur de chargement</option>'}}async function ye(o,p){if(!o){p.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`;return}try{let f=re(),c=await fetch(`${f}/api/v1/ecommerce-core/get-cities-of-state`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({state_id:o})});if(!c.ok)throw new Error("Erreur de chargement des villes");let y=(await c.json()).data?.cities||[];p.innerHTML='<option value="">S\xE9lectionnez une ville</option>',y.forEach(h=>{let E=document.createElement("option");E.value=h.id,E.textContent=h.name,p.appendChild(E)}),a.info(`${y.length} villes charg\xE9es pour la r\xE9gion ${o}`)}catch(f){a.error("Erreur chargement villes:",f),p.innerHTML='<option value="">Erreur de chargement</option>'}}function be(){if(!ke()){a.info("Pas sur une page avec slug, widget non initialis\xE9");return}let o=document.getElementById("devaito-widget"),p=o?o.getAttribute("data-shop-id"):null,f=!1;if(!o){if(a.info("Aucun conteneur trouv\xE9, cr\xE9ation d'un widget flottant"),typeof window.DEVAITO_SHOP_ID<"u")p=window.DEVAITO_SHOP_ID,a.info(`ShopID r\xE9cup\xE9r\xE9 depuis window.DEVAITO_SHOP_ID: ${p}`);else{a.error("Aucun shopId trouv\xE9 pour le widget flottant");return}o=document.createElement("div"),o.id="devaito-widget-floating",o.style.cssText="position: fixed; bottom: 150px; right: 20px; z-index: 10000;",document.body.appendChild(o),f=!0}if(!o){a.error("Container non trouv\xE9");return}if(o.querySelector("#devaito-toggle")){a.info("Widget d\xE9j\xE0 initialis\xE9");return}if(!p){a.error("data-shop-id manquant");return}a.info(`Boutique: ${p}`);var c=document.createElement("div");if(c.className="devaito-card-widget",f){c.className+=" devaito-floating-widget",c.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3); transition: all 0.3s ease;";var g=document.createElement("div");g.innerHTML="\u{1F4E6}",g.style.cssText="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;",c.appendChild(g)}else c.style.cssText="background: white; width: 90%; max-width: 500px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; overflow: hidden; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;";if(!f){var y=document.createElement("div");y.style.cssText="padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb;";var h=document.createElement("label");h.className="devaito-toggle-container",h.htmlFor="devaito-toggle-checkbox",h.style.cssText="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 8px; border-radius: 8px; background: transparent;";var E=document.createElement("div");E.style.cssText="display: flex; align-items: center; gap: 12px;";var de=document.createElement("div");de.innerHTML="\u{1F4E6}",de.style.cssText="font-size: 20px;";var se=document.createElement("div"),ce=document.createElement("div");ce.textContent="Estimation livraison",ce.style.cssText="font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";var le=document.createElement("div");le.textContent="Calculez vos frais de port",le.style.cssText="font-size: 13px; color: #6b7280; margin-top: 2px;",se.appendChild(ce),se.appendChild(le),E.appendChild(de),E.appendChild(se);var Y=document.createElement("div");Y.style.cssText="position: relative; width: 48px; height: 24px;";var P=document.createElement("input");P.type="checkbox",P.id="devaito-toggle-checkbox",P.style.cssText="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2;";var R=document.createElement("div");R.style.cssText="width: 48px; height: 24px; background: #d1d5db; border-radius: 12px; position: relative; transition: all 0.3s ease;";var K=document.createElement("div");K.style.cssText="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);",R.appendChild(K),Y.appendChild(P),Y.appendChild(R),h.appendChild(E),h.appendChild(Y),y.appendChild(h),c.appendChild(y)}var x=document.createElement("div");x.id="devaito-content",x.style.cssText="display: none; padding: 24px; background: white;";var Q=document.createElement("div");Q.style.cssText="margin-bottom: 20px;";var Z=document.createElement("h4");Z.textContent="Adresse de livraison",Z.style.cssText="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; display: flex; align-items: center;";var G=document.createElement("span");G.id="devaito-form-status",G.className="devaito-form-status invalid",G.textContent="Veuillez remplir le formulaire d'adresse",G.style.cssText="font-size: 12px; margin-left: 10px;",Z.appendChild(G);var A=document.createElement("div");A.className="devaito-grid-responsive",A.style.cssText="display: flex; flex-direction: column; gap: 12px;";var ze=[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}],b=[];ze.forEach(function(e){var t=document.createElement("input");t.type=e.type,t.placeholder=e.placeholder,t.name=e.name,t.autocomplete=e.autocomplete,t.className="devaito-input-field",t.style.cssText="width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; color: #1f2937; box-sizing: border-box;",A.appendChild(t),b.push(t)});var S=document.createElement("select");S.id="devaito-country",S.className="devaito-select-field",S.innerHTML='<option value="">Chargement des pays...</option>';var T=document.createElement("select");T.id="devaito-state",T.className="devaito-select-field",T.innerHTML=`<option value="">S\xE9lectionnez d'abord un pays</option>`;var w=document.createElement("select");w.id="devaito-city",w.className="devaito-select-field",w.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`;var C=document.createElement("input");C.type="text",C.placeholder="Code postal",C.name="zip",C.autocomplete="postal-code",C.className="devaito-input-field",C.style.cssText="width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; color: #1f2937; box-sizing: border-box;",A.appendChild(S),A.appendChild(T),A.appendChild(w),A.appendChild(C),b.push(C),Q.appendChild(Z),Q.appendChild(A);var ee=document.createElement("div");ee.style.cssText="margin-bottom: 20px;";var pe=document.createElement("h4");pe.textContent="Produits",pe.style.cssText="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";var _=document.createElement("div");_.id="devaito-products",_.style.cssText="margin-bottom: 20px;",ee.appendChild(pe),ee.appendChild(_);var m=document.createElement("button");m.id="devaito-estimate",m.className="devaito-btn-primary",m.innerHTML="\u2728 Estimer les frais de port",m.style.cssText="width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;";var z=document.createElement("div");z.id="devaito-error",z.style.cssText="color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;";var M=document.createElement("div");M.id="devaito-results",M.style.cssText="margin-top: 20px;";var U=document.createElement("div");U.id="devaito-total",U.className="devaito-total-price",U.style.cssText="display: none;";var k=document.createElement("button");if(k.id="devaito-validate",k.className="devaito-validate-btn",k.innerHTML="\u2705 Valider la commande",k.style.cssText="display: none;",x.appendChild(Q),x.appendChild(ee),x.appendChild(m),x.appendChild(z),x.appendChild(M),x.appendChild(U),x.appendChild(k),f){var q=document.createElement("div");q.className="devaito-floating-content",q.style.cssText="overflow-y: auto; height: calc(80vh - 60px); display: none; flex-direction: column;";var H=document.createElement("div");H.className="devaito-floating-header",H.style.cssText="padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb; display: none;";var ue=document.createElement("div");ue.className="devaito-floating-title",ue.textContent="Estimation livraison";var te=document.createElement("button");te.className="devaito-close-btn",te.innerHTML="\xD7",H.appendChild(ue),H.appendChild(te),q.appendChild(H),q.appendChild(x),c.appendChild(q),te.addEventListener("click",function(e){e.stopPropagation(),q.style.display="none",H.style.display="none",g.style.display="flex",c.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);"}),c.addEventListener("click",function(e){(e.target===c||e.target===g)&&(g.style.display="none",H.style.display="flex",q.style.display="block",x.style.display="block",c.style.cssText="background: white; width: 90%; max-width: 500px; height: auto; max-height: 80vh; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: fixed; top: 150px; right: 20px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.15);")})}else{c.appendChild(x);var P=document.getElementById("devaito-toggle-checkbox");P.onchange=function(){this.checked?(x.style.display="block",R.style.background="#00d084",K.style.transform="translateX(24px)",a.debug("Widget activ\xE9")):(x.style.display="block",R.style.background="#d1d5db",K.style.transform="translateX(0)",a.debug("Widget d\xE9sactiv\xE9"))}}o.appendChild(c);var L=[],I={};function Le(){if(V()||D())return{};let e={},t={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};return Object.keys(t).forEach(i=>{let n=t[i],r=document.querySelector(n);r&&(e[i]=r.value)}),e}function me(){if(V()||D())return;let e=Le(),t={name:0,street:1,phone:2,email:3};Object.keys(t).forEach(i=>{let n=t[i];e[i]&&b[n]&&(b[n].value=e[i])}),e.country&&(S.value=e.country,e.country&&xe(e.country,T)),e.state&&(T.value=e.state,e.state&&ye(e.state,w)),e.city&&(w.value=e.city),e.zip&&(C.value=e.zip),N()}function F(){if(V()||D())return;let e=W(),t={name:'#fullname, [name="name"], [name="fullname"]',email:'#email, [name="email"]',phone:'#phone, [name="phone"]',street:'#address, [name="address"], [name="street"]',zip:'#postal-code, [name="zip"], [name="postal_code"]',city:'#city, [name="city"]',state:'#state, [name="state"]',country:'#country, [name="country"]'};Object.keys(t).forEach(i=>{let n=t[i],r=document.querySelector(n);if(r&&e[i]){r.value=e[i];let d=new Event("change",{bubbles:!0});r.dispatchEvent(d)}})}function N(){let e=Ae(),t=document.getElementById("devaito-form-status");if(e){if(t.textContent="Formulaire compl\xE9t\xE9",t.className="devaito-form-status valid",!t.querySelector(".devaito-checkmark")){let i=document.createElement("span");i.className="devaito-checkmark",i.innerHTML=" \u2713",t.appendChild(i)}}else{t.textContent="Veuillez remplir le formulaire d'adresse",t.className="devaito-form-status invalid";let i=t.querySelector(".devaito-checkmark");i&&t.removeChild(i)}}function Ae(){return[b[0],b[1],b[2],b[3],S,T,w,C].every(t=>t.value&&t.value.trim()!=="")}Se(S),S.addEventListener("change",function(){let e=this.value;xe(e,T),w.innerHTML=`<option value="">S\xE9lectionnez d'abord une r\xE9gion</option>`,N(),F()}),T.addEventListener("change",function(){let e=this.value;ye(e,w),N(),F()}),w.addEventListener("change",function(){N(),F()}),C.addEventListener("input",function(){N(),F()}),b.forEach(e=>{e.addEventListener("input",function(){N(),F()}),e.addEventListener("change",function(){N(),F()})}),!V()&&!D()&&(["#fullname","#email","#phone","#address","#postal-code","#country","#state","#city",'[name="name"]','[name="email"]','[name="phone"]','[name="address"]','[name="zip"]','[name="country"]','[name="state"]','[name="city"]'].forEach(t=>{document.querySelectorAll(t).forEach(n=>{n.addEventListener("input",me),n.addEventListener("change",me)})}),setTimeout(me,1e3));function Me(){var e=window.location.pathname.toLowerCase();a.info(`Page: ${e}`);var t=[];if(D()){let i=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");i.length>0?(i.forEach(n=>{t.push({id:n.id,name:n.name,quantity:n.quantity,price:n.price})}),a.info(`${t.length} produits r\xE9cup\xE9r\xE9s depuis le localStorage`)):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(function(n){let r=n.querySelector(".product-name, .item-name"),d=n.querySelector('input[type="number"]'),l=n.getAttribute("data-product-id")||n.getAttribute("data-id");if(r){let s=r.textContent.trim(),u=d&&parseInt(d.value)||1;t.push({id:l,name:s,quantity:u}),a.debug(`Produit panier: ${s}, quantit\xE9: ${u}`)}})}else if(V()){let i=e.split("/product/")[1]?.split("/")[0]||e.split("/products/")[1]?.split("/")[0];if(i){let n=document.querySelector("h1.product-title, h1.product-name"),r=document.querySelector('input[type="number"].quantity-input'),d=n?n.textContent.trim():"Produit",l=r&&parseInt(r.value)||1;t.push({slug:i,name:d,quantity:l}),a.info(`Page produit, slug: ${i}, nom: ${d}, quantit\xE9: ${l}`)}}return t.length===0&&(a.info("Aucun produit d\xE9tect\xE9, utilisation du produit de d\xE9mo"),t=[{name:"Product Demo",quantity:1}]),a.info(`${t.length} produits d\xE9tect\xE9s`),t}async function Ee(){try{var e=Me();a.info(`Envoi requ\xEAte avec ${e.length} produits`);var t=await fetch(X.API_BASE+"/get_shop_data_v2",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shopId:p,products:e,slugs:e.filter(n=>n.slug).map(n=>n.slug),productIds:e.filter(n=>n.id).map(n=>n.id)})});if(!t.ok)throw new Error(`Erreur API: ${t.status}`);var i=await t.json();a.info("R\xE9ponse API re\xE7ue"),L=i.products.map(function(n,r){let d=n.shippingAddress||i.shop.address||{name:i.shop.name,street1:"123 Default Street",city:"Paris",state:"IDF",zip:"75001",country:"FR"},l=D()&&e[r]&&e[r].name?e[r].name:n.name;return{id:r,name:l,quantity:e[r]?e[r].quantity:1,dimensions:n.dimensions,fromAddress:d}}),_.innerHTML="",L.length===0?(a.info("Aucun produit dans la r\xE9ponse"),_.innerHTML="<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible"):(a.info(`${L.length} produits charg\xE9s`),L.forEach(function(n){var r=document.createElement("div");r.className="devaito-product-item";var d=document.createElement("div");d.className="devaito-product-info";var l=document.createElement("div");l.className="devaito-product-name",l.textContent=n.name;var s=document.createElement("div");s.className="devaito-product-details",s.textContent=`${n.dimensions.length}\xD7${n.dimensions.width}\xD7${n.dimensions.height}cm, ${n.quantity} unit\xE9(s)`,d.appendChild(l),d.appendChild(s);var u=document.createElement("div");u.className="devaito-product-quantity",u.textContent=n.quantity,u.readOnly=!0,r.appendChild(d),r.appendChild(u),_.appendChild(r)}))}catch(n){j("Erreur de chargement des produits"),a.error("Erreur fetchShopData",n.message)}}function W(){let e=S.options[S.selectedIndex],t=T.options[T.selectedIndex],i=w.options[w.selectedIndex],n=e?e.text:"",r=t?t.text:"",d=i?i.text:"",l=e?e.dataset.code:"FR";return{name:b[0].value||"",street1:b[1].value||"",city:d,state:r,zip:C.value||"",phone:b[2]?.value||"",email:b[3]?.value||"",country:l}}function $e(){var e={};L.forEach(function(i){if(!i.fromAddress){a.error("Adresse d'exp\xE9dition manquante pour le produit",i);return}var n=JSON.stringify(i.fromAddress);e[n]||(e[n]={from:i.fromAddress,parcels:[]});let r=i.quantity,d=i.dimensions,l=qe(d,r),s={length:l.length,width:l.width,height:l.height,distance_unit:d.distance_unit||"cm",weight:l.weight,mass_unit:d.mass_unit||"kg"};e[n].parcels.push(s)});var t=[];return Object.keys(e).forEach(function(i){t.push({from:e[i].from,to:W(),parcels:e[i].parcels})}),a.info(`${t.length} groupes d'exp\xE9dition pr\xE9par\xE9s`),t}function qe(e,t){let n=e.height||10,r=e.width||15,d=e.length||20,l=e.weight||1.5,s=n*t,u=r,ne=d;if(s>100){let Ce=s-100,B=Math.ceil(s/100);s=100,u=r*B,a.debug(`Hauteur ajust\xE9e: ${n} \xD7 ${t} = ${n*t}cm \u2192 ${s}cm \xD7 ${B} stacks`)}return{length:ne,width:u,height:s,weight:l*t,distance_unit:e.distance_unit||"cm",mass_unit:e.mass_unit||"kg"}}function j(e){z.textContent=e,z.style.display="block"}function He(){z.style.display="none"}function we(){let e=0;Object.keys(I).forEach(n=>{e+=parseFloat(I[n].price)||0});let t=document.getElementById("devaito-total");t.textContent=`Total estimation: ${e.toFixed(2)} EUR`,t.style.display="block";let i=document.getElementById("devaito-validate");return i.style.display=Object.keys(I).length>0?"block":"none",e}m.onclick=async function(){He(),M.innerHTML="",U.style.display="none",k.style.display="none",I={};var e=m.innerHTML;m.innerHTML="\u23F3 Calcul en cours...",m.disabled=!0,m.style.background="#9ca3af",a.info("D\xE9but estimation");var t=W();if(a.debug("Adresse",t),!t.street1||!t.city||!t.zip||!t.email){j("\u26A0\uFE0F Veuillez compl\xE9ter tous les champs obligatoires"),m.innerHTML=e,m.disabled=!1,m.style.background="#00d084",a.info("Champs incomplets");return}if(await Ee(),!L.length){j("\u274C Aucun produit disponible pour l'estimation"),m.innerHTML=e,m.disabled=!1,m.style.background="#00d084",a.info("Aucun produit");return}var i=$e();a.debug("Requ\xEAtes pr\xE9par\xE9es");try{var n=[];for(var r of i){a.info(`Envoi requ\xEAte pour ${r.parcels.length} colis`);var d=await fetch(X.API_BASE+"/getRates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!d.ok)throw new Error(`Erreur: ${d.status}`);var l=await d.json();a.info(`${l.length} options re\xE7ues`),l.forEach(s=>{s.productId=0,n.push(s)})}if(M.innerHTML="",n.length===0)M.innerHTML="<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>\u{1F4ED} Aucune option de livraison disponible",a.info("Aucune option de livraison");else{let s={};n.forEach(u=>{s[u.productId]||(s[u.productId]=[]),s[u.productId].push(u)}),Object.keys(s).forEach(u=>{let ne=s[u],Ce=L.find(v=>v.id==u)||L[0];var B=document.createElement("h5");B.textContent=`Options pour: ${Ce.name}`,B.style.cssText="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;",M.appendChild(B),ne.sort((v,J)=>parseFloat(v.price)-parseFloat(J.price)),ne.forEach(function(v,J){var $=document.createElement("div");$.className="devaito-rate-card",$.dataset.productId=u,$.dataset.rateId=J,$.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb;";var oe=document.createElement("div");oe.style.cssText="display: flex; align-items: center; gap: 12px; flex: 1;";var O=document.createElement("img");v.img?(O.src=v.img,O.alt=v.carrier,O.style.cssText="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;"):(O=document.createElement("div"),O.textContent="\u{1F69A}",O.style.cssText="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;");var ie=document.createElement("div");ie.style.cssText="flex: 1;";var fe=document.createElement("div");fe.textContent=`${v.carrier} - ${v.service}`,fe.style.cssText="font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;";var he=document.createElement("div");v.estimated_days&&(he.textContent=`Livraison estim\xE9e: ${v.estimated_days} jour${v.estimated_days>1?"s":""}`,he.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;"),ie.appendChild(fe),v.estimated_days&&ie.appendChild(he);var ae=document.createElement("div");ae.style.cssText="text-align: right;";var ge=document.createElement("div");ge.textContent=`${v.price} ${v.currency}`,ge.style.cssText="font-weight: 700; font-size: 16px; color: #00d084;";var ve=document.createElement("div");J===0&&(ve.textContent="Le moins cher",ve.style.cssText="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;"),ae.appendChild(ge),J===0&&ae.appendChild(ve),oe.appendChild(O),oe.appendChild(ie),$.appendChild(oe),$.appendChild(ae),$.addEventListener("click",function(){document.querySelectorAll(`.devaito-rate-card[data-product-id="${u}"]`).forEach(Ie=>{Ie.classList.remove("selected")}),this.classList.add("selected"),I[u]=v,we()}),M.appendChild($)})}),a.info(`${n.length} options affich\xE9es`)}}catch(s){j("\u274C Erreur lors de l'estimation des frais de port"),a.error("Erreur estimation",s.message)}finally{m.innerHTML=e,m.disabled=!1,m.style.background="#00d084"}},k.onclick=async function(){if(Object.keys(I).length===0){j("Veuillez s\xE9lectionner une option de livraison");return}k.disabled=!0,k.innerHTML="\u23F3 Traitement...";try{let e={shopId:p,shopUrl:window.location.origin,customerEmail:W().email,products:L.map(n=>({name:n.name,quantity:n.quantity,dimensions:n.dimensions})),shippingOptions:I,totalPrice:we(),shippingAddress:W()};a.info("Envoi des donn\xE9es de commande \xE0 l'API");let t=await fetch(X.API_BASE+"/wait-commande-validation-shipping",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error("Erreur lors de l'envoi des donn\xE9es");let i=await t.json();a.info("Commande enregistr\xE9e avec succ\xE8s",i),j("\u2705 Commande enregistr\xE9e avec succ\xE8s! Vous allez \xEAtre redirig\xE9."),z.style.color="#059669",z.style.background="#f0fdf4",z.style.borderColor="#bbf7d0",setTimeout(()=>{},2e3)}catch(e){j("\u274C Erreur lors de l'enregistrement de la commande"),a.error("Erreur validation",e.message)}finally{k.disabled=!1,k.innerHTML="\u2705 Valider la commande"}},a.info("Chargement initial"),Ee()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",be):be()})());})();
