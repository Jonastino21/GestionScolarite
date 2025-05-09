import { useState, useEffect } from "react";

function ResultatsPage() {
  const [typeRecherche, setTypeRecherche] = useState("preinscription");
  const [cin, setCin] = useState("");
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [parcours, setParcours] = useState("");
  const [mention, setMention] = useState("");
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Réinitialiser les résultats quand on change d'onglet
  useEffect(() => {
    setResultat(null);
    setError("");
    // Réinitialiser aussi les champs de recherche si nécessaire
    setCin("");
    setMatricule("");
    setNom("");
    setPrenom("");
  }, [typeRecherche]);

  // Données simulées pour les résultats
  const rechercherResultat = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultat(null);
  
    try {
      if (typeRecherche === "preinscription") {
        if (!cin) throw new Error("Veuillez entrer votre numéro CIN");
  
        const response = await fetch(
          `http://localhost:8080/api/resultats/preinscription/${cin}`
        );
  
        if (!response.ok) {
          const msg = await response.text();
          throw new Error(msg || "Erreur serveur");
        }
  
        const data = await response.json();
  
        // Vérifie les noms si fournis
        if (
          (nom && data.nom.toLowerCase() !== nom.toLowerCase()) ||
          (prenom && data.prenom.toLowerCase() !== prenom.toLowerCase())
        ) {
          throw new Error("Les informations ne correspondent pas à ce numéro CIN");
        }
  
        setResultat({
          type: "preinscription",
          identifiant: cin,
          data,
          matricule: data.matricule || null,
        });
      } else {
        if (!matricule) throw new Error("Veuillez entrer votre numéro de matricule");
  
        const response = await fetch(
          `http://localhost:8080/api/resultats/examen/${matricule}`
        );
  
        if (!response.ok) {
          const msg = await response.text();
          throw new Error(msg || "Erreur serveur");
        }
  
        const data = await response.json();
  
        setResultat({
          type: "examens",
          identifiant: matricule,
          data,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-4xl py-2 text-center font-bold text-[#f4b400]">
        Consultation des Résultats
      </h1>

      <div className="flex border-b mb-6">
        <button
          className={`py-4 px-6 font-medium text-lg ${
            typeRecherche === "preinscription"
              ? "border-b-2 border-[#f4b400] text-[#f4b400]"
              : "text-gray-500"
          }`}
          onClick={() => {
            setTypeRecherche("preinscription");
            // Les résultats seront automatiquement réinitialisés par le useEffect
          }}
        >
          Résultats de Pré-inscription
        </button>
        <button
          className={`py-4 px-6 font-medium text-lg ${
            typeRecherche === "examens"
              ? "border-b-2 border-[#f4b400] text-[#f4b400]"
              : "text-gray-500"
          }`}
          onClick={() => {
            setTypeRecherche("examens");
            // Les résultats seront automatiquement réinitialisés par le useEffect
          }}
        >
          Résultats d'Examens
        </button>
      </div>

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
              {typeRecherche === "preinscription"
                ? "Consultez le statut de votre pré-inscription en entrant votre numéro CIN"
                : "Consultez vos résultats d'examens en entrant votre numéro de matricule"}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={rechercherResultat}
        className="bg-white border p-6 rounded-md mb-8"
      >
        {typeRecherche === "preinscription" ? (
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
                  <option value="STNPA">STNPA</option>
                  <option value="STI">STI</option>
                  <option value="STGC">STGC</option>
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
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  Numéro de matricule <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 2023L001"
                  required
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
                  <option value="STNPA">STNPA</option>
                  <option value="STI">STI</option>
                  <option value="STGC">STGC</option>
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
        )}

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
              {resultat.type === "preinscription"
                ? "Résultat de Pré-inscription"
                : "Résultats d'Examens"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">
                  {resultat.type === "preinscription"
                    ? "Numéro CIN"
                    : "Matricule"}
                </p>
                <p className="text-lg font-semibold">{resultat.identifiant}</p>
              </div>

              {resultat.type === "preinscription" ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <p
                      className={`text-lg font-semibold ${
                        resultat.data.statut === "Accepté"
                          ? "text-green-600"
                          : resultat.data.statut === "Refusé"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {resultat.data.statut}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-lg font-semibold">
                      {resultat.data.date}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {Object.entries(resultat.data).map(
                    ([semestre, data]) =>
                      data && (
                        <div
                          key={semestre}
                          className="bg-gray-50 p-4 rounded-md"
                        >
                          <p className="text-sm font-medium text-gray-500">
                            Semestre {semestre.replace("semestre", "")}
                          </p>
                          <p className="text-lg font-semibold">
                            {data.moyenne}/20
                          </p>
                          <p className="text-sm">Rang: {data.rang}</p>
                        </div>
                      )
                  )}
                </>
              )}
            </div>

            {resultat.type === "preinscription" ? (
              <div className="space-y-4">
                {resultat.data.nom && resultat.data.prenom && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom</p>
                      <p className="text-base">{resultat.data.nom}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Prénom
                      </p>
                      <p className="text-base">{resultat.data.prenom}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mention</p>
                    <p className="text-base">{resultat.data.mention}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Parcours
                    </p>
                    <p className="text-base">{resultat.data.parcours}</p>
                  </div>
                </div>

                {resultat.matricule && (
                  <div className="mt-4 p-4 bg-green-50 rounded-md">
                    <p className="font-medium text-green-800">
                      Votre numéro de matricule:{" "}
                      <span className="ml-2">{resultat.matricule}</span>
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Conservez précieusement ce numéro pour vos futures
                      démarches
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

                {resultat.data.statut === "En attente" && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                    <p className="text-yellow-800">{resultat.data.message}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(resultat.data).map(
                  ([semestre, data]) =>
                    data && (
                      <div
                        key={semestre}
                        className="border-b pb-6 last:border-b-0 last:pb-0"
                      >
                        <h3 className="text-xl font-semibold mb-4">
                          Semestre {semestre.replace("semestre", "")}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm font-medium text-gray-500">
                              Moyenne
                            </p>
                            <p className="text-2xl font-bold">
                              {data.moyenne}/20
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm font-medium text-gray-500">
                              Rang
                            </p>
                            <p className="text-2xl font-bold">{data.rang}</p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm font-medium text-gray-500">
                              Mentions
                            </p>
                            <p className="text-lg font-semibold">
                              {data.mentions.join(", ")}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                              UE Validées
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              {data.ueValidees}
                            </p>
                          </div>

                          <div className="bg-red-50 p-4 rounded-md">
                            <p className="text-sm font-medium text-red-800">
                              UE Non Validées
                            </p>
                            <p className="text-xl font-bold text-red-600">
                              {data.ueNonValidees}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
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
                  {typeRecherche === "preinscription"
                    ? "Entrez votre numéro CIN pour consulter votre résultat de pré-inscription"
                    : "Entrez votre numéro de matricule pour consulter vos résultats d'examens"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultatsPage;
