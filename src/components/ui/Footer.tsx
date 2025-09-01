'use client';

import Link from 'next/link';

interface Props {
  onChange: (section: string) => void;
}

export default function Footer({ onChange }: Props) {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="footerSection">
          <h4>DevaShip</h4>
          <p>Solution d'estimation des coûts de livraison pour les marchands Devaito</p>
        </div>

        <div className="footerSection">
          <h5>Liens utiles</h5>
          <ul>
            <li><a onClick={() => onChange('about')}>À propos</a></li>
            <li><a onClick={() => onChange('features')}>Fonctionnalités</a></li>
            <li><Link href="/client">Suivi de commande</Link></li>
          </ul>
        </div>

        <div className="footerSection">
          <h5>Support</h5>
          <ul>
            <li><a href="mailto:support@devaship.com">Contact</a></li>
            <li><a>Documentation</a></li>
            <li><a>FAQ</a></li>
          </ul>
        </div>

        <div className="footerSection">
          <h5>Partenaires</h5>
          <ul>
            <li>Chippo API</li>
            <li>Devaito Platform</li>
          </ul>
        </div>
      </div>

      <div className="footerBottom">
        <p>&copy; 2025 DevaShip. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
