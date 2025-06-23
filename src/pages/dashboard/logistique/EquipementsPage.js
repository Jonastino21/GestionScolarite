// File: src/pages/dashboard/equipements/EquipementsPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/fr';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// locale française
moment.locale('fr');
const localizer = momentLocalizer(moment);

// Modal générique
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

// Toolbar personnalisé en français
function CustomToolbar({ label, onNavigate, onView, view }) {
  const goToBack  = () => onNavigate('PREV');
  const goToNext  = () => onNavigate('NEXT');
  const goToToday = () => onNavigate('TODAY');
  const titles    = { month: 'Mois', week: 'Semaine', day: 'Jour',agenda: 'Agenda' };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex space-x-2">
        <button onClick={goToToday} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Aujourd'hui
        </button>
        <button onClick={goToBack} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Précédent
        </button>
        <button onClick={goToNext} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Suivant
        </button>
      </div>
      <div className="text-lg font-semibold">{label}</div>
      <div className="flex space-x-2">
        {Object.keys(titles).map(v => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={`px-3 py-1 rounded ${
              view === v ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {titles[v]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EquipementsPage() {
  const [materiels, setMateriels]       = useState([]);
  const [selected, setSelected]         = useState(null);
  const [usages, setUsages]             = useState([]);
  const [modalEvent, setModalEvent]     = useState(null);
  const [showUsoModal, setShowUsoModal] = useState(false);
  const [formUso, setFormUso]           = useState({ debut: '', fin: '', utilisateur: '' });
  const [showMatForm, setShowMatForm]   = useState(false);
  const [formMat, setFormMat]           = useState({ nom: '', type: '', quantite: '', emplacement: '' });
  const [loading, setLoading]           = useState(false);

  // États pour navigation du calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  // Charger matériels
  const loadMateriels = () => {
    setLoading(true);
    axios.get('http://localhost:8080/api/jonastino/materiels')
      .then(res => setMateriels(res.data))
      .catch(() => toast.error('Impossible de charger les matériels'))
      .finally(() => setLoading(false));
  };

  // Charger utilisations
  const loadUsages = id => {
    setLoading(true);
    axios.get(`http://localhost:8080/api/jonastino/utilisations?materielId=${id}`)
      .then(res => setUsages(res.data))
      .catch(() => toast.error('Impossible de charger les utilisations'))
      .finally(() => setLoading(false));
  };

  useEffect(loadMateriels, []);
  useEffect(() => {
    if (selected) {
      loadUsages(selected.id);
      setFormUso({ debut: '', fin: '', utilisateur: '' });
    }
  }, [selected]);

  // Création matériel
  const handleMatCreate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/jonastino/materiels', formMat);
      toast.success('Matériel ajouté');
      setShowMatForm(false);
      setFormMat({ nom: '', type: '', quantite: '', emplacement: '' });
      loadMateriels();
    } catch {
      toast.error('Erreur ajout matériel');
    } finally {
      setLoading(false);
    }
  };

  // Création utilisation
  const handleUsoCreate = async e => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/jonastino/utilisations?materielId=${selected.id}` +
        `&debut=${encodeURIComponent(formUso.debut)}` +
        `&fin=${encodeURIComponent(formUso.fin)}` +
        `&utilisateur=${encodeURIComponent(formUso.utilisateur)}`
      );
      toast.success('Utilisation créée');
      setShowUsoModal(false);
      loadUsages(selected.id);
    } catch {
      toast.error('Erreur création utilisation');
    } finally {
      setLoading(false);
    }
  };

  // Suppression utilisation
  const handleDelete = async id => {
    if (!window.confirm('Supprimer cette utilisation ?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/jonastino/utilisations/${id}`);
      toast.info('Utilisation supprimée');
      setModalEvent(null);
      loadUsages(selected.id);
    } catch {
      toast.error('Erreur suppression utilisation');
    } finally {
      setLoading(false);
    }
  };

  // Préparation des events
  const events = usages.map(u => ({
    id: u.id,
    title: u.utilisateur,
    start: new Date(u.debut),
    end:   new Date(u.fin)
  }));

  // Sélection de créneau du calendrier
  const handleSelectSlot = slotInfo => {
    const now = new Date();
    const d   = slotInfo.start;
    const start = new Date(
      d.getFullYear(), d.getMonth(), d.getDate(),
      now.getHours(), now.getMinutes()
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    setFormUso({
      debut:      moment(start).format('YYYY-MM-DDTHH:mm'),
      fin:        moment(end).format('YYYY-MM-DDTHH:mm'),
      utilisateur:''
    });
    setShowUsoModal(true);
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* En-tête */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion Logistique</h1>
        <button
          onClick={() => setShowMatForm(!showMatForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {showMatForm ? 'Annuler' : 'Ajouter matériel'}
        </button>
      </div>

      {/* Formulaire matériel */}
      {showMatForm && (
        <form
          onSubmit={handleMatCreate}
          className="mb-6 grid md:grid-cols-2 gap-4 border p-4 rounded-lg"
        >
          <input
            required placeholder="Nom"
            value={formMat.nom}
            onChange={e => setFormMat({ ...formMat, nom: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            required placeholder="Type"
            value={formMat.type}
            onChange={e => setFormMat({ ...formMat, type: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            required type="number" placeholder="Quantité"
            value={formMat.quantite}
            onChange={e => setFormMat({ ...formMat, quantite: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            required placeholder="Emplacement"
            value={formMat.emplacement}
            onChange={e => setFormMat({ ...formMat, emplacement: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Valider
          </button>
        </form>
      )}

      {/* Liste matériels */}
      <div className="flex space-x-4 overflow-x-auto mb-6">
        {materiels.map(m => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className={`flex-shrink-0 w-64 border p-4 rounded cursor-pointer transition ${
              selected?.id === m.id ? 'border-indigo-500 bg-indigo-50' : 'hover:shadow-md'
            }`}
          >
            <h2 className="text-lg font-semibold">{m.nom}</h2>
            <p className="text-sm">Quantité : {m.quantite}</p>
          </div>
        ))}
      </div>

      {/* Détails matériel sélectionné + calendrier */}
      {selected && (
        <div className="border p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{selected.nom}</h2>
              <p className="text-sm text-gray-600">
                Type : {selected.type} – Emplacement : {selected.emplacement}
              </p>
            </div>
            <button
              onClick={() => setShowUsoModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Utiliser
            </button>
          </div>

          <div className="mb-6">
            <BigCalendar
              localizer={localizer}
              events={events}
              date={currentDate}
              view={currentView}
              onNavigate={date => setCurrentDate(date)}
              onView={view => setCurrentView(view)}
              selectable
              onSelectSlot={handleSelectSlot}
              startAccessor="start"
              endAccessor="end"
              components={{ toolbar: CustomToolbar }}
              style={{ height: 500 }}
              eventPropGetter={() => ({
                style: {
                  padding: '6px 12px',
                  margin: '4px 0',
                  borderRadius: '6px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer'
                }
              })}
              onSelectEvent={event => setModalEvent(event)}
            />
          </div>

          {/* Modal détails et suppression */}
          {modalEvent && (
            <Modal onClose={() => setModalEvent(null)}>
              <h2 className="text-xl font-bold mb-2">{modalEvent.title}</h2>
              <p className="text-sm"><strong>Début :</strong> {modalEvent.start.toLocaleString()}</p>
              <p className="text-sm mb-4"><strong>Fin :</strong> {modalEvent.end.toLocaleString()}</p>
              <button
                onClick={() => handleDelete(modalEvent.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer cette utilisation
              </button>
            </Modal>
          )}

          {/* Modal création utilisation */}
          {showUsoModal && (
            <Modal onClose={() => setShowUsoModal(false)}>
              <h3 className="text-xl font-semibold mb-4">Nouvelle utilisation</h3>
              <form onSubmit={handleUsoCreate} className="space-y-4">
                <div>
                  <label className="block text-sm">Début</label>
                  <input
                    type="datetime-local" required
                    value={formUso.debut}
                    onChange={e => setFormUso({ ...formUso, debut: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Fin</label>
                  <input
                    type="datetime-local" required
                    value={formUso.fin}
                    onChange={e => setFormUso({ ...formUso, fin: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Utilisateur</label>
                  <input
                    type="text" required
                    value={formUso.utilisateur}
                    onChange={e => setFormUso({ ...formUso, utilisateur: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowUsoModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Valider
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
