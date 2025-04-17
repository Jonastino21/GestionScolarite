import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import Logo from "../../assets/images/logo/isstm_logo.png";
import Photo from "../../assets/images/22.jpg";

const sections = [
  {
    id: "accueil",
    title: "Accueil",
    content:
      "Découvrez un monde de connaissances et d'opportunités avec notre plateforme d'éducation en ligne pour poursuivre une nouvelle carrière.",
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

      <main>
        {/* Section Accueil inspirée de l'image */}
        <section id="accueil" className="py-16 px-4 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gray-800">Meilleurs </span>
                <span className="bg-purple-600 text-white px-2">Cours</span>
                <span className="text-gray-800"> à</span>
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                L'ISSTM
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Découvrez un monde de connaissances et d'opportunités avec notre
                plateforme d'éducation en ligne pour poursuivre une nouvelle
                carrière.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md flex items-center">
                Voir les cours
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>

            <div className="md:w-1/2 relative">
              <div className="bg-purple-500 rounded-full w-64 h-64 md:w-80 md:h-80 absolute -z-10 right-0 top-0"></div>
              <img
                src={Photo}
                alt="Étudiant avec ordinateur portable"
                className="relative z-10"
              />
              <div className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-md z-20">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {/* <div>
                    <p className="text-gray-500 text-sm">Cours en ligne</p>
                    <p className="font-bold">100+</p>
                  </div> */}
                </div>
              </div>
              {/* <div className="absolute bottom-10 left-10 bg-white p-3 rounded-lg shadow-md z-20">
                <p className="font-semibold mb-2">Nos instructeurs</p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    +
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* Autres sections */}
        <div className="space-y-24 py-16 px-4 max-w-6xl mx-auto">
          {sections.slice(1).map((section, index) => (
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
              {section.id === "preinscription" ||
              section.id === "inscription" ? (
                <Button className="mt-4">Commencer</Button>
              ) : null}
            </motion.section>
          ))}
        </div>
      </main>

      <footer className="bg-blue-900 text-white text-center p-6">
        <p>&copy; {new Date().getFullYear()} ISSTM. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default InstitutLandingPage;
