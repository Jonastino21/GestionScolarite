import React from "react";
import { Helmet } from "react-helmet-async";

const ActualitesPage = () => {
  // Données des réalisations
  const realisations = [
    {
      id: 1,
      titre: "Nouveau laboratoire de recherche",
      description:
        "Inauguration de notre nouveau laboratoire équipé des dernières technologies en génie informatique.",
      date: "15 Mars 2024",
      image:
        "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 2,
      titre: "Partenariat avec l'industrie",
      description:
        "Signature d'un partenariat stratégique avec une entreprise leader du secteur.",
      date: "2 Février 2024",
      image:
        "https://images.pexels.com/photos/8062286/pexels-photo-8062286.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  // Données des événements
  const evenements = [
    {
      id: 1,
      titre: "Journée Portes Ouvertes",
      description:
        "Découvrez nos formations et rencontrez nos enseignants lors de cette journée spéciale.",
      date: "25 Avril 2024",
      lieu: "Campus Principal",
    },
    {
      id: 2,
      titre: "Conférence sur l'IA",
      description:
        "Une conférence exceptionnelle sur les dernières avancées en intelligence artificielle.",
      date: "10 Mai 2024",
      lieu: "Amphithéâtre A",
    },
  ];

  // Actualités complémentaires
  const actualites = [
    {
      id: 1,
      titre: "Classement 2024",
      description:
        "L'ISSTM classée parmi les meilleures écoles d'ingénieurs de la région.",
      date: "5 Janvier 2024",
    },
    {
      id: 2,
      titre: "Nouvelle formation",
      description:
        "Ouverture d'une nouvelle spécialité en Cybersécurité à partir de la rentrée 2024.",
      date: "20 Mars 2024",
    },
  ];

  return (
    <>
      <Helmet>
        <title>ISSTM - Actualités</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Nos Réalisations */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800">
              Nos Réalisations
            </h2>
            <div className="ml-4 h-1 flex-1 bg-[#f4b400]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {realisations.map((realisation) => (
              <div
                key={realisation.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={realisation.image}
                  alt={realisation.titre}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-sm text-gray-500">
                    {realisation.date}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3 text-gray-800">
                    {realisation.titre}
                  </h3>
                  <p className="text-gray-600">{realisation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Nos Événements */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800">
              Nos Événements
            </h2>
            <div className="ml-4 h-1 flex-1 bg-[#f4b400]"></div>
          </div>

          <div className="space-y-6">
            {evenements.map((evenement) => (
              <div
                key={evenement.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="text-sm text-gray-500">
                      {evenement.date}
                    </span>
                    <h3 className="text-xl font-bold mt-1 mb-2 text-gray-800">
                      {evenement.titre}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {evenement.description}
                    </p>
                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      {evenement.lieu}
                    </span>
                  </div>
                  <button className="mt-4 md:mt-0 bg-[#f4b400] hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded transition duration-300">
                    S'inscrire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Actualités Complémentaires */}
        <section>
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800">
              Actualités Complémentaires
            </h2>
            <div className="ml-4 h-1 flex-1 bg-[#f4b400]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actualites.map((actualite) => (
              <div
                key={actualite.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <span className="text-sm text-gray-500">{actualite.date}</span>
                <h3 className="text-xl font-bold mt-1 mb-3 text-gray-800">
                  {actualite.titre}
                </h3>
                <p className="text-gray-600">{actualite.description}</p>
                <button className="mt-4 text-[#f4b400] hover:text-yellow-600 font-medium transition duration-300">
                  Lire plus →
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default ActualitesPage;
