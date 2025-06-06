import { Skeleton } from "@/components/ui/skeleton";

interface TelosCardProps {
  name: string;
  district: string;
  rating: number;
}

function TelosCard({ name, district, rating }: TelosCardProps) {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-[321px] w-full rounded-lg" />
      <div className="flex flex-col gap-0.5 mt-2">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-500">{district}</p>
        <p className="text-gray-500">⭐ {rating}</p>
      </div>
    </div>
  );
}
export default TelosCard;
