/* eslint-disable @next/next/no-img-element */
"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState, useEffect } from "react";

interface FotoCarouselProps {
  fotos: string[];
}

function normalizeImageUrl(src: string) {
  if (!src) return "/placeholder.svg";
  try {
    // If src is already an absolute URL this will succeed
    return new URL(src).toString();
  } catch {
    // Otherwise treat as relative path and ensure it starts with a slash
    if (src.startsWith("/")) return src;
    return `/${src}`;
  }
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

  // Preload images and mark cached ones as loaded (fix for F5 where onLoad
  // may not fire for cached images). Also reset state when `fotos` changes.
  useEffect(() => {
    // initialize loaded flags for new photos
    setImagesLoaded(new Array(fotos.length).fill(false));

    const listeners: Array<{ img: HTMLImageElement; handler: () => void }> = [];

    fotos.forEach((src, i) => {
      const url = normalizeImageUrl(src);
      const img = new Image();
      img.src = url;

      if (img.complete && img.naturalWidth > 0) {
        // already cached / loaded
        setImagesLoaded((prev) => {
          const copy = [...prev];
          copy[i] = true;
          return copy;
        });
      } else {
        const onLoad = () => {
          setImagesLoaded((prev) => {
            const copy = [...prev];
            copy[i] = true;
            return copy;
          });
        };
        img.addEventListener("load", onLoad);
        listeners.push({ img, handler: onLoad });
      }
    });

    return () => {
      listeners.forEach(({ img, handler }) => img.removeEventListener("load", handler));
    };
  }, [fotos]);

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
              src={normalizeImageUrl(image)}
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