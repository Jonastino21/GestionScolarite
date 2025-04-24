import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active styling
import Logo from "../../assets/images/logo/isstm_logo.png";

const sections = [
  { path: "/", title: "ACCUEIL" },
  { path: "/actualite", title: "ACTUALITÉS" },
  { path: "/preinscription", title: "PRE-INSCRIPTION" },
  { path: "/inscription", title: "INSCRIPTION" },
  { path: "/resultats", title: "RÉSULTATS" },
];

export default function Navbar() {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-12 h-auto" />
        </div>
        <div className="flex items-center space-x-6">
          {sections.map((section) => (
            <NavLink
              key={section.path}
              to={section.path}
              className={({ isActive }) =>
                `px-2 py-1 text-sm font-bold transition-colors duration-200
                ${
                  isActive
                    ? "text-[#f4b400] border-b-2 border-[#f4b400]"
                    : "text-white"
                }
                hover:text-[#f4b400]`
              }
              end
            >
              {section.title}
            </NavLink>
          ))}
          <NavLink
            to="/intranet"
            className="bg-[#f4b400] hover:bg-[#e6a800] text-white font-semibold px-4 py-2 rounded shadow transition-colors duration-200"
          >
            INTRANET
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
