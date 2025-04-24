import React from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/authContexts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ScolariteLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    login(); // fake login
    navigate("/dashboard"); // redirige après login
  };

  return (
    <>
      <Helmet>
        <title>ISSTM Admin</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            ISSTM Scolarité
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-left text-gray-700 mb-2">
                Identifiant
              </label>
              <input
                type="text"
                placeholder="Entrez votre identifiant"
                className="w-full border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="Entrez votre mot de passe"
                className="w-full border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#f4b400] text-white py-2 px-4 rounded hover:bg-yellow-600 font-bold"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ScolariteLogin;
