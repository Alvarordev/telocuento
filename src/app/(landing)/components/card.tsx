interface CardProps {
    name: string;
    rating: number;
    district: string;
    image?: string;
}

function Card({name, rating, district}: CardProps) {
    return(
        <div className="">
            <div className="bg-gray-400 min-w-[270px] w-full min-h-80 rounded-lg" >a</div>

            <div className="flex flex-col gap-1 mt-4">
                <h3 className="text-lg font-bold">{name}</h3>
                <p className="text-base font-light">{district}</p>
                <p>⭐ {rating}</p>
            </div>
        </div>
    )
}

export default Card