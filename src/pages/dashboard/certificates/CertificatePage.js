import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const api_cert_creation = "http://localhost:8080/certificate/creation"; 
const api_cert_history_add = "http://localhost:8080/certificate/history/new"; 
const api_cert_history_get = "http://localhost:8080/certificate/history/get"; 

export default function CertificatePage() {
    const [formData, setFormData] = useState({ registrationNumber: "", certificateType: "" });
    const [historyData, setHistoryData] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    /* Récupération de l'historique */
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(api_cert_history_get);
            const data = await res.json();
            setHistoryData(data);
            setFilteredHistory(data);
        } catch (error) {
            setError("Erreur chargement historique");
        } finally {
            setLoading(false);
        }
    };

    /* Génération du certificat */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await fetch(api_cert_creation, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: formData.certificateType, registrationNumber: formData.registrationNumber })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                return;
            }

            const contentType = response.headers.get("content-type");
            if (contentType.includes("application/pdf")) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setSuccessMessage("✅ Certificat généré avec succès !");
            } else {
                setError("La réponse du serveur n'est pas un fichier PDF.");
            }

        } catch (error) {
            setError("Erreur lors de la génération du certificat.");
        } finally {
            setLoading(false);
        }
    };

    /* Téléchargement du PDF */
    const downloadPDF = async () => {
        setLoading(true);

        if (!pdfUrl) {
            setError("Aucun certificat disponible !");
            setLoading(false);
            return;
        }

        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = `${formData.certificateType}_${formData.registrationNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        try {
            await fetch(api_cert_history_add, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: formData.certificateType, registrationNumber: formData.registrationNumber })
            });

            setPdfUrl(null);
            setFormData({ registrationNumber: "", certificateType: "" });
            fetchHistory();
            setSuccessMessage("✅ Certificat téléchargé !");
        } catch (error) {
            setError("Erreur lors de l'ajout de l'historique.");
        } finally {
            setLoading(false);
        }
    };

    /* Réinitialisation du formulaire */
    const resetForm = () => {
        setPdfUrl(null);
        setFormData({ registrationNumber: "", certificateType: "" });
        setSuccessMessage("");
        setError("");
    };

    /* Filtrage de l’historique */
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = historyData.filter(item =>
            item.nameStudent.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.firstNameStudent.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.rgNumberStudent.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.typeOfCertificate.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.dateDelivered.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredHistory(filtered);
    };

    return (
        <div className="global-container bg-white flex flex-col align-items-center gap-3">
            {/* Titre du formulaire */}
            <div className="title-1-cont w-full bg-[#f4b400] py-1">
                <h2 className="text-center text-white text-xl font-bold">GÉNÉRATION DE CERTIFICAT</h2>
            </div>

            {/* Formulaire */}
            <div className="form-cont w-full bg-white border py-3">
                <div className="cadre-form bg-white rounded border w-[50%] p-4 m-auto shadow">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-cont w-full rounded bg-red-200 p-3 mb-2 text-center">
                                <span className="text-red-600">{error}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="success-cont w-full rounded bg-green-200 p-3 mb-2 text-center">
                                <span className="text-green-600">{successMessage}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-1 mb-3">
                            <label className="text-gray-600">Numéro d'inscription</label>
                            <input type="text"
                                placeholder="ex: 10ISST2xxxxxx"
                                className="w-full p-2 rounded border shadow-sm focus:ring-2"
                                value={formData.registrationNumber}
                                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 mb-4">
                            <label className="text-gray-600">Type du certificat</label>
                            <select 
                                className="border rounded p-2 w-full shadow-sm"
                                value={formData.certificateType}
                                onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
                                required
                            >
                                <option value="">Sélectionner...</option>
                                <option value="Attestation de réussite">Attestation de réussite</option>
                                <option value="Certificat de Scolarité">Certificat de Scolarité</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full rounded py-2 text-white text-[18px] font-bold bg-blue-400 hover:bg-blue-600">
                            Générer
                        </button>
                    </form>

                    {/* Affichage du certificat généré */}
                    {pdfUrl && (
                        <div className="mt-4 pdf-container">
                            <iframe src={pdfUrl} className="w-full h-[600px] border rounded shadow-lg"></iframe>
                            <div className="btn-container mt-4 flex flex-row justify-between">
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" onClick={downloadPDF}>Télécharger</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={resetForm}>Annuler</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

             {/* Titre de l’historique */}
            <div className="title-2-cont w-full bg-[#f4b400] py-1">
                <h2 className="text-center text-white text-xl font-bold">HISTORIQUE DES DEMANDES</h2>
            </div>

            {/* Barre de recherche */}
            <input type="text" 
                className="w-[50%] p-2 mb-2 border rounded shadow-sm"
                placeholder="Rechercher par nom, prénom ou numéro d'inscription..."
                value={searchTerm}
                onChange={handleSearch}
            />

            <div className="tb-cont w-full h-[500px] p-2 border shadow overflow-y-scroll">
                <Table responsive className="align-middle">
                    <thead className="table-light border shadow-sm text-center">
                        <tr>
                            <th>Nom</th>
                            <th>Prénoms</th>
                            <th>Numéro d'inscription</th>
                            <th>Mention</th>
                            <th>Niveau</th>
                            <th>Date du délivrance</th>
                            <th>Type du certificat</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredHistory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.nameStudent}</td>
                                <td>{item.firstNameStudent}</td>
                                <td>{item.rgNumberStudent}</td>
                                <td>{item.mentionStudent}</td>
                                <td>{item.levelStudent}</td>
                                <td>{item.dateDelivered}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded text-white font-bold ${
                                        item.typeOfCertificate === "Certificat de Scolarité" ? "bg-green-600" : "bg-orange-600"
                                    }`}>
                                        {item.typeOfCertificate}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
