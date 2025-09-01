'use client';
import '@/styles/FeaturesSection.css';

// export default function FeaturesSection() {
//   return (
//     <section className="sectionFeatures">
//       <h2 className="sectionFeatures-title">Nos Fonctionnalités</h2>
//       <div className="sectionFeatures-list">
//         <div className="sectionFeatures-item">
//           <h3 className="sectionFeatures-itemTitle">Facile à utiliser</h3>
//           <p className="sectionFeatures-itemText">
//             Une interface intuitive et claire qui permet à tout le monde de créer rapidement.
//           </p>
//         </div>
//         <div className="sectionFeatures-item">
//           <h3 className="sectionFeatures-itemTitle">Rapide & Performant</h3>
//           <p className="sectionFeatures-itemText">
//             Des performances optimisées pour un rendu fluide en temps réel.
//           </p>
//         </div>
//         <div className="sectionFeatures-item">
//           <h3 className="sectionFeatures-itemTitle">Personnalisable</h3>
//           <p className="sectionFeatures-itemText">
//             Adaptez votre site selon vos besoins avec des options flexibles.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

// Features Section Component
export default function FeaturesSection() {
  return (
    <div className="sectionFeatures">
      <div className="featuresContainer">
        <h1>Fonctionnalités</h1>
        
        <div className="featuresDetail">
          <div className="featureItem">
            <div className="featureHeader">
              <h3>🔧 Installation Simplifiée</h3>
            </div>
            <p>Configuration rapide via un formulaire simple. Connectez votre boutique Devaito en quelques clics.</p>
          </div>

          <div className="featureItem">
            <div className="featureHeader">
              <h3>📊 Dashboard Marchand</h3>
            </div>
            <p>Interface d'administration complète pour gérer vos transporteurs et paramètres de livraison.</p>
          </div>

          <div className="featureItem">
            <div className="featureHeader">
              <h3>🎯 Estimations Précises</h3>
            </div>
            <p>Calculs en temps réel via l'API Chippo pour des tarifs toujours à jour.</p>
          </div>

          <div className="featureItem">
            <div className="featureHeader">
              <h3>👥 Espace Client</h3>
            </div>
            <p>Permettez à vos clients de suivre leurs commandes avec leur ID de commande.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sectionFeatures {
          background: var(--color-secondary);
          min-height: 60vh;
          padding: 4rem 0;
        }

        .featuresContainer {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .sectionFeatures h1 {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
          text-align: center;
          margin-bottom: 3rem;
        }

        .featuresDetail {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .featureItem {
          background: var(--color-gray-light);
          padding: 2rem;
          border-radius: 12px;
          border-left: 4px solid var(--color-accent);
          transition: transform 0.2s ease;
        }

        .featureItem:hover {
          transform: translateX(5px);
        }

        .featureHeader h3 {
          color: var(--color-primary);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .featureItem p {
          color: var(--color-gray-medium);
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .featuresDetail {
            grid-template-columns: 1fr;
          }
          
          .sectionFeatures h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
