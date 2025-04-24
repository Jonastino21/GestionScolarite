import { useState } from "react";

const mentionsOptions = {
  "Licence professionnelle": {
    "Sciences et Techniques du Numérique et Physiques Appliqués (STNPA)": [
      "Génie Informatique",
      "Génie Électronique Informatique",
      "Génie Biomédical (L2 après PACES ou équivalent)",
    ],
    "Sciences et Technologies Industrielles (STI)": [
      "Génie Électrique",
      "Génie Industriel",
      "Froid et Énergie",
    ],
    "Sciences et Technologies des Génies Civils (STGC)": [
      "Bâtiments et Travaux Publics",
      "Génie Hydraulique",
      "Génie de l'Architecture",
    ],
  },
  "Master Ingénieur": {
    "Sciences et Techniques du Numérique et Physiques Appliqués (STNPA)": [
      "Génie Logiciel",
      "Électronique et Informatique Industrielle",
      "Télécommunications et Réseaux",
      "Génie Biomédical",
    ],
    "Sciences et Technologies Industrielles (STI)": [
      "Ingénierie des Systèmes Électriques Automatisés",
      "Génie Industriel",
      "Froid et Énergie",
    ],
    "Sciences et Technologies des Génies Civils (STGC)": [
      "Bâtiments et Travaux Publics",
      "Aménagements et Travaux Publics",
      "Hydrauliques et Ouvrages",
    ],
  },
};

function LabelRequis({ children }) {
  return (
    <label className="block text-sm font-medium text-left text-gray-700 mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );
}

function InscriptionForm() {
  const [activeTab, setActiveTab] = useState("licence");
  const [inscriptionType, setInscriptionType] = useState("inscription");
  const [formData, setFormData] = useState({
    // Type d'inscription
    typeInscription: "inscription",

    // Infos personnelles
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    cin: "",

    // État civil
    dateNaissance: "",
    lieuNaissance: "",
    adresse: "",
    region: "",
    pays: "",
    nationalite: "",
    genre: "",

    // Études
    niveau:
      activeTab === "licence" ? "Licence professionnelle" : "Master Ingénieur",
    mention: "",
    parcours: "",
    anneeBac: "",
    serieBac: "",
    universiteOrigine: "",
    diplomeObtenu: "", // Pour Master

    // Documents
    photoIdentite: null,
    acteNaissance: null,
    copieCin: null,
    certificatResidenceParents: null,
    diplomeBac: null,
    releveNotesBac: null,
    diplomeLicence: null, // Pour Master
    recuVersement: null,

    // Validation
    acceptationReglement: false,
  });

  // Mettre à jour le niveau lorsque l'onglet change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      ...formData,
      niveau:
        tab === "licence" ? "Licence professionnelle" : "Master Ingénieur",
      mention: "",
      parcours: "",
    });
  };

  // Mettre à jour le type d'inscription
  const handleInscriptionTypeChange = (type) => {
    setInscriptionType(type);
    setFormData({
      ...formData,
      typeInscription: type,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "mention" && { parcours: "" }),
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis:", formData);
    alert("Dossier soumis avec succès!");
  };

  // Calcul des frais en fonction du niveau et de la nationalité
  const calculerFrais = () => {
    if (formData.niveau === "Licence professionnelle") {
      return formData.nationalite === "Malagasy" ? "250 000 Ar" : "390 000 Ar";
    } else if (formData.niveau === "Master Ingénieur") {
      return "500 000 Ar";
    }
    return "Non déterminé";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-4xl py-2 font-bold text-[#f4b400] text-center">
        Soumission de dossier d'inscription
      </h1>
      <p className="p-5 text-xl text-center">
        Pour votre inscription ou réinscription à l'ISSTM, veuillez compléter ce
        formulaire et fournir tous les documents requis.
      </p>

      {/* Type d'inscription */}
      <div className="mb-6 flex justify-end">
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => handleInscriptionTypeChange("inscription")}
            className={`px-6 py-3 font-medium ${
              inscriptionType === "inscription"
                ? "bg-[#f4b400] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Inscription
          </button>
          <button
            onClick={() => handleInscriptionTypeChange("reinscription")}
            className={`px-6 py-3 font-medium ${
              inscriptionType === "reinscription"
                ? "bg-[#f4b400] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Réinscription
          </button>
        </div>
      </div>

      {/* Onglets Licence/Master */}
      <div className="">
        <div className="flex">
          <button
            onClick={() => handleTabChange("licence")}
            className={`px-6 py-3 font-medium ${
              activeTab === "licence"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Licence professionnelle
          </button>
          <button
            onClick={() => handleTabChange("master")}
            className={`px-6 py-3 font-medium ${
              activeTab === "master"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Master Ingénieur
          </button>
        </div>

        {/* Message de disponibilité */}
        {/* {activeTab === "licence" && false && (
          <div className="border p-4 text-red-500">
            Aucune inscription en L1 n'est disponible pour le moment.
          </div>
        )} */}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 
          3.582-8 8-8 8 3.582 8 8zm-9-1a1 1 0 112 0v5a1 1 0 
          11-2 0V9zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Frais universitaire en une année : </strong>{" "}
              {activeTab === "licence"
                ? "Licence: 750.000 Ar (nationaux) / 1.170.000 Ar (étrangers)"
                : "Master: 1.050.000 Ar (nationaux) / 1.500.000 Ar (étrangers)"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {inscriptionType === "reinscription" && (
          <div className="bg-white border p-4 rounded-md">
            <h2 className="text-xl text-left font-semibold mb-4 text-gray-700">
              Informations de réinscription
            </h2>

            <div>
              <LabelRequis>Année précédente</LabelRequis>
              <input
                type="text"
                name="anneePrecedente"
                value={formData.anneePrecedente || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: L1, M2"
                required
              />
            </div>
          </div>
        )}

        {/* Section 2: Informations personnelles */}
        <div className="bg-white border p-4 rounded-md">
          <h2 className="text-xl text-left font-semibold mb-4 text-gray-700">
            Informations Personnelles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelRequis>Nom</LabelRequis>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Prénom(s)</LabelRequis>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Email</LabelRequis>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Téléphone</LabelRequis>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Numéro CIN</LabelRequis>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Date de naissance</LabelRequis>
              <input
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Lieu de naissance</LabelRequis>
              <input
                type="text"
                name="lieuNaissance"
                value={formData.lieuNaissance}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Adresse</LabelRequis>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Région</LabelRequis>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Pays</LabelRequis>
              <input
                type="text"
                name="pays"
                value={formData.pays}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Nationalité</LabelRequis>
              <input
                type="text"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Genre</LabelRequis>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Études */}
        <div className="bg-white border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
            Parcours Académique
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelRequis>Année d'obtention du Baccalauréat</LabelRequis>
              <input
                type="text"
                name="anneeBac"
                value={formData.anneeBac}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Série du Baccalauréat</LabelRequis>
              <input
                type="text"
                name="serieBac"
                value={formData.serieBac}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <LabelRequis>Université d'origine</LabelRequis>
              <input
                type="text"
                name="universiteOrigine"
                value={formData.universiteOrigine}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {activeTab === "master" && (
              <div>
                <LabelRequis>Diplôme obtenu (Licence)</LabelRequis>
                <input
                  type="text"
                  name="diplomeObtenu"
                  value={formData.diplomeObtenu}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Choix de formation */}
        <div className="bg-white border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
            Choix de Formation
          </h2>

          <div className="space-y-4">
            <div>
              <LabelRequis>Mention</LabelRequis>
              <select
                name="mention"
                value={formData.mention}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une mention</option>
                {Object.keys(mentionsOptions[formData.niveau]).map(
                  (mention) => (
                    <option key={mention} value={mention}>
                      {mention}
                    </option>
                  )
                )}
              </select>
            </div>

            {formData.mention && (
              <div>
                <LabelRequis>Parcours</LabelRequis>
                <select
                  name="parcours"
                  value={formData.parcours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un parcours</option>
                  {mentionsOptions[formData.niveau][formData.mention].map(
                    (parcours) => (
                      <option key={parcours} value={parcours}>
                        {parcours}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-md">
              <p className="font-medium text-blue-800">
                Premier tranche frais d{""}
                {inscriptionType === "reinscription"
                  ? "e réinscription"
                  : "'inscription"}
                :<span className="ml-2 text-lg">{calculerFrais()}</span>
              </p>
              <p className="text-sm text-blue-600 mt-1">
                À payer avant le dépôt du dossier à la banque BFV <br />
                Nom du client :{" "}
                <span className=" text-black font-bold">ISSTM</span> <br />
                N° du compte :{" "}
                <span className="text-black font-bold">
                  00650 05004012981-07
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Documents à fournir */}
        <div className="bg-white border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
            Documents à Fournir
          </h2>

          <div className="space-y-4">
            <div>
              <LabelRequis>Photo d'identité (format passeport)</LabelRequis>
              <span className="block text-xs text-gray-500 mb-2">
                Format JPG/PNG, max 2MB
              </span>
              <input
                type="file"
                name="photoIdentite"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                required
              />
            </div>

            <div>
              <LabelRequis>Acte de naissance (moins de 3 mois)</LabelRequis>
              <span className="block text-xs text-gray-500 mb-2">
                Format PDF, max 2MB
              </span>
              <input
                type="file"
                name="acteNaissance"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="application/pdf,image/*"
                required
              />
            </div>

            <div>
              <LabelRequis>Copie de la CIN recto-verso</LabelRequis>
              <span className="block text-xs text-gray-500 mb-2">
                Format PDF ou image, max 2MB
              </span>
              <input
                type="file"
                name="copieCin"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="application/pdf,image/*"
                required
              />
            </div>

            <div>
              <LabelRequis>Certificat de résidence des parents</LabelRequis>
              <span className="block text-xs text-gray-500 mb-2">
                Format PDF, max 2MB
              </span>
              <input
                type="file"
                name="certificatResidenceParents"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="application/pdf"
                required
              />
            </div>

            <div>
              <LabelRequis>Copie du diplôme du Baccalauréat</LabelRequis>
              <span className="block text-xs text-gray-500 mb-2">
                Format PDF, max 5MB
              </span>
              <input
                type="file"
                name="diplomeBac"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="application/pdf"
                required
              />
            </div>

            <div>
              <LabelRequis>Relevé de notes du Baccalauréat</LabelRequis>
              <span className="block text-xs text-gray-500 mb-2">
                Format PDF, max 5MB
              </span>
              <input
                type="file"
                name="releveNotesBac"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="application/pdf"
                required
              />
            </div>

            {activeTab === "master" && (
              <div>
                <LabelRequis>Copie du diplôme de Licence</LabelRequis>
                <span className="block text-xs text-gray-500 mb-2">
                  Format PDF, max 5MB
                </span>
                <input
                  type="file"
                  name="diplomeLicence"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="application/pdf"
                  required
                />
              </div>
            )}

            <div>
              <LabelRequis>Reçu du premier versement</LabelRequis>
              <span className="block text-xs text-gray-500 mb-2">
                {activeTab === "licence"
                  ? "250 000 Ar (nationaux) / 390 000 Ar (étrangers)"
                  : "500 000 Ar"}
              </span>
              <input
                type="file"
                name="recuVersement"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="application/pdf,image/*"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 6: Validation */}
        <div className="bg-white border p-4 rounded-md">
          <h2 className="text-xl text-left font-semibold mb-4 text-gray-700">
            <LabelRequis>Validation</LabelRequis>
          </h2>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="acceptationReglement"
                name="acceptationReglement"
                checked={formData.acceptationReglement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    acceptationReglement: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
            </div>
            <label
              htmlFor="acceptationReglement"
              className="ml-2 block text-sm text-gray-700"
            >
              Je déclare sur l'honneur que les renseignements fournis sont
              exacts et m'engage à respecter le règlement intérieur de l'ISSTM.
            </label>
          </div>

          <div className="mt-4 text-sm text-left text-gray-700">
            <p>
              Le dossier complet sera traité après vérification de tous les
              documents. Vous recevrez une confirmation par email une fois votre
              inscription validée.
            </p>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {inscriptionType === "reinscription"
              ? "Soumettre la réinscription"
              : "Soumettre l'inscription"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InscriptionForm;
