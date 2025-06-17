/* eslint-disable @next/next/no-img-element */
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface FotoCarouselProps {
  fotos: string[];
}

function FotoCarousel({ fotos }: FotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(fotos.length).fill(false)
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleImages = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, fotos.length - visibleImages);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const transformPercentage = isMobile ? currentIndex * 100 : currentIndex * 25;

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  return (
    <div className="relative w-full z-0">
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${transformPercentage}%)` }}
        >
          {fotos.map((image, index) => (
            <div
              key={index}
              className={`
                w-full md:w-1/4 flex-shrink-0 px-1`}
              style={{
                minHeight: isMobile ? "256px" : "320px",
                height: isMobile ? "256px" : "320px",
              }}
            >
              {!imagesLoaded[index] && (
                <Skeleton
                  className="w-full h-full rounded-md"
                  style={{ minHeight: isMobile ? "256px" : "320px" }}
                />
              )}
              <img
                src={image || "/placeholder.svg"}
                alt={`Hotel image ${index + 1}`}
                onLoad={() => handleImageLoad(index)}
                className={`
                  w-full h-64 md:h-80 object-cover rounded-md
                  ${imagesLoaded[index] ? "" : "hidden"}
                `}
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
