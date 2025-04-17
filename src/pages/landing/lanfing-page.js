import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import Logo from "../../assets/images/logo/isstm_logo.png";
const sections = [
  {
    id: "accueil",
    title: "Accueil",
    content:
      "Bienvenue à notre institut d'excellence, où l'éducation rencontre l'innovation.",
  },
  {
    id: "filieres",
    title: "Filières",
    content:
      "Explorez nos différentes filières allant de l'informatique à la gestion en passant par les sciences de la santé.",
  },
  {
    id: "preinscription",
    title: "Pré-inscription",
    content:
      "Commencez votre parcours en remplissant le formulaire de pré-inscription en ligne.",
  },
  {
    id: "inscription",
    title: "Inscription",
    content:
      "Finalisez votre inscription avec les documents requis et rejoignez-nous dès aujourd'hui.",
  },
];

const InstitutLandingPage = () => {
  return (
    <div className="font-sans">
      <header className="bg-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-12 h-auto" />
            <h1 className="text-2xl px-2 font-bold">ISSTM</h1>
          </div>
          <div className="space-x-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="hover:underline"
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="space-y-24 py-16 px-4 max-w-5xl mx-auto">
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            className="scroll-mt-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-blue-800">
              {section.title}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {section.content}
            </p>
            {section.id === "preinscription" || section.id === "inscription" ? (
              <Button className="mt-4">Commencer</Button>
            ) : null}
          </motion.section>
        ))}
      </main>

      <footer className="bg-blue-900 text-white text-center p-6">
        <p>&copy; {new Date().getFullYear()} ISSTM. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default InstitutLandingPage;
