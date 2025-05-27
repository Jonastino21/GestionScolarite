import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Form,
  InputGroup,
  Spinner,
  Modal,
  Pagination,
  Toast,
  ToastContainer,
  Offcanvas,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/* ────────────  CONSTANTES ──────────── */
const STATUS = {
  PENDING: "En attente",
  ACCEPTED: "Accepté",
  REJECTED: "Refusé",
};

const STATUS_COLORS = {
  [STATUS.PENDING]: "secondary",
  [STATUS.ACCEPTED]: "success",
  [STATUS.REJECTED]: "danger",
};

const ITEMS_PER_PAGE = 10;
const API_BASE = "http://localhost:8080/api/preinscription"; // ← Base URL de l’API
const FILE_API = "http://localhost:8080/file/download";      // ← Endpoint pour les fichiers

export default function ManagePreInscriptions() {
  /* ────────────────────────────  STATES ──────────────────────────── */
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentApp, setCurrentApp] = useState(null);      // pour Accept/Refuse
  const [detailApp, setDetailApp] = useState(null);        // pour Offcanvas détail
  const [nextStatus, setNextStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0 });
  const [toast, setToast] = useState({ show: false, msg: "" });

  /* ────────────────────────  FETCH LISTE DES DEMANDES ──────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement : " + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ────────────────────────  FILTRAGE + STATS ──────────────────────── */
  useEffect(() => {
    let data = [...applications];
    if (statusFilter !== "ALL") data = data.filter((a) => a.status === statusFilter);

    if (search.trim()) {
      const t = search.toLowerCase();
      data = data.filter((a) => {
        const p = a.informationsPersonnelles;
        const pa = a.parcoursAcademique;
        return [p.nom, p.prenom, p.cin, pa.parcours]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(t));
      });
    }
    setFiltered(data);
    setPage(1);
    setStats({
      pending: applications.filter((a) => a.status === STATUS.PENDING).length,
      accepted: applications.filter((a) => a.status === STATUS.ACCEPTED).length,
      rejected: applications.filter((a) => a.status === STATUS.REJECTED).length,
    });
  }, [applications, statusFilter, search]);

  /* ────────────────────────  ACTIONS ──────────────────────── */
  const openModal = (app, status) => {
    setCurrentApp(app);
    setNextStatus(status);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!currentApp) return;
    try {
      const res = await fetch(`${API_BASE}/${currentApp.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Réponse " + res.status);
      setApplications((prev) =>
        prev.map((a) => (a.id === currentApp.id ? { ...a, status: nextStatus } : a))
      );
      setToast({ show: true, msg: `Statut mis à jour en ${nextStatus}` });
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour le statut : " + err.message);
    } finally {
      setShowModal(false);
    }
  };

  const openDetail = (app) => {
    setDetailApp(app);
    setShowDetail(true);
  };

  /* ────────────────────────  PAGINATION ──────────────────────── */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const renderPagination = () => (
    <Pagination className="justify-content-center">
      <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
      <Pagination.Prev disabled={page === 1} onClick={() => setPage((p) => p - 1)} />
      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} />
      <Pagination.Last disabled={page === totalPages} onClick={() => setPage(totalPages)} />
    </Pagination>
  );

  /* ────────────────────────  RENDER ──────────────────────── */
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="card shadow-sm">
      {/* ────────── HEADER ────────── */}
      <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <h4 className="mb-0">Validation des demandes de pré‑inscription</h4>
        <div className="d-flex gap-2">
          <Badge bg="secondary">En attente : {stats.pending}</Badge>
          <Badge bg="success">Acceptées : {stats.accepted}</Badge>
          <Badge bg="danger">Refusées : {stats.rejected}</Badge>
        </div>
        <InputGroup style={{ maxWidth: 300 }}>
          <Form.Control
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Recherche"
          />
        </InputGroup>
      </div>

      {/* ────────── BODY ────────── */}
      <div className="card-body">
        {/* Filtres */}
        <div className="btn-group mb-3">
          {["ALL", STATUS.PENDING, STATUS.ACCEPTED, STATUS.REJECTED].map((key) => (
            <Button
              key={key}
              variant={statusFilter === key ? "primary" : "outline-primary"}
              onClick={() => setStatusFilter(key)}
            >
              {key === "ALL" ? "Tous" : key}
            </Button>
          ))}
        </div>

        {/* Tableau */}
        <Table hover responsive className="align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Parcours</th>
              <th>CIN</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((app, i) => {
              const p = app.informationsPersonnelles;
              const pa = app.parcoursAcademique;
              return (
                <tr key={app.id}>
                  <td>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                  <td>{p.nom} {p.prenom}</td>
                  <td>{pa.parcours}</td>
                  <td>{p.cin}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td><Badge bg={STATUS_COLORS[app.status]}>{app.status}</Badge></td>
                  <td>
                    <Button size="sm" variant="info" className="me-2" onClick={() => openDetail(app)}>
                      Détails
                    </Button>
                    <Button size="sm" variant="success" className="me-2" disabled={app.status === STATUS.ACCEPTED} onClick={() => openModal(app, STATUS.ACCEPTED)}>
                      Accepter
                    </Button>
                    <Button size="sm" variant="danger" disabled={app.status === STATUS.REJECTED} onClick={() => openModal(app, STATUS.REJECTED)}>
                      Refuser
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {filtered.length === 0 && <p className="text-center text-muted py-4">Aucune demande trouvée.</p>}
        {totalPages > 1 && renderPagination()}
      </div>

      {/* ────────── MODAL CONFIRMATION ────────── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{nextStatus === STATUS.ACCEPTED ? "Confirmer l’acceptation" : "Confirmer le refus"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentApp && (
            <p>
              Voulez‑vous vraiment {nextStatus === STATUS.ACCEPTED ? "accepter" : "refuser"} la demande de
              <strong> {currentApp.informationsPersonnelles.nom} {currentApp.informationsPersonnelles.prenom}</strong> ?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant={nextStatus === STATUS.ACCEPTED ? "success" : "danger"} onClick={confirmAction}>Confirmer</Button>
        </Modal.Footer>
      </Modal>

      {/* ────────── OFFCANVAS DÉTAIL ────────── */}
      <Offcanvas show={showDetail} onHide={() => setShowDetail(false)} placement="end" scroll backdrop>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Dossier détaillé</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {detailApp ? (
            <>
              {/* Informations personnelles */}
              <section className="mb-4">
                <h6 className="border-bottom pb-2">Informations personnelles</h6>
                <p><strong>Nom :</strong> {detailApp.informationsPersonnelles.nom} {detailApp.informationsPersonnelles.prenom}</p>
                <p><strong>Email :</strong> {detailApp.informationsPersonnelles.email}</p>
                <p><strong>Téléphone :</strong> {detailApp.informationsPersonnelles.telephone}</p>
                <p><strong>Date & lieu de naissance :</strong> {detailApp.informationsPersonnelles.dateNaissance} – {detailApp.informationsPersonnelles.lieuNaissance}</p>
                <p><strong>Nationalité :</strong> {detailApp.informationsPersonnelles.nationalite}</p>
                <p><strong>Genre :</strong> {detailApp.informationsPersonnelles.genre}</p>
                <p><strong>Situation matrimoniale :</strong> {detailApp.informationsPersonnelles.situationMatrimoniale}</p>
              </section>

              {/* Parents */}
              <section className="mb-4">
                <h6 className="border-bottom pb-2">Parents / Tuteur</h6>
                <p><strong>Père :</strong> {detailApp.parents.nomPere} – {detailApp.parents.contactPere || "N/A"}</p>
                <p><strong>Mère :</strong> {detailApp.parents.nomMere} – {detailApp.parents.contactMere || "N/A"}</p>
                <p><strong>Adresse parents :</strong> {detailApp.parents.adresseParents}, {detailApp.parents.regionParents}</p>
              </section>

              {/* Parcours académique */}
              <section className="mb-4">
                <h6 className="border-bottom pb-2">Parcours académique</h6>
                <p><strong>Bac :</strong> {detailApp.parcoursAcademique.anneeBac} – série {detailApp.parcoursAcademique.serieBac} ({detailApp.parcoursAcademique.mentionBac})</p>
                <p><strong>Parcours souhaité :</strong> {detailApp.parcoursAcademique.niveau} – {detailApp.parcoursAcademique.parcours}</p>
                <p><strong>Mention :</strong> {detailApp.parcoursAcademique.mention}</p>
              </section>

              {/* Documents */}
              <section>
                <h6 className="border-bottom pb-2">Documents fournis</h6>
                <ul className="list-unstyled">
                  {Object.entries(detailApp.documents).filter(([k,v]) => k.endsWith("Path") && v).map(([key, value]) => (
                    <li key={key} className="mb-2">
                      <a href={`${FILE_API}/${value}`} target="_blank" rel="noopener noreferrer">
                        Télécharger {key.replace("Path", "").replace(/([A-Z])/g, " $1").trim()}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <p>Chargement…</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* ────────── TOAST ────────── */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
          <Toast.Body>{toast.msg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
