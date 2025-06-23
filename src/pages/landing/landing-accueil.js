import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import localImage from "../../assets/images/122.jpg";
import batiment from "../../assets/images/batiment.jpg";
import gei from "../../assets/images/GEI.jpg";

import { Helmet } from "react-helmet-async";

const images = [
  {
    src: localImage,
    title: "Institut Supérieur des Sciences et Technologies de Mahajanga",
    description:
      "L’éducation scientifique et technologique n’est pas seulement un pilier du développement économique, elle est aussi un acte de foi dans l’humanité. Elle signifie que nous croyons en la capacité de chaque individu à comprendre, créer, et innover pour le bien commun.",
  },
  {
    src: batiment,
    title: "Institut Supérieur des Sciences et Technologies de Mahajanga",
    description: "Description spécifique pour l'image 2",
  },
  {
    src: gei,
    title: "Institut Supérieur des Sciences et Technologies de Mahajanga",
    description: "Description spécifique pour l'image 3",
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0); // image "active" par défaut

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Helmet>
        <title>
          Accueil - ISSTM | Institut Supérieur des Sciences et Téchnologies de
          Mahajanga
        </title>
      </Helmet>
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={image.src}
                alt={`slide-${index}`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              {/* Conteneur de texte spécifique à chaque image */}
              <div className="absolute inset-0 flex flex-col items-center py-32 text-center text-white z-10 px-4">
                <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">
                  {image.title}
                </h1>
                <div className="bg-white/90 text-gray-800 my-16 p-6 rounded shadow-md max-w-2xl mx-auto relative">
                  <div className="absolute -top-4 left-4 bg-green-600 text-white p-2 rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h4v4H7V7zm6 0h4v4h-4V7zM7 13h4v4H7v-4zm6 0h4v4h-4v-4z"
                      />
                    </svg>
                  </div>
                  <p className="italic text-gray-700 whitespace-pre-line">
                    {image.description}
                  </p>
                </div>
                {/* Boutons en dehors du quote */}
                <div className="flex flex-wrap justify-center gap-16 mt-16">
                  <a
                    href="/inscription"
                    className="bg-white text-blue-900 font-bold py-4 px-8 rounded shadow hover:bg-gray-100"
                  >
                    Inscrivez-vous ici
                  </a>
                  <a
                    href="#emploi"
                    className="bg-[#f4b400] text-white font-bold py-4 px-8 rounded shadow hover:bg-yellow-600"
                  >
                    Emploi du temps
                  </a>
                  <a
                    href="#programme"
                    className="bg-[#001f4d] text-white font-bold py-4 px-8 rounded shadow hover:bg-blue-900"
                  >
                    Programme pédagogique
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left control */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 shadow hover:bg-gray-200 z-10"
          aria-label="Previous"
        >
          <FaAngleLeft size={24} />
        </button>

        {/* Right control */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 shadow hover:bg-gray-200 z-10"
          aria-label="Next"
        >
          <FaAngleRight size={24} />
        </button>
      </div>
    </>
  );
};

export default Carousel;
