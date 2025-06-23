import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeForm = ({ employee, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    status: 'Actif',
    departement: { nom: '' },
    poste: { poste: '' }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pré-remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (employee) {
      setFormData({
        nom: employee.name || '',
        prenom: employee.firstName || '',
        email: employee.email || '',
        telephone: employee.phone || '',
        status: employee.status || 'Actif',
        departement: {
          nom: employee.department?.nom || employee.department || ''
        },
        poste: {
          poste: employee.position?.poste || employee.position || ''
        }
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'departementNom') {
      setFormData(prev => ({
        ...prev,
        departement: { nom: value }
      }));
    } else if (name === 'posteNom') {
      setFormData(prev => ({
        ...prev,
        poste: { poste: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (employee) {
        // Mode modification - PUT
        console.log(formData);
        console.log(`http://localhost:8080/Employer/modifier/${employee.id}`)
        response = await axios.put(
          `http://localhost:8080/Employer/modifier/${employee.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Mode création - POST
        response = await axios.post(
          'http://localhost:8080/Employer/ajouter',
          formData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        onSuccess(response.data);
      }
    } catch (err) {
      let errorMessage = employee
        ? 'Erreur lors de la modification'
        : 'Erreur lors de la création';

      if (err.response) {
        errorMessage = err.response.data?.message ||
          `Erreur ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Pas de réponse du serveur - vérifiez votre connexion";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Détails erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {employee ? 'Modifier Employé' : 'Nouvel Employé'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Erreur: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Nom et Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Email et Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Département et Poste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <input
              type="text"
              name="departementNom"
              value={formData.departement.nom}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
            <input
              type="text"
              name="posteNom"
              value={formData.poste.poste}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Statut */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Congé">Congé</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {employee ? 'Modification...' : 'Création...'}
              </span>
            ) : employee ? 'Modifier Employé' : 'Créer Employé'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;