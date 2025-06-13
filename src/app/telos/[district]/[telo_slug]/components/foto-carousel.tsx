/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

function FotoCarousel({ fotos }: { fotos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const visibleImages = 4;
  const maxIndex = Math.max(0, fotos.length - visibleImages);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative w-full z-0">
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 25}%)` }}
        >
          {fotos.map((image, index) => (
            <div key={index} className="w-1/4 flex-shrink-0 px-1">
              <img
                src={image || "/placeholder.svg"}
                alt={`Hotel image ${index + 1}`}
                className="w-full h-80 object-cover rounded-md"
              />
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

export default FotoCarousel;
