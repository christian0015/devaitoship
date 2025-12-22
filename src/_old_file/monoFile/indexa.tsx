// app/page.tsx
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Estimez et Gérez Vos Coûts de Livraison Facilement</h1>
          <p className="text-xl md:text-2xl mb-8">La solution ultime pour les marchands Devaito : calcul précis, intégration simple, tracking en temps réel.</p>
          <a href="/install" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Installer Maintenant</a>
        </div>
      </section>

      {/* Fonctionnalités Principales */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Calcul des Frais de Livraison</h3>
              <p>Obtenez des estimations précises basées sur le poids, les dimensions et la destination.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Gestion des Commandes</h3>
              <p>Créez des étiquettes, suivez les livraisons et gérez les statuts en un clin d'œil.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Widgets Intégrables</h3>
              <p>Intégrez facilement nos widgets dans votre site Devaito pour une expérience fluide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à Optimiser Vos Livraisons ?</h2>
          <p className="text-xl mb-8">Installez notre application dès aujourd'hui et boostez votre e-commerce.</p>
          <a href="/install" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Commencer l'Installation</a>
        </div>
      </section>

      {/* Témoignages (si disponibles) */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ce Que Disent Nos Clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">"Une intégration parfaite avec Devaito, et des estimations ultra-précises !"</p>
              <p className="font-semibold">- Marchand A</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">"Le tracking en temps réel a révolutionné notre service client."</p>
              <p className="font-semibold">- Marchand B</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;