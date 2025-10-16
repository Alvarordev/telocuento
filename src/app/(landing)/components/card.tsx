/* eslint-disable @next/next/no-img-element */
import { Distrito } from "@/services/get-distritos";
import { Telo } from "@/services/get-telos";
import Link from "next/link";

interface CardProps {
    telo: Telo;
    district: Distrito;
}

function Card({telo, district}: CardProps) {
    function normalizeImageUrl(src: string) {
        if (!src) return "/placeholder.svg";
        try {
            return new URL(src).toString();
        } catch {
            if (src.startsWith("/")) return src;
            return `/${src}`;
        }
    }
    return(
        <Link href={`/telos/${district.slug}/${telo.slug}`}>
            <img src={normalizeImageUrl(telo.fotos[0])} alt={telo.slug}  className="rounded-lg h-80 w-full md:w--auto md:w-[270px] object-cover" />

            <div className="flex flex-col mt-4 mb-2">
                <h3 className="text-lg font-bold">{telo.nombre}</h3>
                <p className="text-base font-light">{district.nombre}</p>
                <p>⭐ {telo.stars}</p>
            </div>
        </Link>
    )
}

export default Card