/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Distrito } from "../services/getDistritos";

interface TelosCardProps {
  name: string;
  district: Distrito;
  rating: number;
  slug: string;
  foto: string;
}

function TelosCard({ name, district, rating, slug, foto }: TelosCardProps) {
  return (
    <Link href={`/telos/${district.slug}/${slug}`} className="flex flex-col">
      <img src={foto} alt={name} className="h-[321px] w-full rounded-lg" />
      <div className="flex flex-col gap-0.5 mt-2">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-500">{district.nombre}</p>
        <p className="text-gray-500">⭐ {rating}</p>
      </div>
    </Link>
  );
}
export default TelosCard;
