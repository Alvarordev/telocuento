/* eslint-disable @next/next/no-img-element */
"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState, useEffect } from "react";

interface FotoCarouselProps {
  fotos: string[];
}

function FotoCarousel({ fotos }: FotoCarouselProps) {
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

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  return (
    <div className="relative w-full z-0">
      <div
        ref={carouselRef}
        className={`flex pb-2 ${
          isMobile 
            ? 'overflow-x-auto scrollbar-hide' 
            : 'overflow-x-auto'
        }`}
        style={{
          scrollbarWidth: isMobile ? 'none' : 'thin', // Firefox
          msOverflowStyle: isMobile ? 'none' : 'auto', // Internet Explorer 10+
        }}
      >
        {fotos.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-1"
            style={{
              minWidth: isMobile ? "100%" : "25%",
              width: isMobile ? "100%" : "25%",
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
  );
}

export default FotoCarousel;