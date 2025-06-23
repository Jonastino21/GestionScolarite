import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudCog } from 'lucide-react';

const DepartmentList = ({ onStaticsDep, statDep }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchDepartement = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/departement/rechercher');
      const departement = res.data.map(element => ({
        id: element.id,
        nom: element.nom,
        responsable: element.responsable,
        employeeCount: element.employeList || 0
      }));
      setDepartments(departement);
      onStaticsDep(res.data.length);
    } catch (error) {
      console.error("Error fetching departement:", error);
  
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartement();
  }, []);

  const [newDept, setNewDept] = useState({
    nom: '', 
    responsable: ''
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewDept(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDept.nom || !newDept.responsable) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/departement/ajouter", newDept);
      console.log(response.data);
      
      setNewDept({
        nom: '',
        responsable: ''
      });
      
      await fetchDepartement();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
    }
  };

  const handleDelete = async (id) => {
    

    try {
      const numericId = Number(id);
      console.log(numericId)
      const response = await axios.delete(`http://localhost:8080/departement/supprimer/${numericId}`);
      console.log("Suppression réussie:", response.data);
      await fetchDepartement();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error.response?.data || error.message);
      alert(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Départements</h2>
      
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Nom du département"
            name="nom"
            value={newDept.nom}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Responsable"
            name="responsable"
            value={newDept.responsable}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Ajouter'}
          </button>
        </div>
      </div>
      
      {loading && departments.length === 0 ? (
        <p className="text-center py-4">Chargement en cours...</p>
      ) : (
        <div className="space-y-3">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <div key={dept.id} className="border border-gray-200 rounded p-3 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{dept.nom}</h3>
                  <p className="text-sm text-gray-500">Responsable: {dept.responsable}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {dept.employeeCount} employés
                  </span>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                    title="Supprimer"
                    aria-label="Supprimer"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun département disponible</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentList;