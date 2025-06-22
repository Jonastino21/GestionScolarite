// File: src/pages/dashboard/salles/SallesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function SallesPage() {
  const [salles, setSalles] = useState([]);
  const [selectedSalle, setSelectedSalle] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filterOrganisateur, setFilterOrganisateur] = useState('');
  const [form, setForm] = useState({ debut: '', fin: '', organisateur: '' });
  const [salleForm, setSalleForm] = useState({ nom: '', capacite: '', batiment: '', etage: '', equipements: '' });
  const [loading, setLoading] = useState(false);
  const [showSalleForm, setShowSalleForm] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const formatTimestamp = ts => (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(ts) ? ts + ':00' : ts);

  const loadSalles = () => {
    setLoading(true);
    axios.get('http://localhost:8080/api/dina/salles')
      .then(res => setSalles(res.data))
      .catch(() => toast.error('Impossible de charger les salles'))
      .finally(() => setLoading(false));
  };

  const loadReservations = (salleId, organisateur = '') => {
    setLoading(true);
    let url = `http://localhost:8080/api/dina/reservations?salleId=${salleId}`;
    if (organisateur) url += `&organisateur=${encodeURIComponent(organisateur)}`;
    axios.get(url)
      .then(res => setReservations(res.data))
      .catch(() => toast.error('Impossible de charger les réservations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSalles(); }, []);
  useEffect(() => {
    if (selectedSalle) {
      loadReservations(selectedSalle.id);
      setFilterOrganisateur('');
      setForm({ debut: '', fin: '', organisateur: '' });
    }
  }, [selectedSalle]);

  const handleSelectSalle = salle => setSelectedSalle(salle);
  const handleFilter = () => selectedSalle && loadReservations(selectedSalle.id, filterOrganisateur);

  // Ajout de salle
  const handleSalleCreate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const newSalle = {
        nom: salleForm.nom,
        capacite: +salleForm.capacite,
        batiment: salleForm.batiment,
        etage: salleForm.etage,
        equipements: salleForm.equipements.split(',').map(e => e.trim()).filter(e => e)
      };
      await axios.post('http://localhost:8080/api/dina/salles', newSalle);
      toast.success('Salle ajoutée');
      setSalleForm({ nom: '', capacite: '', batiment: '', etage: '', equipements: '' });
      loadSalles();
      setShowSalleForm(false);
    } catch {
      toast.error('Erreur lors de l\'ajout de la salle');
    } finally {
      setLoading(false);
    }
  };

  // Création réservation
  const handleCreateReservation = async e => {
    e.preventDefault();
    if (!selectedSalle) return;
    setLoading(true);
    try {
      const debutIso = formatTimestamp(form.debut);
      const finIso = formatTimestamp(form.fin);
      await axios.post(
        `http://localhost:8080/api/dina/reservations?salleId=${selectedSalle.id}` +
        `&debut=${encodeURIComponent(debutIso)}` +
        `&fin=${encodeURIComponent(finIso)}` +
        `&organisateur=${encodeURIComponent(form.organisateur)}`
      );
      toast.success('Réservation créée');
      loadReservations(selectedSalle.id, filterOrganisateur);
      setForm({ debut: '', fin: '', organisateur: '' });
      setShowReservationModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Erreur création';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Suppression réservation
  const handleDeleteReservation = async id => {
    if (!window.confirm('Supprimer cette réservation ?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/dina/reservations/${id}`);
      toast.info('Réservation supprimée');
      loadReservations(selectedSalle.id, filterOrganisateur);
    } catch {
      toast.error('Erreur suppression');
    } finally {
      setLoading(false);
    }
  };

  const events = reservations.map(r => ({ id: r.id, title: r.organisateur, start: new Date(r.debut), end: new Date(r.fin) }));

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion Salles & Réservations</h1>
        <button onClick={() => setShowSalleForm(!showSalleForm)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          {showSalleForm ? 'Annuler' : 'Ajouter une salle'}
        </button>
      </div>

      {/* Formulaire d'ajout de salle */}
      {showSalleForm && (
        <form onSubmit={handleSalleCreate} className="mb-6 grid md:grid-cols-2 gap-4 border p-4 rounded-lg">
          <input required placeholder="Nom" value={salleForm.nom} onChange={e => setSalleForm({ ...salleForm, nom: e.target.value })} className="border p-2 rounded" />
          <input required type="number" placeholder="Capacité" value={salleForm.capacite} onChange={e => setSalleForm({ ...salleForm, capacite: e.target.value })} className="border p-2 rounded" />
          <input required placeholder="Bâtiment" value={salleForm.batiment} onChange={e => setSalleForm({ ...salleForm, batiment: e.target.value })} className="border p-2 rounded" />
          <input required placeholder="Étage" value={salleForm.etage} onChange={e => setSalleForm({ ...salleForm, etage: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Équipements (comma)" value={salleForm.equipements} onChange={e => setSalleForm({ ...salleForm, equipements: e.target.value })} className="border p-2 rounded md:col-span-2" />
          <button type="submit" className="md:col-span-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Valider</button>
        </form>
      )}

      {/* Liste horizontale des salles */}
      <div className="flex space-x-4 overflow-x-auto mb-6">
        {salles.map(s => (
          <div key={s.id} onClick={() => handleSelectSalle(s)} className={`flex-shrink-0 w-64 border p-4 rounded cursor-pointer transition ${selectedSalle?.id === s.id ? 'border-indigo-500 bg-indigo-50' : 'hover:shadow-md'}`}>
            <h2 className="text-lg font-semibold">{s.nom}</h2>
            <p className="text-sm">Capacité: {s.capacite}</p>
          </div>
        ))}
      </div>

      {/* Contenu salle sélectionnée */}
      {selectedSalle && (
        <div className="border p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{selectedSalle.nom}</h2>
              <p className="text-sm text-gray-600">{selectedSalle.batiment} • Étage {selectedSalle.etage}</p>
            </div>
            <button onClick={() => setShowReservationModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Réserver</button>
          </div>

          <div className="mb-6">
            <BigCalendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 300 }} />
          </div>


          <div className="mb-6">
            {reservations.length > 0 ? reservations.map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 border rounded mb-2">
                <span className="text-sm">{new Date(r.debut).toLocaleString()} → {new Date(r.fin).toLocaleString()} par {r.organisateur}</span>
                <button onClick={() => handleDeleteReservation(r.id)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
              </div>
            )) : <p>Aucune réservation.</p>}
          </div>

          {/* Modal de réservation */}
          {showReservationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">Nouvelle réservation</h3>
                  <button onClick={() => setShowReservationModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <form onSubmit={handleCreateReservation} className="space-y-4">
                  <div>
                    <label className="block text-sm">Début</label>
                    <input type="datetime-local" required value={form.debut} onChange={e => setForm({ ...form, debut: e.target.value })} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm">Fin</label>
                    <input type="datetime-local" required value={form.fin} onChange={e => setForm({ ...form, fin: e.target.value })} className="w-full border p-2.rounded" />
                  </div>
                  <div>
                    <label className="block text-sm">Organisateur</label>
                    <input type="text" required value={form.organisateur} onChange={e => setForm({ ...form, organisateur: e.target.value })} className="w-full border p-2 rounded" />
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" onClick={() => setShowReservationModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Réserver</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
