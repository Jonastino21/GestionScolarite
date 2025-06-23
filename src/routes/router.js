import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";
import Dashboard from "../pages/protected/dashboard";
import PreinscriptionPage from "../pages/dashboard/preinscriptions";

// Pages publiques
import Carousel from "../pages/landing/landing-accueil";
import PreInscriptionForm from "../pages/landing/landing-pre-inscription";
import InscriptionForm from "../pages/landing/landing-inscription";
import ResultatsPage from "../pages/landing/landing-resultats";
import ScolariteLogin from "../pages/auth/scolarity-login";
import ActualitesPage from "../pages/landing/landing-actualite";
import Layout from "../components/layout/layout";
import ProtectedRoute from "./ProtectedRoute"; // à créer juste après
import TimeTableRender from "../pages/protected/emploid-du-temps";
import ClassesList from "../pages/protected/classeList";

const router = createBrowserRouter([
  // Route login (sans layout)
  {
    path: "/intranet",
    element: <ScolariteLogin />,
  },

  // Route dashboard (authentifié, sans navbar)
  {
    path: "/dashboard",
    element: (
      // <ProtectedRoute>
      <Dashboard />
      // </ProtectedRoute>
    ),
    children: [
      {
        path: "preinscription",
        element: <PreinscriptionPage />,
      },
      {
        path: "emploi-du-temps/:classeId",
        element: <TimeTableRender />
      },
      { path: "emploi-du-temps", element: <ClassesList /> }
      // autres enfants
    ],
  },

  // Routes publiques (avec Navbar via Layout)
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Carousel /> },
      { path: "preinscription", element: <PreInscriptionForm /> },
      { path: "inscription", element: <InscriptionForm /> },
      { path: "resultats", element: <ResultatsPage /> },
      { path: "actualite", element: <ActualitesPage /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);
export default router;
