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
  const [itemsPerView, setItemsPerView] = useState(1); 

  const REAL_VISIBLE_ITEMS_MD = 4;
  const CLONED_ITEMS_COUNT = 2;

  const preparedDistritos =
    distritos.length > 0
      ? [
          ...distritos.slice(-CLONED_ITEMS_COUNT),
          ...distritos,
          ...distritos.slice(0, CLONED_ITEMS_COUNT),
        ]
      : [];

  const initialIndex = distritos.length > 0 ? CLONED_ITEMS_COUNT : 0;

  useEffect(() => {
    if (distritos.length > 0 && carouselRef.current) {
      setCurrentIndex(initialIndex);
      carouselRef.current.style.transitionDuration = '0s';
      void carouselRef.current.offsetWidth; // Forzar reflow
      carouselRef.current.style.transitionDuration = '300ms';
    }
  }, [distritos.length, initialIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { 
        setItemsPerView(REAL_VISIBLE_ITEMS_MD);
      } else {
        setItemsPerView(1); 
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  const getDistritoAmountOfTelos = (distrito_id: string): number => {
    return hoteles.filter((telo) => telo.distrito_id === distrito_id).length;
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    if (currentIndex >= preparedDistritos.length - CLONED_ITEMS_COUNT) {
      setCurrentIndex(initialIndex);
      if (carouselRef.current) {
        carouselRef.current.style.transitionDuration = '0s';
        void carouselRef.current.offsetWidth;
        carouselRef.current.style.transitionDuration = '300ms';
      }
    } else if (currentIndex < CLONED_ITEMS_COUNT && distritos.length > 0) {
      setCurrentIndex(preparedDistritos.length - CLONED_ITEMS_COUNT - distritos.length);
      if (carouselRef.current) {
        carouselRef.current.style.transitionDuration = '0s';
        void carouselRef.current.offsetWidth;
        carouselRef.current.style.transitionDuration = '300ms';
      }
    }
  };

  const nextSlide = () => {
    if (isTransitioning || preparedDistritos.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning || preparedDistritos.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  if (distritos.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay distritos disponibles
      </div>
    );
  }

  const translateXValue = currentIndex * (100 / itemsPerView);

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