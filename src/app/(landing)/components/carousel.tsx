"use client";
import { Distrito } from "@/services/get-distritos";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import ZoneCard from "./zone-card";
import { Telo } from "@/services/get-telos";

interface Props {
  distritos: Distrito[];
  hoteles: Telo[];
}

function Carousel({ distritos, hoteles }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const REAL_VISIBLE_ITEMS_MD = 4;
  const CLONED_ITEMS_COUNT = 2;

  const preparedDistritos =
    distritos.length > 0
      ? [
          ...distritos.slice(-CLONED_ITEMS_COUNT), // Clones de los últimos elementos (para el inicio)
          ...distritos, // Los elementos originales
          ...distritos.slice(0, CLONED_ITEMS_COUNT), // Clones de los primeros elementos (para el final)
        ]
      : [];

  const initialIndex = distritos.length > 0 ? CLONED_ITEMS_COUNT : 0;

  useEffect(() => {
    if (distritos.length > 0 && carouselRef.current) {
      setCurrentIndex(initialIndex);
      carouselRef.current.style.transitionDuration = '0s';
      void carouselRef.current.offsetWidth;
      carouselRef.current.style.transitionDuration = '300ms';
    }
  }, [distritos.length, initialIndex]); // Dependencias para que se ejecute una vez al inicio.

  const getDistritoAmountOfTelos = (distrito_id: string): number => {
    return hoteles.filter((telo) => telo.distrito_id === distrito_id).length;
  };


  const handleTransitionEnd = () => {
    setIsTransitioning(false); // Permite nuevas interacciones.

    if (currentIndex >= preparedDistritos.length - CLONED_ITEMS_COUNT) {
      setCurrentIndex(initialIndex);
      if (carouselRef.current) {
        carouselRef.current.style.transitionDuration = '0s'; // Salto instantáneo
        void carouselRef.current.offsetWidth; // Forzar reflow
        carouselRef.current.style.transitionDuration = '300ms'; // Reactivar transición
      }
    }
    if (currentIndex < CLONED_ITEMS_COUNT && distritos.length > 0) {
      setCurrentIndex(preparedDistritos.length - CLONED_ITEMS_COUNT * 2); // Ajuste para el salto hacia atrás
      if (carouselRef.current) {
        carouselRef.current.style.transitionDuration = '0s'; // Salto instantáneo
        void carouselRef.current.offsetWidth; // Forzar reflow
        carouselRef.current.style.transitionDuration = '300ms'; // Reactivar transición
      }
    }
  };

  const nextSlide = () => {
    if (isTransitioning || preparedDistritos.length === 0) return;
    setIsTransitioning(true); // Bloquea interacciones durante la transición.
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning || preparedDistritos.length === 0) return;
    setIsTransitioning(true); // Bloquea interacciones durante la transición.
    setCurrentIndex((prev) => prev - 1);
  };

  if (distritos.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay distritos disponibles
      </div>
    );
  }

  const translateXValue =
    currentIndex * (100 / (window.innerWidth >= 768 ? REAL_VISIBLE_ITEMS_MD : 1));

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={carouselRef}
        className="flex"
        style={{
          transform: `translateX(-${translateXValue}%)`,
          transition: isTransitioning ? "transform 300ms ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd} 
      >
        {preparedDistritos.map((distrito, index) => (
          <div
            key={`${distrito.id}-${index}`}
            className="w-full flex-shrink-0 px-1 md:w-1/4"
          >
            <ZoneCard
              data={distrito}
              hotels={getDistritoAmountOfTelos(distrito.id)}
              href={`/telos/${distrito.slug}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default Carousel;