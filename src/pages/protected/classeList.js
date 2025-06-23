import React, { useState, useEffect } from 'react';
import { api } from '../../config';
import { useNavigate } from 'react-router-dom';

const ClassesList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await api.get('/classes/findall');
                setClasses(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const handlePrint = async (classeId) => {
        try {
            // Ouvrir le PDF dans un nouvel onglet
            window.open(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"}/timeSlot/pdf/${classeId}`, '_blank');
        } catch (err) {
            console.error('Erreur lors de la génération du PDF:', err);
        }
    };


    // Dans la fonction handleModify
    const handleModify = (classe) => {
        // Créer un slug pour le nom de la classe (ex: "genie-civil-btp-l1")
        const classNameSlug = `${classe.parcours.toLowerCase().replace(/\s+/g, '-')}-${classe.level.toLowerCase()}`;
        navigate(`/dashboard/emploi-du-temps/${classe.id}?class=${encodeURIComponent(classNameSlug)}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur ! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Emplois du temps des classes</h1>


            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classes.map((classe) => (
                            <tr key={classe.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classe.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classe.level}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classe.parcours}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => navigate(`/dashboard/emploi-du-temps/${classe.id}`)}
                                        className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handlePrint(classe.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Imprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassesList;
