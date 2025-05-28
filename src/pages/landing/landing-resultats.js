import { useState } from "react";

function ResultatsPreinscription() {
  const [cin, setCin] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [parcours, setParcours] = useState("");
  const [mention, setMention] = useState("");
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rechercherResultat = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultat(null);

    try {
      if (!cin) throw new Error("Veuillez entrer votre numéro CIN");

      const response = await fetch(
        `http://localhost:8080/api/resultats/preinscription/${cin}?nom=${nom}&prenom=${prenom}&mention=${mention}&parcours=${parcours}`
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Erreur serveur");
      }

      const data = await response.json();
      console.log(data);

      if (
        data.length === 0
      ) {
        throw new Error(
          "Les informations ne correspondent pas à ce numéro CIN"
        );
      }

      setResultat({
        identifiant: cin,
        data,
        matricule: data.matricule || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-4xl py-2 text-center font-bold text-[#f4b400]">
        Résultats de Pré-inscription
      </h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Consultez le statut de votre pré-inscription en entrant votre numéro CIN
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={rechercherResultat}
        className="bg-white border p-6 rounded-md mb-8"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                Numéro CIN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre numéro CIN"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                Nom (optionnel)
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                Prénom (optionnel)
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre prénom"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                Mention (optionnel)
              </label>
              <select
                value={mention}
                onChange={(e) => setMention(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes mentions</option>
                <option value="Sciences et Techniques du Numérique et Physiques Appliqués (STNPA)">Sciences et Techniques du Numérique et Physiques Appliqués (STNPA)</option>
                <option value="Sciences et Technologies Industrielles (STI)">Sciences et Technologies Industrielles (STI)</option>
                <option value="Sciences et Technologies des Génies Civils (STGC)">Sciences et Technologies des Génies Civils (STGC)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                Parcours (optionnel)
              </label>
              <select
                value={parcours}
                onChange={(e) => setParcours(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous parcours</option>
                <option value="Génie Informatique">Génie Informatique</option>
                <option value="Génie Électronique">Génie Électronique</option>
                <option value="Génie Civil">Génie Civil</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Recherche en cours..." : "Rechercher"}
          </button>
        </div>
      </form>

      {/* Affichage des résultats ou messages */}
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {resultat && (
          <div className="bg-white border p-6 rounded-md shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Résultat de Pré-inscription
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Numéro CIN</p>
                <p className="text-lg font-semibold">{resultat.identifiant}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p
                  className={`text-lg font-semibold ${
                    resultat.data.status === "ACCEPTE"
                      ? "text-green-600"
                      :  resultat.data.status === "EN_ATTENTE"
                      ? "text-black-600"
                      : resultat.data.status === "REFUSE"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {resultat.data.status}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-lg font-semibold">{new Date(resultat.data.updatedAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4">
              {resultat.data.informationsPersonnelles.nom && resultat.data.informationsPersonnelles.prenom && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-base">{resultat.data.informationsPersonnelles.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prénom</p>
                    <p className="text-base">{resultat.data.informationsPersonnelles.prenom}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Mention</p>
                  <p className="text-base">{resultat.data.parcoursAcademique.mention}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Parcours</p>
                  <p className="text-base">{resultat.data.parcoursAcademique.parcours}</p>
                </div>
              </div>

              {resultat.matricule && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <p className="font-medium text-green-800">
                    Votre numéro de matricule:{" "}
                    <span className="ml-2">{resultat.matricule}</span>
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Conservez précieusement ce numéro pour vos futures démarches
                  </p>
                </div>
              )}

              {resultat.data.frais && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <p className="font-medium text-blue-800">
                    Frais d'inscription:{" "}
                    <span className="ml-2">{resultat.data.frais}</span>
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {resultat.data.message}
                  </p>
                </div>
              )}

              {resultat.data.statut === "EN_ATTENTE" && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <p className="text-yellow-800">{resultat.data.message}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message si aucun résultat n'a encore été recherché */}
        {!resultat && !error && (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Entrez votre numéro CIN pour consulter votre résultat de pré-inscription
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultatsPreinscription;