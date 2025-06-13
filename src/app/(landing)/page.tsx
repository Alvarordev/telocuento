import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Card from "./components/card";
import ZoneCard from "./components/zone-card";
import { MapPin, Search, Users } from "lucide-react";
import Container from "../common/container";
import getDistritos from "@/services/get-distritos";
import getServicios from "@/services/get-servicios";
import { getTelos } from "@/services/get-telos";

export default async function Home() {
  const distritos = await getDistritos();
  const servicios = await getServicios();
  const telos = await getTelos();

  return (
    <Container>
      <section className="bg-[#111827] text-white">
        <div className="w-2xl mx-auto flex flex-col gap-2 py-16">
          <h2 className="text-sm">Telos y alojamientos en Lima</h2>
          <h1 className="text-4xl font-bold">Encuentra telos en Lima</h1>
          <p>
            Busca tu alojamiento ideal en Lima. Ahora encontrar un telo es más
            fácil que nunca
          </p>
          <div className="flex">
            <Select>
              <SelectTrigger className="w-full text-base bg-white">
                <SelectValue placeholder="Distrito" className="text-black" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {distritos.districts.map((district) => (
                    <SelectItem key={district.id} value={district.slug}>
                      {district.nombre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="secondary"
              className="cursor-pointer ml-4 text-base bg-pink-100 px-8 font-semibold"
            >
              Buscar
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-8">
            <p className="text-sm font-semibold">Más buscados: </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="cursor-pointer text-sm rounded-2xl px-6"
              >
                Lince
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="cursor-pointer text-sm rounded-2xl px-6"
              >
                Estacionamiento
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="cursor-pointer text-sm rounded-2xl px-6"
              >
                Ate
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Busca un hostal</h3>
              <p className="text-gray-600">
                Filtra cientos de hostales por distritos, zonas, rating y
                servicios
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Revisa los detalles
              </h3>
              <p className="text-gray-600">
                Encuentra tu hostal ideal revisando la información detallada del
                lugar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ponte en contacto</h3>
              <p className="text-gray-600">
                Revisa los detalles de los turnos y simplemente contacta al
                hostal
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Alojamientos más vistos</h2>
          <div className="flex justify-between flex-wrap mt-6">
            {telos.map((telo) => (
              <Card
                key={telo.id}
                telo={telo}
                district={
                  distritos.districts.find((d) => d.id === telo.distrito_id)!
                }
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="w-6xl mx-auto pb-16">
          <h2 className="text-3xl font-bold mb-3">Busca por distrito</h2>
          <p>Encuentra alojamiento en los distintos distritos de Lima</p>
          <div className="flex justify-between flex-wrap mt-6">
            {distritos.districts.map((distrito) => (
              <ZoneCard
                key={distrito.id}
                data={distrito}
                hotels={10}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="w-6xl mx-auto pb-16">
          <h2 className="text-3xl font-bold mb-3">Comodidades</h2>
          <p>Encuentra servicios de estacionamiento, jacuzzi, tragos, etc.</p>
          <div className="flex justify-between flex-wrap mt-6">
            {servicios.servicios.map((servicio) => (
              <ZoneCard
                key={servicio.id}
                data={servicio}
                hotels={10}
              />
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
