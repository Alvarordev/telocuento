import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Container from "../common/container";
import { Input } from "@/components/ui/input";
import TelosCard from "./components/telos-card";
import { Checkbox } from "@/components/ui/checkbox";

function DistrictPage() {
  const telos = [
    { id: 1, name: "Hotel Asturias", district: "Lince", rating: 4.3 },
    { id: 2, name: "Hotel Quadrum", district: "Lince", rating: 4.5 },
    { id: 3, name: "Telos Barranco", district: "Barranco", rating: 4.0 },
    { id: 4, name: "Telos San Miguel", district: "San Miguel", rating: 4.2 },
    { id: 5, name: "Telos Surco", district: "Surco", rating: 4.1 },
    { id: 6, name: "Telos San Isidro", district: "San Isidro", rating: 4.4 },
    { id: 7, name: "Telos Jesús María", district: "Jesús María", rating: 4.3 },
    { id: 8, name: "Telos La Victoria", district: "La Victoria", rating: 4.0 },
    { id: 9, name: "Telos Callao", district: "Callao", rating: 4.2 },
    { id: 10, name: "Telos Comas", district: "Comas", rating: 4.1 },
  ];

  return (
    <Container>
      <div className="w-6xl mx-auto grid grid-cols-4 gap-4 my-10">
        <aside className="col-span-1 border border-gray-200">
            <div className="p-4">
                <p className="font-semibold pb-3">Distrito</p>
                <ul className="flex flex-col gap-1">
                    <li className="flex gap-2 items-center">
                        <Checkbox/>
                        <p>Ate</p>
                    </li>
                    <li className="flex gap-2 items-center">
                        <Checkbox/>
                        <p>Lince</p>
                    </li>
                    <li className="flex gap-2 items-center">
                        <Checkbox/>
                        <p>San Miguel</p>
                    </li>
                    <li className="flex gap-2 items-center">
                        <Checkbox/>
                        <p>Miraflores</p>
                    </li>
                    <li className="flex gap-2 items-center">
                        <Checkbox/>
                        <p>Barranco</p>
                    </li>
                </ul>
            </div>
        </aside>

        <div className="col-span-3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Telos en Lima</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-base">30 hoteles</p>

            <Select>
              <SelectTrigger>
                <span className="text-sm">Ordenar por</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a-z">A - Z</SelectItem>
                <SelectItem value="z-a">Z - A</SelectItem>
                <SelectItem value="rating">Mejor calificación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input placeholder="Buscar por nombre" />

          <div className="grid grid-cols-2 grid-rows-3 gap-4 ">
            {telos.map((telo) => (
                <TelosCard
                  key={telo.id}
                  name={telo.name}
                  district={telo.district}
                  rating={telo.rating}/>
            ))}
        </div>
        </div>
      </div>
    </Container>
  );
}
export default DistrictPage;
