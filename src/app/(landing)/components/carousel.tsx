"use client";
import { Distrito } from "@/services/get-distritos";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import ZoneCard from "./zone-card";

interface Props {
  distritos: Distrito[];
}

function Carousel({ distritos }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const visibleImages = 4;
  const maxIndex = Math.max(0, distritos.length - visibleImages);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

    if (distritos.length === 0) {
        return <div className="text-center text-gray-500">No hay distritos disponibles</div>;
    }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 25}%)` }}
        >
          {distritos.map((distrito, index) => (
            <div key={index} className="w-1/4 flex-shrink-0 px-1">
              <ZoneCard data={distrito} hotels={10} href={`/telos/${distrito.slug}`} />
            </div>
          ))}
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default Carousel;
