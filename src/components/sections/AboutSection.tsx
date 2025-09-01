// export default function AboutSection() {
//   return (
//     <section id="about" className="py-16 text-center">
//       <h2 className="text-3xl font-bold">À propos</h2>
//       <p className="mt-4 text-gray-600">
//         Ici tu racontes l’histoire du produit ou du service.
//       </p>
//     </section>
//   );
// }


// About Section Component
export default function AboutSection() {
  return (
    <div className="sectionAbout">
      <div className="aboutContainer">
        <h1>À propos de DevaShip</h1>
        
        <div className="aboutContent">
          <div className="storySection">
            <h2>Notre Mission</h2>
            <p>DevaShip a été créé pour répondre aux besoins spécifiques des marchands utilisant la plateforme Devaito. Nous comprenons les défis liés à l'estimation précise des coûts de livraison et nous nous engageons à fournir une solution simple, fiable et efficace.</p>
          </div>

          <div className="teamSection">
            <h2>Notre Équipe</h2>
            <p>Développeurs passionnés par l'e-commerce et l'innovation, nous travaillons constamment à améliorer l'expérience des marchands et de leurs clients.</p>
          </div>

          <div className="partnersSection">
            <h2>Nos Partenaires</h2>
            <div className="partnersGrid">
              <div className="partnerCard">
                <h3>Chippo</h3>
                <p>Notre partenaire API principal pour les estimations de livraison en temps réel</p>
              </div>
              <div className="partnerCard">
                <h3>Devaito</h3>
                <p>Plateforme e-commerce innovante que nous supportons</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sectionAbout {
          background: var(--color-gray-light);
          min-height: 60vh;
          padding: 4rem 0;
        }

        .aboutContainer {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .sectionAbout h1 {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
          text-align: center;
          margin-bottom: 3rem;
        }

        .aboutContent {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .storySection,
        .teamSection {
          background: var(--color-secondary);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .storySection h2,
        .teamSection h2,
        .partnersSection h2 {
          color: var(--color-primary);
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .storySection p,
        .teamSection p {
          color: var(--color-gray-medium);
          line-height: 1.6;
          font-size: 1.1rem;
        }

        .partnersGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .partnerCard {
          background: var(--color-secondary);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .partnerCard h3 {
          color: var(--color-accent);
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .partnerCard p {
          color: var(--color-gray-medium);
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .sectionAbout h1 {
            font-size: 2rem;
          }
          
          .aboutContainer {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}
