/* eslint-disable @next/next/no-img-element */
import { Distrito } from "@/services/get-distritos";
import { Telo } from "@/services/get-telos";
import Link from "next/link";

interface CardProps {
    telo: Telo;
    district: Distrito;
}

function Card({telo, district}: CardProps) {
    return(
        <Link href={`/telos/${district.slug}/${telo.slug}`}>
            <img src={telo.fotos[0]} alt={telo.slug}  className="rounded-lg h-80 w-full object-cover" />

            <div className="flex flex-col gap-1 mt-4">
                <h3 className="text-lg font-bold">{telo.nombre}</h3>
                <p className="text-base font-light">{district.nombre}</p>
                <p>⭐ {telo.stars}</p>
            </div>
        </Link>
    )
}

export default Card