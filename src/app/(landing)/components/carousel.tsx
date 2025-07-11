"use client";
import { Distrito } from "@/services/get-distritos";
import { useRef, useState, useEffect } from "react";
import ZoneCard from "./zone-card";
import { Telo } from "@/services/get-telos";

interface Props {
  distritos: Distrito[];
  hoteles: Telo[];
}

function Carousel({ distritos, hoteles }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(1);
  const REAL_VISIBLE_ITEMS_MD = 4;

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

  if (distritos.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay distritos disponibles
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 pb-2"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // Internet Explorer 10+
        }}
      >
        {distritos.map((distrito) => (
          <div
            key={distrito.id}
            className="flex-shrink-0 w-full md:w-1/4"
            style={{
              minWidth: itemsPerView === 1 ? '100%' : '25%'
            }}
          >
            <ZoneCard
              data={distrito}
              hotels={getDistritoAmountOfTelos(distrito.id)}
              href={`/telos/${distrito.slug}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;