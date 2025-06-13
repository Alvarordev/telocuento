/* eslint-disable @next/next/no-img-element */

import { Distrito } from "@/services/get-distritos";
import { Servicios } from "@/services/get-servicios";
import Link from "next/link";

interface ZoneCardProps {
  data: Distrito | Servicios;
  hotels: number;
  href: string;
}

function ZoneCard({ data, hotels, href }: ZoneCardProps) {
  return (
    <Link href={href} className=" rounded-lg">
      <div className="flex flex-col gap-1 mt-4">
        <img
          src={data.foto}
          alt="cualquiera"
          className="max-w-[270px] min-h-[240px] object-cover rounded-lg"
        />
        <h3 className="text-lg font-bold">{data.nombre}</h3>
        <p className="text-base font-light">{hotels} hoteles disponibles</p>
      </div>
    </Link>
  );
}

export default ZoneCard;
