/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Distrito } from "../services/getDistritos";
import { Star } from "lucide-react";
import { Telo, TeloWithDistrictName } from "@/services/get-telos";

interface TelosCardProps {
  telo: TeloWithDistrictName | Telo;
  district: Distrito;
}

function TelosCard({ telo, district }: TelosCardProps) {
  if (!district) {
    return null;
  }

  return (
    <Link
      href={`/telos/${district.slug}/${telo.slug}`}
      className="flex flex-col"
    >
      <img
        src={telo.fotos[0]}
        alt={telo.slug}
        className="h-[321px] w-full rounded-lg object-cover"
      />
      <div className="flex flex-col gap-0.5 mt-2">
        <h3 className="text-lg font-bold">{telo.nombre}</h3>
        <p className="text-gray-500">{district.nombre}</p>
        <div className="flex gap-2 items-center text-gray-500">
          <Star className="inline h-4 w-4 text-yellow-500" />
          {telo.stars}
        </div>
      </div>
    </Link>
  );
}
export default TelosCard;
