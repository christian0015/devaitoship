'use client';

import Link from 'next/link';
import '@/styles/PricingSection.css';

// export default function PricingSection() {
//   return (
//     <section className="sectionPricing">
//       <h2 className="sectionPricing-title">Nos Tarifs</h2>
//       <div className="sectionPricing-plans">
//         <div className="sectionPricing-plan">
//           <h3 className="sectionPricing-planTitle">Basic</h3>
//           <p className="sectionPricing-price">19€/mois</p>
//           <ul className="sectionPricing-features">
//             <li>1 projet</li>
//             <li>Support basique</li>
//             <li>Accès limité</li>
//           </ul>
//         </div>
//         <div className="sectionPricing-plan featured">
//           <h3 className="sectionPricing-planTitle">Pro</h3>
//           <p className="sectionPricing-price">49€/mois</p>
//           <ul className="sectionPricing-features">
//             <li>10 projets</li>
//             <li>Support prioritaire</li>
//             <li>Toutes les fonctionnalités</li>
//           </ul>
//         </div>
//         <div className="sectionPricing-plan">
//           <h3 className="sectionPricing-planTitle">Entreprise</h3>
//           <p className="sectionPricing-price">Sur mesure</p>
//           <ul className="sectionPricing-features">
//             <li>Projets illimités</li>
//             <li>Support dédié</li>
//             <li>Solutions personnalisées</li>
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }

// Pricing Section Component
export default function PricingSection() {
  return (
    <div className="sectionPricing">
      <div className="pricingContainer">
        <h1>Tarification</h1>
        
        <div className="pricingGrid">
          <div className="pricingCard">
            <h3>Gratuit</h3>
            <div className="price">
              <span className="priceAmount">0€</span>
              <span className="pricePeriod">/mois</span>
            </div>
            <ul className="featuresList">
              <li>✅ Jusqu'à 100 estimations/mois</li>
              <li>✅ Support email</li>
              <li>✅ Dashboard de base</li>
              <li>❌ Analytics avancées</li>
            </ul>
            <Link href="/install" className="pricingButton">
              Commencer gratuitement
            </Link>
          </div>

          <div className="pricingCard featured">
            <div className="featuredBadge">Recommandé</div>
            <h3>Pro</h3>
            <div className="price">
              <span className="priceAmount">29€</span>
              <span className="pricePeriod">/mois</span>
            </div>
            <ul className="featuresList">
              <li>✅ Estimations illimitées</li>
              <li>✅ Support prioritaire</li>
              <li>✅ Dashboard avancé</li>
              <li>✅ Analytics détaillées</li>
              <li>✅ API personnalisée</li>
            </ul>
            <Link href="/install" className="pricingButton">
              Essayer Pro
            </Link>
          </div>

          <div className="pricingCard">
            <h3>Enterprise</h3>
            <div className="price">
              <span className="priceAmount">Sur devis</span>
            </div>
            <ul className="featuresList">
              <li>✅ Tout du plan Pro</li>
              <li>✅ Support dédié</li>
              <li>✅ Intégrations sur mesure</li>
              <li>✅ SLA garanti</li>
            </ul>
            <a href="mailto:sales@devaship.com" className="pricingButton">
              Nous contacter
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sectionPricing {
          background: var(--color-gray-light);
          min-height: 70vh;
          padding: 4rem 0;
        }

        .pricingContainer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .sectionPricing h1 {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
          text-align: center;
          margin-bottom: 3rem;
        }

        .pricingGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .pricingCard {
          background: var(--color-secondary);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          position: relative;
          border: 2px solid transparent;
          transition: transform 0.2s ease;
        }

        .pricingCard:hover {
          transform: translateY(-5px);
        }

        .pricingCard.featured {
          border-color: var(--color-accent);
          transform: scale(1.05);
        }

        .featuredBadge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-accent);
          color: var(--color-secondary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .pricingCard h3 {
          font-size: 1.5rem;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }

        .price {
          margin-bottom: 2rem;
        }

        .priceAmount {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-accent);
        }

        .pricePeriod {
          color: var(--color-gray-medium);
          font-size: 1rem;
        }

        .featuresList {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          text-align: left;
        }

        .featuresList li {
          padding: 0.5rem 0;
          color: var(--color-gray-medium);
        }

        .pricingButton {
          display: inline-block;
          background: var(--color-accent);
          color: var(--color-secondary);
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.2s ease;
          width: 100%;
        }

        .pricingButton:hover {
          background: var(--color-accent-hover);
        }

        @media (max-width: 768px) {
          .pricingCard.featured {
            transform: none;
          }
          
          .sectionPricing h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}