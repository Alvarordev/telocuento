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
import Container from "@/app/common/container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TelosGrid from "../components/telos-grid";

async function DistrictPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
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
      <div className="flex flex-col px-2 md:w-6xl mx-auto md:grid grid-cols-4 gap-4 my-10">
        <aside className="hidden md:flex flex-col col-span-1 border border-gray-200 shadow-sm self-start">
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
          <Link
            href="/telos"
            className="flex space-x-2 items-center text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="underline">Ver todos los hoteles</span>
          </Link>
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

          <TelosGrid telos={filteredTelos} distritos={distritos.districts} />
        </div>
      </div>
    </Container>
  );
}
export default DistrictPage;
