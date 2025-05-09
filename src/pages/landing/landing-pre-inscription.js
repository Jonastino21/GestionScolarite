import { useState } from "react";
import { Helmet } from "react-helmet-async";

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

function PreInscriptionForm() {
  const [formData, setFormData] = useState({
    // Infos personnelles
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    telephoneAlt: "", // Champ "ou" téléphone alternatif ajouté

    // État civil
    dateNaissance: "",
    lieuNaissance: "",
    cin: "", // Région ajoutée
    pays: "", // Pays ajouté
    nationalite: "",
    genre: "",
    situationMatrimoniale: "", // Situation matrimoniale ajoutée
    salarie: "", // Statut salarié ajouté

    // Infos parents
    nomPere: "", // Nom du père ajouté
    professionPere: "", // Profession du père ajoutée
    nomMere: "", // Nom de la mère ajoutée
    professionMere: "", // Profession de la mère ajoutée
    adresseParents: "", // Adresse des parents ajoutée
    regionParents: "", // Région des parents ajoutée
    paysParents: "", // Pays des parents ajouté
    telephoneParents: "", // Téléphone des parents ajouté
    telephoneParentsAlt: "", // Téléphone alternatif des parents ajouté

    // Études
    niveau: "",
    mention: "",
    parcours: "",
    anneeBac: "", // Année d'obtention du bac ajoutée
    numeroInscription: "", // Numéro d'inscription ajouté
    serieBac: "", // Série du bac ajoutée
    mentionBac: "", // Mention du bac ajoutée
    universiteDelivrance: "", // Université de délivrance du diplôme ajoutée
    inscriptionAnterieure: "", // Inscription antérieure éventuelle ajoutée
    universiteAnterieure: "", // Université antérieure ajoutée
    etablissementAnterieur: "", // Établissement antérieur ajouté
    parcoursAnterieur: "", // Parcours antérieur ajouté

    // Fichiers
    photoIdentite: null,
    copieDiplome: null,
    releveNotes: null,
    recuPaiement: null,
    acteNaissance: null, // Acte de naissance ajouté
    certificatResidence: null, // Certificat de résidence ajouté
    enveloppesTimbrees: null, // Enveloppes timbrées ajoutées

    // Validation
    acceptationReglement: false,
    lieuSignature: "", // Lieu de signature ajouté
    dateSignature: "", // Date de signature ajoutée
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "niveau" && { mention: "", parcours: "" }),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
  
    // Ajouter les fichiers au FormData
    const fichiers = [
      "photoIdentite",
      "copieDiplome",
      "releveNotes",
      "recuPaiement",
      "acteNaissance",
      "certificatResidence",
      "enveloppesTimbrees",
    ];
    fichiers.forEach((champ) => {
      if (formData[champ]) {
        form.append(champ, formData[champ]);
      }
    });
  
    // Préparer les données JSON sans les fichiers
    const champsTexte = { ...formData };
    fichiers.forEach((champ) => delete champsTexte[champ]);
  
    form.append(
      "data",
      new Blob([JSON.stringify(champsTexte)], {
        type: "application/json",
      })
    );
  
    console.log(formData)
    try {
      const response = await fetch("http://localhost:8080/api/preinscription", {
        method: "POST",
        body: form,
      });
  
      if (!response.ok) {
        const message = await response.text();
        throw new Error("Erreur du serveur : " + message);
      }
  
      const result = await response.json();
      alert("✅ Pré-inscription envoyée avec succès !\n\nStatut : " + result.status);
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("❌ Une erreur est survenue : " + error.message);
    }
  };
  

  return (
    <>
      <Helmet>
        <title>
          Pré-inscription - ISSTM | Institut Supérieur des Sciences et
          Téchnologies de Mahajanga
        </title>
      </Helmet>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
        <h1 className="text-4xl text-center py-2 font-bold text-[#f4b400]">
          Soumission de dossier de pré-inscription
        </h1>
        <p className="p-5 text-center text-xl">
          Pour la soumission de dossier de pré-inscription chez ISSTM, veuillez
          suivre attentivement les consignes. Si vous rencontrez des
          difficultés, n’hésitez pas à nous contacter au numéro +261 32 05 580
          95 ou sur Facebook.
        </p>
        <div className="text-sm text-center text-red-600 mb-4">
          Date limite de réception du dossier: 09 octobre 2025
        </div>
        <h1 className="text-xl font-bold text-left mb-2">Pré-inscription</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Informations personnelles */}
          <div className="bg-white border p-4 rounded-md">
            <h2 className="text-xl text-left font-semibold mb-4 text-gray-700">
              Informations Personnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Nom</LabelRequis>
                </label>
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
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  Prénom(s)
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Email</LabelRequis>
                </label>
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
                <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                  <LabelRequis>Téléphone</LabelRequis>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="flex items-center">ou</span>
                  <input
                    type="tel"
                    name="telephoneAlt"
                    value={formData.telephoneAlt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: État civil */}
          <div className="bg-white border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
              État Civil
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                  <LabelRequis>Date de naissance</LabelRequis>
                </label>
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
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Lieu de naissance</LabelRequis>
                </label>
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
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>CIN</LabelRequis>
                </label>
                <input
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Pays</LabelRequis>
                </label>
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
                <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                  <LabelRequis>Nationalité</LabelRequis>
                </label>
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
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Genre</LabelRequis>
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Masculin">Homme</option>
                  <option value="Féminin">Femme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Situation Matrimoniale</LabelRequis>
                </label>
                <select
                  name="situationMatrimoniale"
                  value={formData.situationMatrimoniale}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Salarié(e)</LabelRequis>
                </label>
                <select
                  name="salarie"
                  value={formData.salarie}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Informations des parents */}
          <div className="bg-white border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
              Informations des Parents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Nom du Père</LabelRequis>
                </label>
                <input
                  type="text"
                  name="nomPere"
                  value={formData.nomPere}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  Profession du Père
                </label>
                <input
                  type="text"
                  name="professionPere"
                  value={formData.professionPere}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Nom de la Mère</LabelRequis>
                </label>
                <input
                  type="text"
                  name="nomMere"
                  value={formData.nomMere}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  Profession de la Mère
                </label>
                <input
                  type="text"
                  name="professionMere"
                  value={formData.professionMere}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Adresse des parents</LabelRequis>
                </label>
                <input
                  type="text"
                  name="adresseParents"
                  value={formData.adresseParents}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Région</LabelRequis>
                </label>
                <input
                  type="text"
                  name="regionParents"
                  value={formData.regionParents}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Pays</LabelRequis>
                </label>
                <input
                  type="text"
                  name="paysParents"
                  value={formData.paysParents}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Téléphone</LabelRequis>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    name="telephoneParents"
                    value={formData.telephoneParents}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="flex items-center">ou</span>
                  <input
                    type="tel"
                    name="telephoneParentsAlt"
                    value={formData.telephoneParentsAlt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Études */}
          <div className="bg-white border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
              Études
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Année d'obtention du Baccalauréat</LabelRequis>
                </label>
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
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>N° d'inscription</LabelRequis>
                </label>
                <input
                  type="text"
                  name="numeroInscription"
                  value={formData.numeroInscription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Série</LabelRequis>
                </label>
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
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Mention</LabelRequis>
                </label>
                <input
                  type="text"
                  name="mentionBac"
                  value={formData.mentionBac}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Université de délivrance du diplôme</LabelRequis>
                </label>
                <input
                  type="text"
                  bg-white
                  name="universiteDelivrance"
                  value={formData.universiteDelivrance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                  <LabelRequis>Inscription antérieure éventuelle</LabelRequis>
                </label>
                <select
                  name="inscriptionAnterieure"
                  value={formData.inscriptionAnterieure}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {formData.inscriptionAnterieure === "Oui" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                      <LabelRequis>Uniersité antérieure</LabelRequis>
                    </label>
                    <input
                      type="text"
                      name="universiteAnterieure"
                      value={formData.universiteAnterieure}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                      <LabelRequis>Établissement antérieur</LabelRequis>
                    </label>
                    <input
                      type="text"
                      name="etablissementAnterieur"
                      value={formData.etablissementAnterieur}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                      <LabelRequis>Parcours antérieur</LabelRequis>
                    </label>
                    <input
                      type="text"
                      name="parcoursAnterieur"
                      value={formData.parcoursAnterieur}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 5: Choix de formation */}
          <div className="bg-white border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
              Choix de Formation
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                  <LabelRequis>Niveau</LabelRequis>
                </label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  {Object.keys(mentionsOptions).map((niveau) => (
                    <option key={niveau} value={niveau}>
                      {niveau}
                    </option>
                  ))}
                </select>
              </div>

              {formData.niveau && (
                <div>
                  <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                    <LabelRequis>Mention</LabelRequis>
                  </label>
                  <select
                    name="mention"
                    value={formData.mention}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.niveau}
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
              )}

              {formData.mention && (
                <div>
                  <label className="block text-sm font-medium text-left text-gray-700 mb-1">
                    <LabelRequis>Parcours</LabelRequis>
                  </label>
                  <select
                    name="parcours"
                    value={formData.parcours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.mention}
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
            </div>
          </div>

          {/* Section 4: Documents à fournir */}
          <div className="bg-white border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-left text-gray-700">
              Documents à Fournir
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium  text-gray-700 mb-1">
                  <LabelRequis>Photo d'identité (format passeport)</LabelRequis>
                  <span className="block text-xs text-gray-500">
                    Format JPG/PNG, max 2MB
                  </span>
                </label>
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
                <label className="block text-sm font-medium  text-gray-700 mb-1">
                  <LabelRequis>
                    Copie du diplôme le plus élevé (PDF)
                  </LabelRequis>
                  <span className="block text-xs text-gray-500">
                    Format PDF, max 5MB
                  </span>
                </label>
                <input
                  type="file"
                  name="copieDiplome"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="application/pdf"
                  required
                />
              </div>

              <div>
                <label className="block text-sm  font-medium text-gray-700 mb-1">
                  <LabelRequis>Relevé de notes (PDF)</LabelRequis>
                  <span className="block text-xs text-gray-500">
                    Format PDF, max 5MB
                  </span>
                </label>
                <input
                  type="file"
                  name="releveNotes"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="application/pdf"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium  text-gray-700 mb-1">
                  <LabelRequis>
                    Reçu de paiement des frais de pré-inscription (PDF/Image)
                  </LabelRequis>
                  <span className="block text-xs text-gray-500">
                    70 000 Ar (nationaux) / 110 000 Ar (étrangers)
                  </span>
                </label>
                <input
                  type="file"
                  name="recuPaiement"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*,application/pdf"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 5: Validation */}
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
                exacts et m'engage à respecter le règlement intérieur de
                l'Université de Mahajanga.*
              </label>
            </div>

            <div className="mt-4 text-sm text-left text-gray-700">
              <p>
                Le dossier complet sera traité après vérification de tous les
                documents.
              </p>
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Soumettre la pré-inscription
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PreInscriptionForm;
