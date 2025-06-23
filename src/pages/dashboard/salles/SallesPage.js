import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/fr';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Locale française
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
  const titles    = { month: 'Mois', week: 'Semaine', day: 'Jour', agenda: 'Agenda' };

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
            className={`px-3 py-1 rounded ${view === v ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {titles[v]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SallesPage() {
  const [salles, setSalles]               = useState([]);
  const [selectedSalle, setSelectedSalle] = useState(null);
  const [reservations, setReservations]   = useState([]);
  const [modalResa, setModalResa]         = useState(null);
  const [showResaForm, setShowResaForm]   = useState(false);
  const [formResa, setFormResa]           = useState({ debut: '', fin: '', organisateur: '' });
  const [showSalleForm, setShowSalleForm] = useState(false);
  const [formSalle, setFormSalle]         = useState({ nom: '', capacite: '', batiment: '', etage: '', equipements: '' });
  const [loading, setLoading]             = useState(false);

  // États pour navigation calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  // Ajoute ":00" si nécessaire
  const formatTimestamp = ts =>
    (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(ts) ? ts + ':00' : ts);

  // Charger salles
  const loadSalles = () => {
    setLoading(true);
    axios.get('http://localhost:8080/api/dina/salles')
      .then(res => setSalles(res.data))
      .catch(() => toast.error('Impossible de charger les salles'))
      .finally(() => setLoading(false));
  };

  // Charger réservations
  const loadReservations = salleId => {
    setLoading(true);
    axios.get(`http://localhost:8080/api/dina/reservations?salleId=${salleId}`)
      .then(res => setReservations(res.data))
      .catch(() => toast.error('Impossible de charger les réservations'))
      .finally(() => setLoading(false));
  };

  useEffect(loadSalles, []);
  useEffect(() => {
    if (selectedSalle) {
      loadReservations(selectedSalle.id);
      setFormResa({ debut: '', fin: '', organisateur: '' });
      setModalResa(null);
    }
  }, [selectedSalle]);

  // Création salle
  const handleSalleCreate = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const newSalle = {
        nom: formSalle.nom,
        capacite: Number(formSalle.capacite),
        batiment: formSalle.batiment,
        etage: formSalle.etage,
        equipements: formSalle.equipements.split(',').map(s => s.trim()).filter(Boolean)
      };
      await axios.post('http://localhost:8080/api/dina/salles', newSalle);
      toast.success('Salle ajoutée');
      setShowSalleForm(false);
      setFormSalle({ nom: '', capacite: '', batiment: '', etage: '', equipements: '' });
      loadSalles();
    } catch {
      toast.error('Erreur ajout salle');
    } finally { setLoading(false); }
  };

  // Création réservation
  const handleResaCreate = async e => {
    e.preventDefault(); if (!selectedSalle) return; setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/dina/reservations?salleId=${selectedSalle.id}` +
        `&debut=${encodeURIComponent(formResa.debut)}` +
        `&fin=${encodeURIComponent(formResa.fin)}` +
        `&organisateur=${encodeURIComponent(formResa.organisateur)}`
      );
      toast.success('Réservation créée');
      setShowResaForm(false);
      loadReservations(selectedSalle.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur création réservation');
    } finally { setLoading(false); }
  };

  // Suppression réservation
  const handleDeleteResa = async id => {
    if (!window.confirm('Supprimer cette réservation ?')) return; setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/dina/reservations/${id}`);
      toast.info('Réservation supprimée');
      setModalResa(null);
      loadReservations(selectedSalle.id);
    } catch {
      toast.error('Erreur suppression réservation');
    } finally { setLoading(false); }
  };

   // Préparation des events
  const events = reservations.map(r => ({ id: r.id, title: r.organisateur, start: new Date(r.debut), end: new Date(r.fin) }));

  // Capture clic sur case : date + heure actuelle
  const handleSelectSlot = slotInfo => {
    // Récupère l'heure actuelle de la machine
    const now = new Date();
    // Conserve la date cliquée mais avec l'heure du système
    const selectedDate = slotInfo.start;
    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      now.getHours(),
      now.getMinutes()
    );
    // Durée par défaut d'une heure
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    setFormResa({
      debut: moment(start).format('YYYY-MM-DDTHH:mm'),
      fin:   moment(end).format('YYYY-MM-DDTHH:mm'),
      organisateur: ''
    });
    setShowResaForm(true);
  };
  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header & Ajout salle */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion Salles & Réservations</h1>
        <button onClick={() => setShowSalleForm(!showSalleForm)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          {showSalleForm ? 'Annuler' : 'Ajouter une salle'}
        </button>
      </div>

      {/* Formulaire ajout salle */}
      {showSalleForm && (
        <form onSubmit={handleSalleCreate} className="mb-6 grid md:grid-cols-2 gap-4 border p-4 rounded-lg">
          <input required placeholder="Nom" value={formSalle.nom} onChange={e => setFormSalle({ ...formSalle, nom: e.target.value })} className="border p-2 rounded" />
          <input required type="number" placeholder="Capacité" value={formSalle.capacite} onChange={e => setFormSalle({ ...formSalle, capacite: e.target.value })} className="border p-2 rounded" />
          <input required placeholder="Bâtiment" value={formSalle.batiment} onChange={e => setFormSalle({ ...formSalle, batiment: e.target.value })} className="border p-2 rounded" />
          <input required placeholder="Étage" value={formSalle.etage} onChange={e => setFormSalle({ ...formSalle, etage: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Équipements (séparés par des virgules)" value={formSalle.equipements} onChange={e => setFormSalle({ ...formSalle, equipements: e.target.value })} className="border p-2 rounded md:col-span-2" />
          <button type="submit" className="md:col-span-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Valider</button>
        </form>
      )}

      {/* Liste des salles */}
      <div className="flex space-x-4 overflow-x-auto mb-6">
        {salles.map(s => (
          <div key={s.id} onClick={() => setSelectedSalle(s)} className={`flex-shrink-0 w-64 border p-4 rounded cursor-pointer transition ${selectedSalle?.id === s.id ? 'border-indigo-500 bg-indigo-50' : 'hover:shadow-md'}`}>
            <h2 className="text-lg font-semibold">{s.nom}</h2>
            <p className="text-sm">Capacité : {s.capacite}</p>
          </div>
        ))}
     . </div>

      {/* Détails + calendrier */}
      {selectedSalle && (
        <div className="border p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{selectedSalle.nom}</h2>
              <p className="text-sm text-gray-600">{selectedSalle.batiment} • Étage {selectedSalle.etage}</p>
            </div>
            <button onClick={() => setShowResaForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Réserver</button>
          </div>

          <BigCalendar
            localizer={localizer}
            events={events}
            date={currentDate}
            view={currentView}
            onNavigate={date => setCurrentDate(date)}
            onView={view => setCurrentView(view)}
            selectable
            onSelectSlot={handleSelectSlot}
            components={{ toolbar: CustomToolbar }}
            style={{ height: 500 }}
            eventPropGetter={() => ({ style: { padding: '6px 12px', margin: '4px 0', borderRadius: '6px', backgroundColor: '#76000f', color: 'white', cursor: 'pointer' } })}
            onSelectEvent={event => setModalResa(event)}
          />

          {/* Modal détails */}
          {modalResa && (
            <Modal onClose={() => setModalResa(null)}>
              <h2 className="text-xl font-bold mb-2">{modalResa.title}</h2>
              <p className="text-sm"><strong>Début :</strong> {modalResa.start.toLocaleString()}</p>
              <p className="text-sm mb-4"><strong>Fin :</strong> {modalResa.end.toLocaleString()}</p>
              <button onClick={() => handleDeleteResa(modalResa.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Supprimer cette réservation</button>
            </Modal>
          )}

          {/* Modal création */}
          {showResaForm && (
            <Modal onClose={() => setShowResaForm(false)}>
              <h3 className="text-xl font-semibold mb-4">Nouvelle réservation</h3>
              <form onSubmit={handleResaCreate} className="space-y-4">
                <div>
                  <label className="block text-sm">Début</label>
                  <input type="datetime-local" required value={formResa.debut} onChange={e => setFormResa({ ...formResa, debut: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm">Fin</label>
                  <input type="datetime-local" required value={formResa.fin} onChange={e => setFormResa({ ...formResa, fin: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm">Organisateur</label>
                  <input type="text" required value={formResa.organisateur} onChange={e => setFormResa({ ...formResa, organisateur: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowResaForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Valider</button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
