import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SallesPage() {
  const [salles, setSalles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appeler l'API back pour récupérer la liste des salles
    axios.get('http://localhost:8080/api/dina/salles')
      .then(response => setSalles(response.data))
      .catch(err => setError('Impossible de charger les salles'));
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Liste des salles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salles.map(salle => (
          <div key={salle.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-bold mb-2">{salle.nom}</h2>
            <p><strong>Capacité :</strong> {salle.capacite}</p>
            <p><strong>Bâtiment :</strong> {salle.batiment}</p>
            <p><strong>Étage :</strong> {salle.etage}</p>
            {salle.equipements && salle.equipements.length > 0 && (
              <p><strong>Équipements :</strong> {salle.equipements.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
