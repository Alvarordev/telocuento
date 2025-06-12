/* eslint-disable @next/next/no-img-element */

interface ZoneCardProps {
    district: string;
    image: string;
    hotels: number;
}

function ZoneCard({district, image, hotels}: ZoneCardProps) {
    return (
        <div className=" rounded-lg">
            <div className="flex flex-col gap-1 mt-4">
                <img src={image} alt="cualquiera" className="max-w-[270px] min-h-[240px] object-cover rounded-lg"/>
                <h3 className="text-lg font-bold">{district}</h3>
                <p className="text-base font-light">{hotels} hoteles disponibles</p>
            </div>
        </div>
    )
}

export default ZoneCard;