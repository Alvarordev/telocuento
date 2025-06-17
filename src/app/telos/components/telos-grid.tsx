import { Telo, TeloWithDistrictName } from "@/services/get-telos";
import TelosCard from "./telos-card";
import { Distrito } from "@/services/get-distritos";
import { Skeleton } from "@/components/ui/skeleton";

interface TelosGridProps {
  telos: (TeloWithDistrictName | Telo)[];
  distritos: Distrito[];
  isLoading?: boolean;
}

function TelosGrid({ telos, distritos, isLoading }: TelosGridProps) {
  if (isLoading || telos.length === 0) {
    return (
      <div className="flex flex-col md:grid grid-cols-2 grid-rows-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-4">
            <Skeleton className="h-[320px] w-full md:w-[420px] mb-2" />
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:grid grid-cols-2 grid-rows-3 gap-4 ">
      {telos.map((telo) => (
        <TelosCard
          key={telo.id}
          telo={telo}
          district={distritos.find((d) => d.id === telo.distrito_id)!}
        />
      ))}
    </div>
  );
}

export default TelosGrid;
