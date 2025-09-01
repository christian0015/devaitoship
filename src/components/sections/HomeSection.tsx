'use client';

import Link from 'next/link';
import '@/styles/home.css';

// export default function HomeSection() {
//   return (
//     <div className="sectionHome">
//       <div className="heroSection">
//         <div className="heroContent">
//           <h1>Estimations de livraison précises pour votre boutique Devaito</h1>
//           <p>Intégrez facilement des estimations de coûts de livraison en temps réel avec l'API Chippo.</p>
//           <div className="heroActions">
//             <Link href="/install" className="primaryButton">Commencer maintenant</Link>
//             <Link href="/client" className="secondaryButton">Suivre une commande</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// Home Section Component
export default function HomeSection() {
  return (
    <div className="sectionHome">
      <div className="heroSection">
        <div className="heroContent">
          <h1>Estimations de livraison précises pour votre boutique Devaito</h1>
          <p>Intégrez facilement des estimations de coûts de livraison en temps réel avec l'API Chippo. Améliorez l'expérience client et réduisez l'abandon de panier.</p>
          <div className="heroActions">
            <Link href="/install" className="primaryButton">
              Commencer maintenant
            </Link>
            <Link href="/client" className="secondaryButton">
              Suivre une commande
            </Link>
          </div>
        </div>
        <div className="heroVisual">
          <div className="mockupContainer">
            <div className="mockupScreen">
              <div className="mockupContent">
                <h3>Estimation de livraison</h3>
                <div className="shippingOption">
                  <span>Standard</span>
                  <span className="price">5.99€</span>
                </div>
                <div className="shippingOption">
                  <span>Express</span>
                  <span className="price">12.99€</span>
                </div>
                <div className="shippingOption active">
                  <span>Premium</span>
                  <span className="price">19.99€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="featuresOverview">
        <div className="container">
          <h2>Pourquoi choisir DevaShip ?</h2>
          <div className="featuresGrid">
            <div className="featureCard">
              <div className="featureIcon">🚀</div>
              <h3>Installation rapide</h3>
              <p>Configuration en moins de 5 minutes avec votre boutique Devaito</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon">💰</div>
              <h3>Estimations précises</h3>
              <p>Tarifs de livraison en temps réel via l'API Chippo</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon">📊</div>
              <h3>Dashboard complet</h3>
              <p>Suivi des commandes et analytics détaillées</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sectionHome {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }

        .heroSection {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .heroContent h1 {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0 0 1.5rem 0;
          line-height: 1.2;
        }

        .heroContent p {
          font-size: 1.2rem;
          color: var(--color-gray-medium);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .heroActions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .primaryButton {
          background: var(--color-accent);
          color: var(--color-secondary);
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }

        .primaryButton:hover {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
        }

        .secondaryButton {
          border: 2px solid var(--color-primary);
          color: var(--color-primary);
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }

        .secondaryButton:hover {
          background: var(--color-primary);
          color: var(--color-secondary);
        }

        .mockupContainer {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .mockupScreen {
          background: var(--color-secondary);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--color-border);
          width: 300px;
        }

        .mockupContent h3 {
          margin: 0 0 1.5rem 0;
          color: var(--color-primary);
          text-align: center;
        }

        .shippingOption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .shippingOption:hover,
        .shippingOption.active {
          border-color: var(--color-accent);
          background: rgba(0, 208, 132, 0.05);
        }

        .price {
          font-weight: 600;
          color: var(--color-accent);
        }

        .featuresOverview {
          background: var(--color-secondary);
          padding: 4rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .featuresOverview h2 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0 0 3rem 0;
        }

        .featuresGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .featureCard {
          text-align: center;
          padding: 2rem;
          border-radius: 12px;
          background: var(--color-gray-light);
          transition: transform 0.2s ease;
        }

        .featureCard:hover {
          transform: translateY(-5px);
        }

        .featureIcon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .featureCard h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0 0 1rem 0;
        }

        .featureCard p {
          color: var(--color-gray-medium);
          line-height: 1.6;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .heroSection {
            grid-template-columns: 1fr;
            padding: 2rem 1rem;
            text-align: center;
          }

          .heroContent h1 {
            font-size: 2rem;
          }

          .featuresOverview {
            padding: 3rem 0;
          }

          .featuresOverview h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}