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

  useEffect(() => {
    
  }, [distritos.length]);

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
  };

  const maxIndex = distritos.length > itemsPerView ? distritos.length - itemsPerView : 0;

  const nextSlide = () => {
    if (isTransitioning || distritos.length === 0) return;

    if (currentIndex < maxIndex) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (isTransitioning || distritos.length === 0) return;

    if (currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (distritos.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay distritos disponibles
      </div>
    );
  }

  const translateXValue = currentIndex * (100 / itemsPerView);

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= maxIndex;

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
        {distritos.map((distrito) => (
          <div
            key={distrito.id}
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
        disabled={isPrevDisabled}
        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10
          ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isNextDisabled}
        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10
          ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default Carousel;