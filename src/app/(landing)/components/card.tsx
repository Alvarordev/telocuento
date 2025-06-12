import { Distrito } from "@/services/get-distritos";
import { Telo } from "@/services/get-telos";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
    telo: Telo;
    district: Distrito;
}

function Card({telo, district}: CardProps) {
    return(
        <Link href={`/telos/${district.slug}/${telo.slug}`}>
            <Image src={telo.fotos[0]} alt={telo.slug} width={270} height={320}  className="rounded-lg max-h-80 object-cover" />

            <div className="flex flex-col gap-1 mt-4">
                <h3 className="text-lg font-bold">{telo.nombre}</h3>
                <p className="text-base font-light">{district.nombre}</p>
                <p>⭐ {telo.stars}</p>
            </div>
        </Link>
    )
}

export default Card