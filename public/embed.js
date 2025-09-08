"use strict";(()=>{typeof window.devaitoInitialized>"u"&&(window.devaitoInitialized=!0,(function(){let B={API_BASE:"https://devaitoship.vercel.app/api",DEBUG:!0},t={info:(...n)=>console.log("[DEV]",...n),error:(...n)=>console.error("[DEV-ERR]",...n),debug:(...n)=>B.DEBUG&&console.log("[DEV-DBG]",...n)};t.info("Initialisation du widget");function ne(){return window.location.href.includes("/admin/builder")}if(ne()){t.info("Mode Builder d\xE9tect\xE9 : script du widget non ex\xE9cut\xE9.");return}if(!document.getElementById("devaito-widget-styles")){let n=document.createElement("style");n.id="devaito-widget-styles",n.textContent=`
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
        }
        .devaito-rate-card:hover { 
          border-color: #00d084 !important; 
          transform: translateY(-2px); 
          box-shadow: 0 4px 15px rgba(0,208,132,0.1); 
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
        
        @media (min-width: 550px) {
          .devaito-grid-responsive {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `,document.head.appendChild(n)}function oe(){let n=window.location.pathname.toLowerCase();return n.includes("/checkout")||n.includes("/cart")||n.includes("/panier")||n.includes("/product/")||n.includes("/products/")}function ee(){if(!oe()){t.info("Pas sur une page avec slug, widget non initialis\xE9");return}let n=document.getElementById("devaito-widget"),z=n?n.getAttribute("data-shop-id"):null,A=!1;if(!n){if(t.info("Aucun conteneur trouv\xE9, cr\xE9ation d'un widget flottant"),typeof window.DEVAITO_SHOP_ID<"u")z=window.DEVAITO_SHOP_ID,t.info(`ShopID r\xE9cup\xE9r\xE9 depuis window.DEVAITO_SHOP_ID: ${z}`);else{t.error("Aucun shopId trouv\xE9 pour le widget flottant");return}n=document.createElement("div"),n.id="devaito-widget-floating",n.style.cssText="position: fixed; bottom: 150px; right: 20px; z-index: 10000;",document.body.appendChild(n),A=!0}if(!n){t.error("Container non trouv\xE9");return}if(n.querySelector("#devaito-toggle")){t.info("Widget d\xE9j\xE0 initialis\xE9");return}if(!z){t.error("data-shop-id manquant");return}t.info(`Boutique: ${z}`);var u=document.createElement("div");if(u.className="devaito-card-widget",A){u.className+=" devaito-floating-widget",u.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3); transition: all 0.3s ease;";var w=document.createElement("div");w.innerHTML="\u{1F4E6}",w.style.cssText="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;",u.appendChild(w)}else u.style.cssText="background: white; width: 90%; max-width: 500px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; overflow: hidden; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;";if(!A){var F=document.createElement("div");F.style.cssText="padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb;";var E=document.createElement("label");E.className="devaito-toggle-container",E.htmlFor="devaito-toggle-checkbox",E.style.cssText="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 8px; border-radius: 8px; background: transparent;";var $=document.createElement("div");$.style.cssText="display: flex; align-items: center; gap: 12px;";var V=document.createElement("div");V.innerHTML="\u{1F4E6}",V.style.cssText="font-size: 20px;";var G=document.createElement("div"),R=document.createElement("div");R.textContent="Estimation livraison",R.style.cssText="font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.2;";var J=document.createElement("div");J.textContent="Calculez vos frais de port",J.style.cssText="font-size: 13px; color: #6b7280; margin-top: 2px;",G.appendChild(R),G.appendChild(J),$.appendChild(V),$.appendChild(G);var I=document.createElement("div");I.style.cssText="position: relative; width: 48px; height: 24px;";var C=document.createElement("input");C.type="checkbox",C.id="devaito-toggle-checkbox",C.style.cssText="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2;";var S=document.createElement("div");S.style.cssText="width: 48px; height: 24px; background: #d1d5db; border-radius: 12px; position: relative; transition: all 0.3s ease;";var D=document.createElement("div");D.style.cssText="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);",S.appendChild(D),I.appendChild(C),I.appendChild(S),E.appendChild($),E.appendChild(I),F.appendChild(E),u.appendChild(F)}var m=document.createElement("div");m.id="devaito-content",m.style.cssText="display: none; padding: 24px; background: white;";var j=document.createElement("div");j.style.cssText="margin-bottom: 20px;";var U=document.createElement("h4");U.textContent="Produits",U.style.cssText="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;";var T=document.createElement("div");T.id="devaito-products",T.style.cssText="margin-bottom: 20px;",j.appendChild(U),j.appendChild(T);var P=document.createElement("div");P.style.cssText="margin-bottom: 20px;";var W=document.createElement("h4");W.textContent="Adresse de livraison",W.style.cssText="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151;";var M=document.createElement("div");M.className="devaito-grid-responsive",M.style.cssText="display: flex; flex-direction: column; gap: 12px;";var ae=[{name:"name",placeholder:"Nom complet",type:"text",autocomplete:"name"},{name:"street",placeholder:"Adresse",type:"text",autocomplete:"street-address"},{name:"city",placeholder:"Ville",type:"text",autocomplete:"address-level2"},{name:"state",placeholder:"R\xE9gion",type:"text",autocomplete:"address-level1"},{name:"zip",placeholder:"Code postal",type:"text",autocomplete:"postal-code"},{name:"phone",placeholder:"T\xE9l\xE9phone",type:"tel",autocomplete:"tel"},{name:"email",placeholder:"Email",type:"email",autocomplete:"email"}],x=[];ae.forEach(function(e){var i=document.createElement("input");i.type=e.type,i.placeholder=e.placeholder,i.name=e.name,i.autocomplete=e.autocomplete,i.className="devaito-input-field",i.style.cssText="width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; color: #1f2937; box-sizing: border-box;",e.name==="name"&&(i.value="Jean Dupont"),e.name==="street"&&(i.value="123 Rue de la Paix"),e.name==="city"&&(i.value="Paris"),e.name==="state"&&(i.value="\xCEle-de-France"),e.name==="zip"&&(i.value="75001"),e.name==="phone"&&(i.value="+33 1 23 45 67 89"),e.name==="email"&&(i.value="jean.dupont@exemple.com"),M.appendChild(i),x.push(i)}),P.appendChild(W),P.appendChild(M);var r=document.createElement("button");r.id="devaito-estimate",r.className="devaito-btn-primary",r.innerHTML="\u2728 Estimer les frais de port",r.style.cssText="width: 100%; padding: 14px 20px; border-radius: 10px; border: none; background: #00d084; color: white; font-weight: 600; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;";var k=document.createElement("div");k.id="devaito-error",k.style.cssText="color: #dc2626; margin-top: 12px; font-size: 14px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; display: none;";var h=document.createElement("div");if(h.id="devaito-results",h.style.cssText="margin-top: 20px;",m.appendChild(j),m.appendChild(P),m.appendChild(r),m.appendChild(k),m.appendChild(h),A){var g=document.createElement("div");g.className="devaito-floating-content",g.style.cssText="overflow-y: auto; height: calc(80vh - 60px); display: none; flex-direction: column;";var v=document.createElement("div");v.className="devaito-floating-header",v.style.cssText="padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; display: none;";var Q=document.createElement("div");Q.className="devaito-floating-title",Q.textContent="Estimation livraison";var N=document.createElement("button");N.className="devaito-close-btn",N.innerHTML="\xD7",v.appendChild(Q),v.appendChild(N),g.appendChild(v),g.appendChild(m),u.appendChild(g),N.addEventListener("click",function(e){e.stopPropagation(),g.style.display="none",v.style.display="none",w.style.display="flex",u.style.cssText="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);"}),u.addEventListener("click",function(e){(e.target===u||e.target===w)&&(w.style.display="none",v.style.display="flex",g.style.display="block",m.style.display="block",u.style.cssText="background: white; width: 90%; max-width: 500px; height: auto; max-height: 80vh; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: fixed; top: 150px; right: 20px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.15);")})}else{u.appendChild(m);var C=document.getElementById("devaito-toggle-checkbox");C.onchange=function(){this.checked?(m.style.display="block",S.style.background="#00d084",D.style.transform="translateX(24px)",t.debug("Widget activ\xE9")):(m.style.display="block",S.style.background="#d1d5db",D.style.transform="translateX(0)",t.debug("Widget d\xE9sactiv\xE9"))}}n.appendChild(u);var y=[];function re(){var e=window.location.pathname.toLowerCase();if(t.info(`Page: ${e}`),e.includes("/checkout")){let f=function(d){return d.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+|-+$/g,"")};var o=f;t.info("Page checkout d\xE9tect\xE9e");var i=[];return document.querySelectorAll(".order-item .item-name").forEach(d=>{if(d){let l=d.textContent.trim(),p=f(l);p="products"+p,p&&i.indexOf(p)===-1&&(i.push(p),t.debug(`Slug checkout d\xE9tect\xE9: ${p}`))}}),t.info(`Slugs checkout trouv\xE9s: ${i.length}`),i}if(e.includes("/cart")||e.includes("/panier")){t.info("Page panier d\xE9tect\xE9e");var i=[];return document.querySelectorAll('a[href*="/product/"], a[href*="/products/"], [data-product-slug]').forEach(function(d){var l=d.href&&d.href.split("/product/")[1]?.split("/")[0]||d.href&&d.href.split("/products/")[1]?.split("/")[0]||d.getAttribute("data-product-slug");l&&i.indexOf(l)===-1&&(i.push(l),t.debug(`Slug: ${l}`))}),t.info(`Slugs trouv\xE9s: ${i.length}`),i}var s=e.split("/product/")[1]?.split("/")[0]||e.split("/products/")[1]?.split("/")[0];return s?t.info(`Page produit, slug: ${s}`):t.info("Aucun slug d\xE9tect\xE9"),s?[s]:[]}async function te(){try{var e=re();e.length||(e=["product-demo"],t.info("Utilisation du slug de d\xE9mo")),t.info(`Envoi requ\xEAte avec ${e.length} slugs`);var i=await fetch(B.API_BASE+"/get_shop_by_id",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shopId:z,slugs:e})});if(!i.ok)throw new Error(`Erreur API: ${i.status}`);var s=await i.json();t.info("R\xE9ponse API re\xE7ue"),y=s.products.map(function(o){return{name:o.name,quantity:o.quantity||1,maxQuantity:o.quantity||99,dimensions:o.dimensions,fromAddress:o.shippingAddress}}),T.innerHTML="",y.length===0?(t.info("Aucun produit dans la r\xE9ponse"),T.innerHTML="<p style='color:#9ca3af; text-align:center; padding:12px;'>Aucun produit disponible"):(t.info(`${y.length} produits charg\xE9s`),y.forEach(function(o,f){var d=document.createElement("div");d.style.cssText="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;";var l=document.createElement("div");l.style.cssText="flex-grow: 1; margin-right: 12px;";var p=document.createElement("div");p.textContent=o.name,p.style.cssText="font-weight: 500; color: #374151; font-size: 14px;";var a=document.createElement("div");a.textContent=`${o.dimensions.length}\xD7${o.dimensions.width}\xD7${o.dimensions.height}cm`,a.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;",l.appendChild(p),l.appendChild(a);var c=document.createElement("input");c.type="number",c.value=o.quantity,c.min=1,c.max=o.maxQuantity,c.dataset.index=f,c.style.cssText="width: 60px; padding: 8px; border: 1.5px solid #d1d5db; color: #1f2937; border-radius: 6px; text-align: center; font-size: 14px;",d.appendChild(l),d.appendChild(c),T.appendChild(d)}))}catch(o){q("Erreur de chargement des produits"),t.error("Erreur fetchShopData",o.message)}}function ie(){return{name:x[0].value||"",street1:x[1].value||"",city:x[2].value||"",state:x[3].value||"",zip:x[4].value||"",phone:x[5].value||"",email:x[6].value||"",country:"France"}}function de(){var e={};y.forEach(function(s){var o=JSON.stringify(s.fromAddress);e[o]||(e[o]={from:s.fromAddress,parcels:[]});for(var f=0;f<s.quantity;f++)e[o].parcels.push(s.dimensions)});var i=[];return Object.keys(e).forEach(function(s){i.push({from:e[s].from,to:ie(),parcels:e[s].parcels})}),t.info(`${i.length} groupes d'exp\xE9dition pr\xE9par\xE9s`),i}function q(e){k.textContent=e,k.style.display="block"}function se(){k.style.display="none"}r.onclick=async function(){se(),h.innerHTML="";var e=r.innerHTML;r.innerHTML="\u23F3 Calcul en cours...",r.disabled=!0,r.style.background="#9ca3af",t.info("D\xE9but estimation"),m.querySelectorAll("input[type=number]").forEach(function(a){var c=parseInt(a.dataset.index);y[c].quantity=Math.max(1,parseInt(a.value)||1)});var i=ie();if(t.debug("Adresse",i),!i.street1||!i.city||!i.zip||!i.email){q("\u26A0\uFE0F Veuillez compl\xE9ter tous les champs obligatoires"),r.innerHTML=e,r.disabled=!1,r.style.background="#00d084",t.info("Champs incomplets");return}if(await te(),!y.length){q("\u274C Aucun produit disponible pour l'estimation"),r.innerHTML=e,r.disabled=!1,r.style.background="#00d084",t.info("Aucun produit");return}var s=de();t.debug("Requ\xEAtes pr\xE9par\xE9es");try{var o=[];for(var f of s){t.info(`Envoi requ\xEAte pour ${f.parcels.length} colis`);var d=await fetch(B.API_BASE+"/getRates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});if(!d.ok)throw new Error(`Erreur: ${d.status}`);var l=await d.json();t.info(`${l.length} options re\xE7ues`),o.push(...l)}if(h.innerHTML="",o.length===0)h.innerHTML="<div style='text-align:center; color:#6b7280; padding:20px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;'>\u{1F4ED} Aucune option de livraison disponible",t.info("Aucune option de livraison");else{var p=document.createElement("h4");p.textContent="Options de livraison",p.style.cssText="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #374151;",h.appendChild(p),o.sort((a,c)=>parseFloat(a.price)-parseFloat(c.price)),o.forEach(function(a,c){var L=document.createElement("div");L.className="devaito-rate-card",L.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 16px; margin-bottom: 12px; background: white; border-radius: 10px; border: 1.5px solid #e5e7eb; cursor: pointer;";var O=document.createElement("div");O.style.cssText="display: flex; align-items: center; gap: 12px; flex: 1;";var b=document.createElement("img");a.img?(b.src=a.img,b.alt=a.carrier,b.style.cssText="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #f9fafb;"):(b=document.createElement("div"),b.textContent="\u{1F69A}",b.style.cssText="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 6px; font-size: 20px;");var _=document.createElement("div");_.style.cssText="flex: 1;";var X=document.createElement("div");X.textContent=`${a.carrier} - ${a.service}`,X.style.cssText="font-weight: 600; color: #374151; font-size: 14px; line-height: 1.3;";var Y=document.createElement("div");a.estimated_days&&(Y.textContent=`Livraison estim\xE9e: ${a.estimated_days} jour${a.estimated_days>1?"s":""}`,Y.style.cssText="font-size: 12px; color: #6b7280; margin-top: 2px;"),_.appendChild(X),a.estimated_days&&_.appendChild(Y);var H=document.createElement("div");H.style.cssText="text-align: right;";var K=document.createElement("div");K.textContent=`${a.price} ${a.currency}`,K.style.cssText="font-weight: 700; font-size: 16px; color: #00d084;";var Z=document.createElement("div");c===0&&(Z.textContent="Le moins cher",Z.style.cssText="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 12px; margin-top: 4px; display: inline-block;"),H.appendChild(K),c===0&&H.appendChild(Z),O.appendChild(b),O.appendChild(_),L.appendChild(O),L.appendChild(H),h.appendChild(L)}),t.info(`${o.length} options affich\xE9es`)}}catch(a){q("\u274C Erreur lors de l'estimation des frais de port"),t.error("Erreur estimation",a.message)}finally{r.innerHTML=e,r.disabled=!1,r.style.background="#00d084"}},t.info("Chargement initial"),te()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ee):ee()})());})();
