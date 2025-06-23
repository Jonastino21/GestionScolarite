import React from "react";
import { Helmet } from "react-helmet-async";
import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>ISSTM - Dashboard Scolarité</title>
      </Helmet>

      <div className="flex h-auto bg-gray-50">
        {/* Sidebar Navigation */}
        <div className="w-70 bg-white shadow-md">
          <div className="p-4 ">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="text-[#f4b400]">ISSTM </span> Scolarité
            </h1>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {/* Modules de gestion */}
              <NavItem
                to="/dashboard/preinscription"
                icon="📋"
                text="Préinscriptions"
              />
              <NavItem
                to="/dashboard/inscriptions"
                icon="📝"
                text="Inscriptions"
              />
              <NavItem
                to="/dashboard/certificates"
                icon="🏆"
                text="Certificats"
              />
              <NavItem
                to="/dashboard/comptabilite"
                icon="💰"
                text="Comptabilité"
              />
              <NavItem to="/dashboard/pedagogie" icon="📊" text="Pédagogie" />
              <NavItem
                to="/dashboard/rh"
                icon="👥"
                text="Ressources Humaines"
              />
              <NavItem
                to="/dashboard/emploi-du-temps"
                icon="⏰"
                text="Emploi du temps"
              />
              <NavItem to="/dashboard/logistique" icon="🖥️" text="Logistique" />
              <NavItem
                to="/dashboard/laboratoires"
                icon="🔬"
                text="Laboratoires"
              />
              <NavItem to="/dashboard/salles" icon="🏫" text="Salles" />

              {/* Séparateur */}
              <li className="border-t border-gray-200 my-4"></li>

              {/* Liens supplémentaires */}
              <NavItem to="/dashboard/parametres" icon="⚙️" text="Paramètres" />
              <NavItem to="/dashboard/aide" icon="❓" text="Aide" />
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Top Bar */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Tableau de Bord
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin</span>
              <div className="w-8 h-8 rounded-full bg-[#f4b400] flex items-center justify-center text-white">
                A
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-6">
            <Outlet /> {/* Ceci affichera le contenu des sous-routes */}
          </main>
        </div>
      </div>
    </>
  );
};

// Composant pour les éléments de navigation
const NavItem = ({ to, icon, text }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center py-2 text-gray-700 ${
            isActive
              ? "bg-gray-100 rounded-md"
              : "text-gray-600 hover:bg-gray-100"
          }`
        }
      >
        <span className="h-5 w-5 text-gray-500">{icon}</span>
        <span className="ml-3 font-medium">{text}</span>
      </NavLink>
    </li>
  );
};

export default Dashboard;
