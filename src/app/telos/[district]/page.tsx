import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import getTelos from "../services/getTelos";
import getDistritos from "../services/getDistritos";
import getServicios from "../services/getServicios";
import TelosCard from "../components/telos-card";
import Container from "@/app/common/container";

async function DistrictPage({ params }: { params: Promise<{ district: string }> }) {
  const telos = await getTelos();
  const distritos = await getDistritos();
  const servicios = await getServicios();

  const { district } = await params;

  const districtData = distritos.districts.find((d) => d.slug === district);

  const filteredTelos = telos.filter(
    (telo) =>
      distritos.districts.find((district) => district.id === telo.distrito_id)
        ?.slug === district
  );

  if (!districtData) {
    return (
      <Container>
        <div className="text-center w-6xl mx-auto py-10">
          <h1 className="text-3xl font-bold">Distrito no encontrado</h1>
          <p className="text-gray-500">
            Lo sentimos, no pudimos encontrar el distrito solicitado.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-6xl mx-auto grid grid-cols-4 gap-4 my-10">
        <aside className="flex flex-col col-span-1 border border-gray-200 shadow-sm self-start">
          <div className="p-4">
            <p className="font-semibold pb-3">Ubicación</p>
            <ul className="flex flex-col gap-1">
              {distritos.districts.map((district) => (
                <li className="flex gap-2 items-center" key={district.id}>
                  <Checkbox />
                  <p>{district.nombre}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4">
            <p className="font-semibold pb-3">Servicios</p>
            <ul className="flex flex-col gap-1">
              {servicios.servicios.map((servicio) => (
                <li className="flex gap-2 items-center" key={servicio.id}>
                  <Checkbox />
                  <p>{servicio.nombre}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="col-span-3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Telos en {districtData.nombre}</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-base">
              {filteredTelos.length} hotel(es)
            </p>

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
            {filteredTelos.map((telo) => (
              <TelosCard
                key={telo.id}
                telo={telo}
                district={
                  distritos.districts.find((d) => d.id === telo.distrito_id)!
                }
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
export default DistrictPage;
