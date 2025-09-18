"use strict";(()=>{typeof window.devaitoInitialized>"u"&&(window.devaitoInitialized=!0,(function(){let $={API_BASE:"http://localhost:3000/api",WAIT_COMMANDE_API:"https://devaitoship.vercel.app/api/wait-commande-validation-shipping",DEBUG:!0},o={info:(...a)=>console.log("[DEV]",...a),error:(...a)=>console.error("[DEV-ERR]",...a),debug:(...a)=>$.DEBUG&&console.log("[DEV-DBG]",...a)};o.info("Initialisation du widget");function me(){return window.location.href.includes("/admin/builder")}if(me()){o.info("Mode Builder d\xE9tect\xE9 : script du widget non ex\xE9cut\xE9.");return}if(!document.getElementById("devaito-widget-styles")){let a=document.createElement("style");a.id="devaito-widget-styles",a.textContent=`
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
      `,document.head.appendChild(a)}function fe(){let a=window.location.pathname.toLowerCase();return a.includes("/checkout")||a.includes("/cart")||a.includes("/panier")||a.includes("/product/")||a.includes("/products/")}function z(){let a=window.location.pathname.toLowerCase();return a.includes("/cart")||a.includes("/panier")||a.includes("/checkout")}function he(a){return{50:"CD",75:"FR",148:"MA"}[a]||"FR"}function se(){if(!fe()){o.info("Pas sur une page avec slug, widget non initialis\xE9");return}let a=document.getElementById("devaito-widget"),x=a?a.getAttribute("data-shop-id"):null,L=!1;if(!a){if(o.info("Aucun conteneur trouv\xE9, cr\xE9ation d'un widget flottant"),typeof window.DEVAITO_SHOP_ID<"u")x=window.DEVAITO_SHOP_ID,o.info(`ShopID r\xE9cup\xE9r\xE9 depuis window.DEVAITO_SHOP_ID: ${x}`);else{o.error("Aucun shopId trouv\xE9 pour le widget flottant");return}a=document.createElement("div"),a.id="devaito-widget-floating",a.style.cssText="position: fixed; bottom: 150px; right: 20px; z-index: 10000;",document.body.appendChild(a),L=!0}if(!a){o.error("Container non trouv\xE9");return}if(a.querySelector("#devaito-toggle")){o.info("Widget d\xE9j\xE0 initialis\xE9");return}if(!x){o.error("data-shop-id manquant");return}o.info(`Boutique: ${x}`);var u=document.createElement("div");if(u.className="devaito-card-widget",L){u.className+=" devaito-floating-widget",u.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3); transition: all 0.3s ease;";var A=document.createElement("div");A.innerHTML="\u{1F4E6}",A.style.cssText="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;",u.appendChild(A)}else u.style.cssText="background: white; width: 90%; max-width: 500px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; overflow: hidden; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;";if(!L){var X=document.createElement("div");X.style.cssText="padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb;";var S=document.createElement("label");S.className="devaito-toggle-container",S.htmlFor="devaito-toggle-checkbox",S.style.cssText="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 8px; border-radius: 8px; background: transparent;";var O=document.createElement("div");O.style.cssText="display: flex; align-items: center; gap: 12px;";var K=document.createElement("div");K.innerHTML="\u{1F4E6}",K.style.cssText="font-size: 20px;";var Q=document.createElement("div"),Z=document.createElement("div");Z.textContent="Estimation livraison",Z.style.cssText="font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";var ee=document.createElement("div");ee.textContent="Calculez vos frais de port",ee.style.cssText="font-size: 13px; color: #6b7280; margin-top: 2px;",Q.appendChild(Z),Q.appendChild(ee),O.appendChild(K),O.appendChild(Q);var j=document.createElement("div");j.style.cssText="position: relative; width: 48px; height: 24px;";var q=document.createElement("input");q.type="checkbox",q.id="devaito-toggle-checkbox",q.style.cssText="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2;";var D=document.createElement("div");D.style.cssText="width: 48px; height: 24px; background: #d1d5db; border-radius: 12px; position: relative; transition: all 0.3s ease;";var F=document.createElement("div");F.style.cssText="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);",D.appendChild(F),j.appendChild(q),j.appendChild(D),S.appendChild(O),S.appendChild(j),X.appendChild(S),u.appendChild(X)}var p=document.createElement("div");p.id="devaito-content",p.style.cssText="display: none; padding: 24px; background: white;";let le=z();var _=document.createElement("div");_.style.cssText=le?"display: none;":"margin-bottom: 20px;";var H=document.createElement("h4");H.textContent="Adresse de livraison",H.style.cssText="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; display: flex; align-items: center;";var N=document.createElement("span");N.id="devaito-form-status",N.className="devaito-form-status invalid",N.textContent=le?"Utilisation du formulaire de la page":"Veuillez remplir le formulaire d'adresse",N.style.cssText="font-size: 12px; margin-left: 10px;",H.appendChild(N);var B=document.createElement("div");B.className="devaito-grid-responsive",B.style.cssText="display: flex; flex-direction: column; gap: 12px;";var ge=[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"city",placeholder:"Ville",type:"text",autocomplete:"address-level2"},{name:"state",placeholder:"R\xE9gion",type:"text",autocomplete:"address-level1"},{name:"zip",placeholder:"Code postal",type:"text",autocomplete:"postal-code"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}],c=[];ge.forEach(function(e){var t=document.createElement("input");t.type=e.type,t.placeholder=e.placeholder,t.name=e.name,t.autocomplete=e.autocomplete,t.className="devaito-input-field",t.style.cssText="width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; color: #1f2937; box-sizing: border-box;",B.appendChild(t),c.push(t)}),_.appendChild(H),_.appendChild(B);var V=document.createElement("div");V.style.cssText="margin-bottom: 20px;";var te=document.createElement("h4");te.textContent="Produits",te.style.cssText="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";var I=document.createElement("div");I.id="devaito-products",I.style.cssText="margin-bottom: 20px;",V.appendChild(te),V.appendChild(I);var s=document.createElement("button");s.id="devaito-estimate",s.className="devaito-btn-primary",s.innerHTML="\u2728 Estimer les frais de port",s.style.cssText="width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;";var g=document.createElement("div");g.id="devaito-error",g.style.cssText="color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;";var v=document.createElement("div");v.id="devaito-results",v.style.cssText="margin-top: 20px;";var M=document.createElement("div");M.id="devaito-total",M.className="devaito-total-price",M.style.cssText="display: none;";var m=document.createElement("button");if(m.id="devaito-validate",m.className="devaito-validate-btn",m.innerHTML="\u2705 Valider la commande",m.style.cssText="display: none;",p.appendChild(_),p.appendChild(V),p.appendChild(s),p.appendChild(g),p.appendChild(v),p.appendChild(M),p.appendChild(m),L){var y=document.createElement("div");y.className="devaito-floating-content",y.style.cssText="overflow-y: auto; height: calc(80vh - 60px); display: none; flex-direction: column;";var b=document.createElement("div");b.className="devaito-floating-header",b.style.cssText="padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb; display: none;";var ie=document.createElement("div");ie.className="devaito-floating-title",ie.textContent="Estimation livraison";var R=document.createElement("button");R.className="devaito-close-btn",R.innerHTML="\xD7",b.appendChild(ie),b.appendChild(R),y.appendChild(b),y.appendChild(p),u.appendChild(y),R.addEventListener("click",function(e){e.stopPropagation(),y.style.display="none",b.style.display="none",A.style.display="flex",u.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);"}),u.addEventListener("click",function(e){(e.target===u||e.target===A)&&(A.style.display="none",b.style.display="flex",y.style.display="block",p.style.display="block",u.style.cssText="background: white; width: 90%; max-width: 500px; height: auto; max-height: 80vh; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: fixed; top: 150px; right: 20px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.15);")})}else{u.appendChild(p);var q=document.getElementById("devaito-toggle-checkbox");q.onchange=function(){this.checked?(p.style.display="block",D.style.background="#00d084",F.style.transform="translateX(24px)",o.debug("Widget activ\xE9")):(p.style.display="block",D.style.background="#d1d5db",F.style.transform="translateX(0)",o.debug("Widget d\xE9sactiv\xE9"))}}a.appendChild(u);var E=[],w={};function ce(){let e={},t={name:"#fullname",email:"#email",phone:"#phone",street:"#address",zip:"#postal-code",city:"#city",state:"#state",country:"#country"};return Object.keys(t).forEach(n=>{let i=document.querySelector(t[n]);i&&(e[n]=i.value)}),e}function ne(){if(!z())return;let e=ce(),t={name:0,street:1,city:2,state:3,zip:4,phone:5,email:6};Object.keys(t).forEach(n=>{let i=t[n];e[n]&&c[i]&&(c[i].value=e[n])}),U()}function U(){let e=ve(),t=document.getElementById("devaito-form-status");if(z()){if(t.textContent="Utilisation du formulaire de la page",t.className="devaito-form-status valid",!t.querySelector(".devaito-checkmark")){let n=document.createElement("span");n.className="devaito-checkmark",n.innerHTML=" \u2713",t.appendChild(n)}}else if(e){if(t.textContent="Formulaire compl\xE9t\xE9",t.className="devaito-form-status valid",!t.querySelector(".devaito-checkmark")){let n=document.createElement("span");n.className="devaito-checkmark",n.innerHTML=" \u2713",t.appendChild(n)}}else{t.textContent="Veuillez remplir le formulaire d'adresse",t.className="devaito-form-status invalid";let n=t.querySelector(".devaito-checkmark");n&&t.removeChild(n)}}U(),c.forEach(e=>{e.addEventListener("input",U),e.addEventListener("change",U)}),z()&&(["#fullname","#email","#phone","#address","#postal-code","#country","#state","#city"].forEach(t=>{let n=document.querySelector(t);n&&(n.addEventListener("input",ne),n.addEventListener("change",ne))}),ne());function ve(){return[c[0],c[1],c[2],c[4],c[6]].every(t=>t.value.trim()!=="")}function xe(){var e=window.location.pathname.toLowerCase();o.info(`Page: ${e}`);var t=[];if(e.includes("/product/")||e.includes("/products/")){let n=e.split("/product/")[1]?.split("/")[0]||e.split("/products/")[1]?.split("/")[0];if(n){let i=document.querySelector("h1.product-title, h1.product-name"),d=document.querySelector('input[type="number"].quantity-input'),l=i?i.textContent.trim():"Produit",f=d&&parseInt(d.value)||1;t.push({slug:n,name:l,quantity:f}),o.info(`Page produit, slug: ${n}, nom: ${l}, quantit\xE9: ${f}`)}}else if(z()){let n=JSON.parse(localStorage.getItem("cartItems")||localStorage.getItem("checkoutItemsValide")||"[]");n.length>0?(n.forEach(i=>{t.push({id:i.id,name:i.name,quantity:i.quantity,permalink:i.permalink})}),o.info(`${t.length} produits r\xE9cup\xE9r\xE9s depuis le localStorage`)):document.querySelectorAll(".cart-item, .product-item, .order-item").forEach(function(i){let d=i.querySelector(".product-name, .item-name"),l=i.querySelector('input[type="number"]'),f=i.getAttribute("data-product-id")||i.getAttribute("data-id");if(d){let h=d.textContent.trim(),r=l&&parseInt(l.value)||1;t.push({id:f,name:h,quantity:r}),o.debug(`Produit panier: ${h}, quantit\xE9: ${r}`)}})}return t.length===0&&(o.info("Aucun produit d\xE9tect\xE9, utilisation du produit de d\xE9mo"),t=[{name:"Product Demo",quantity:1}]),o.info(`${t.length} produits d\xE9tect\xE9s`),t}async function pe(){try{var e=xe();o.info(`Envoi requ\xEAte avec ${e.length} produits`);var t=await fetch($.API_BASE+"/get_shop_data_v2",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shopId:x,products:e,slugs:e.filter(i=>i.slug).map(i=>i.slug),productIds:e.filter(i=>i.id).map(i=>i.id)})});if(!t.ok)throw new Error(`Erreur API: ${t.status}`);var n=await t.json();o.info("R\xE9ponse API re\xE7ue"),console.log("Products: ",n.products),console.log("Products: ",n.shop),E=n.products.map(function(i,d){console.log(i);let l=i.shippingAddress||n.shop.address||{name:n.shop.name,street1:"123 Default Street",city:"Paris",state:"IDF",zip:"75001",country:"FR"};return console.log(i.shippingAddress),console.log(i),{id:d,name:i.name,quantity:e[d]?e[d].quantity:1,dimensions:i.dimensions,fromAddress:l}}),I.innerHTML="",E.length===0?(o.info("Aucun produit dans la r\xE9ponse"),I.innerHTML="<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible"):(o.info(`${E.length} produits charg\xE9s`),E.forEach(function(i){var d=document.createElement("div");d.className="devaito-product-item";var l=document.createElement("div");l.className="devaito-product-info";var f=document.createElement("div");f.className="devaito-product-name",f.textContent=i.name;var h=document.createElement("div");h.className="devaito-product-details",h.textContent=`${i.dimensions.length}\xD7${i.dimensions.width}\xD7${i.dimensions.height}cm, ${i.quantity} unit\xE9(s)`,l.appendChild(f),l.appendChild(h);var r=document.createElement("div");r.className="devaito-product-quantity",r.textContent=i.quantity,r.readOnly=!0,d.appendChild(l),d.appendChild(r),I.appendChild(d)}))}catch(i){C("Erreur de chargement des produits"),o.error("Erreur fetchShopData",i.message)}}function W(){if(z()){let e=ce();return{name:e.name||"",street1:e.street||"",city:e.city||"",state:e.state||"",zip:e.zip||"",phone:e.phone||"",email:e.email||"",country:he(e.country)}}else return{name:c[0].value||"",street1:c[1].value||"",city:c[2].value||"",state:c[3].value||"",zip:c[4].value||"",phone:c[5].value||"",email:c[6].value||"",country:"FR"}}function ye(){var e={};E.forEach(function(n){if(!n.fromAddress){o.error("Adresse d'exp\xE9dition manquante pour le produit",n);return}var i=JSON.stringify(n.fromAddress);e[i]||(e[i]={from:n.fromAddress,parcels:[]});for(let d=0;d<n.quantity;d++){let l={length:n.dimensions.length,width:n.dimensions.width,height:n.dimensions.height,distance_unit:n.dimensions.distance_unit||"cm",weight:n.dimensions.weight,mass_unit:n.dimensions.mass_unit||"kg"};e[i].parcels.push(l)}});var t=[];return Object.keys(e).forEach(function(n){t.push({from:e[n].from,to:W(),parcels:e[n].parcels})}),o.info(`${t.length} groupes d'exp\xE9dition pr\xE9par\xE9s`),t}function C(e){g.textContent=e,g.style.display="block"}function be(){g.style.display="none"}function ue(){let e=0;Object.keys(w).forEach(i=>{e+=parseFloat(w[i].price)||0});let t=document.getElementById("devaito-total");t.textContent=`Total estimation: ${e.toFixed(2)} EUR`,t.style.display="block";let n=document.getElementById("devaito-validate");return n.style.display=Object.keys(w).length>0?"block":"none",e}s.onclick=async function(){be(),v.innerHTML="",M.style.display="none",m.style.display="none",w={};var e=s.innerHTML;s.innerHTML="\u23F3 Calcul en cours...",s.disabled=!0,s.style.background="#9ca3af",o.info("D\xE9but estimation");var t=W();if(o.debug("Adresse",t),!t.street1||!t.city||!t.zip||!t.email){C("\u26A0\uFE0F Veuillez compl\xE9ter tous les champs obligatoires"),s.innerHTML=e,s.disabled=!1,s.style.background="#00d084",o.info("Champs incomplets");return}if(await pe(),!E.length){C("\u274C Aucun produit disponible pour l'estimation"),s.innerHTML=e,s.disabled=!1,s.style.background="#00d084",o.info("Aucun produit");return}var n=ye();o.debug("Requ\xEAtes pr\xE9par\xE9es");try{var i=[];for(var d of n){o.info(`Envoi requ\xEAte pour ${d.parcels.length} colis`);var l=await fetch($.API_BASE+"/getRates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!l.ok)throw new Error(`Erreur: ${l.status}`);var f=await l.json();o.info(`${f.length} options re\xE7ues`),i.push(...f)}if(v.innerHTML="",i.length===0)v.innerHTML="<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>\u{1F4ED} Aucune option de livraison disponible",o.info("Aucune option de livraison");else{var h=document.createElement("h4");h.textContent="Options de livraison",h.style.cssText="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #374151;",v.appendChild(h),i.sort((r,P)=>parseFloat(r.price)-parseFloat(P.price)),i.forEach(function(r,P){var k=document.createElement("div");k.className="devaito-rate-card",k.dataset.rateId=P,k.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb;";var G=document.createElement("div");G.style.cssText="display: flex; align-items: center; gap: 12px; flex: 1;";var T=document.createElement("img");r.img?(T.src=r.img,T.alt=r.carrier,T.style.cssText="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;"):(T=document.createElement("div"),T.textContent="\u{1F69A}",T.style.cssText="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;");var J=document.createElement("div");J.style.cssText="flex: 1;";var oe=document.createElement("div");oe.textContent=`${r.carrier} - ${r.service}`,oe.style.cssText="font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;";var ae=document.createElement("div");r.estimated_days&&(ae.textContent=`Livraison estim\xE9e: ${r.estimated_days} jour${r.estimated_days>1?"s":""}`,ae.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;"),J.appendChild(oe),r.estimated_days&&J.appendChild(ae);var Y=document.createElement("div");Y.style.cssText="text-align: right;";var re=document.createElement("div");re.textContent=`${r.price} ${r.currency}`,re.style.cssText="font-weight: 700; font-size: 16px; color: #00d084;";var de=document.createElement("div");P===0&&(de.textContent="Le moins cher",de.style.cssText="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;"),Y.appendChild(re),P===0&&Y.appendChild(de),G.appendChild(T),G.appendChild(J),k.appendChild(G),k.appendChild(Y),k.addEventListener("click",function(){document.querySelectorAll(".devaito-rate-card").forEach(Ee=>{Ee.classList.remove("selected")}),this.classList.add("selected"),w[0]=r,ue()}),v.appendChild(k)}),o.info(`${i.length} options affich\xE9es`)}}catch(r){C("\u274C Erreur lors de l'estimation des frais de port"),o.error("Erreur estimation",r.message)}finally{s.innerHTML=e,s.disabled=!1,s.style.background="#00d084"}},m.onclick=async function(){if(Object.keys(w).length===0){C("Veuillez s\xE9lectionner une option de livraison");return}m.disabled=!0,m.innerHTML="\u23F3 Traitement...";try{let e={shopId:x,shopUrl:window.location.origin,customerEmail:W().email,products:E.map(i=>({name:i.name,quantity:i.quantity,dimensions:i.dimensions})),shippingOptions:w,totalPrice:ue(),shippingAddress:W()};o.info("Envoi des donn\xE9es de commande \xE0 l'API");let t=await fetch($.WAIT_COMMANDE_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error("Erreur lors de l'envoi des donn\xE9es");let n=await t.json();o.info("Commande enregistr\xE9e avec succ\xE8s",n),C("\u2705 Commande enregistr\xE9e avec succ\xE8s! Vous allez \xEAtre redirig\xE9."),g.style.color="#059669",g.style.background="#f0fdf4",g.style.borderColor="#bbf7d0",setTimeout(()=>{},2e3)}catch(e){C("\u274C Erreur lors de l'enregistrement de la commande"),o.error("Erreur validation",e.message)}finally{m.disabled=!1,m.innerHTML="\u2705 Valider la commande"}},o.info("Chargement initial"),pe()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",se):se()})());})();
