import Card from "./components/card";
import ZoneCard from "./components/zone-card";
import { MapPin, Search, Users } from "lucide-react";
import Container from "../common/container";
import getDistritos from "@/services/get-distritos";
import { getTelos, getTelosWithRange } from "@/services/get-telos";
import Carousel from "./components/carousel";
import { getServicios, getTelosCountByService } from "@/services/get-servicios";
import { DistrictPicker } from "./components/district-picker";
import Link from "next/link";

export default async function Home() {
  const distritos = await getDistritos();
  const servicios = await getServicios();
  const telos = await getTelosWithRange(3);
  const hoteles = await getTelos();

  async function amountOfTelos(servicio_id: string) {
    const telosCount = await getTelosCountByService(servicio_id);
    return telosCount;
  }

  return (
    <Container>
      <section className="bg-[#111827] text-white px-4 lg:p-0">
        <div className="md:w-2xl mx-auto flex flex-col gap-2 py-16">
          <h2 className="text-sm">TELOS Y ALOJAMIENTOS EN LIMA</h2>
          <h1 className="md:text-4xl text-3xl font-bold">
            Encuentra telos en Lima
          </h1>
          <p className="text-sm md:text-base pb-4 md:pb-4">
            Busca tu alojamiento ideal en Lima. Ahora encontrar un telo es más
            fácil que nunca
          </p>
          <DistrictPicker distritos={distritos.districts} />

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 pt-8 overflow-hidden">
            <p className="text-sm font-semibold">Más buscados: </p>
            <div className="flex items-center gap-2">
              <Link
                href={"/telos/lince"}
                className="text-black bg-secondary py-2 text-sm rounded-2xl px-4 md:px-6 hover:bg-primary hover:text-card transition-all"
              >
                Lince
              </Link>
              <Link
                href={"/telos/amenities/estacionamiento"}
                className="text-black bg-secondary py-2 text-sm rounded-2xl px-4 md:px-6 hover:bg-primary hover:text-card transition-all"
              >
                Estacionamiento
              </Link>
              <Link
                href={"/telos/san-miguel"}
                className="text-black bg-secondary py-2 text-sm rounded-2xl px-4 md:px-6 hover:bg-primary hover:text-card transition-all text-nowrap"
              >
                San Miguel
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Busca un hostal</h3>
              <p className="text-gray-600">
                Filtra cientos de hostales por distritos, zonas, rating y
                servicios
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
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
              <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
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

      <section className="pb-10 md:pb-16">
        <div className="md:w-6xl mx-auto px-2 md:px-0">
          <h2 className="text-3xl font-bold">Alojamientos más vistos</h2>
          <div className="flex flex-col gap-4 md:gap-0 md:flex-row mt-6">
            {telos.map((telo) => (
              <div key={telo.id} className="md:w-1/4 md:flex-shrink-0">
                <Card
                  key={telo.id}
                  telo={telo}
                  district={
                    distritos.districts.find((d) => d.id === telo.distrito_id)!
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="md:w-6xl mx-auto pb-10 md:pb-16 px-2 md:px-0">
          <h2 className="text-3xl font-bold mb-3">Busca por distrito</h2>
          <p>Encuentra alojamiento en los distintos distritos de Lima</p>
          <div className="flex mt-2">
            <Carousel distritos={distritos.districts} hoteles={hoteles} />
          </div>
        </div>
      </section>

      <section className="md:pb-16">
        <div className="md:w-6xl mx-auto pb-16 px-2 md:p-0">
          <h2 className="text-3xl font-bold mb-3">Comodidades</h2>
          <p>Encuentra servicios de estacionamiento, jacuzzi, tragos, etc.</p>
          <div className="flex justify-between flex-wrap md:flex-nowrap mt-2 md:gap-2 md:mb-6">
            {servicios.servicios.map((servicio) => (
              <div key={servicio.id} className="w-full md:w-1/4">
                <ZoneCard
                  data={servicio}
                  hotels={amountOfTelos(servicio.id)}
                  href={`/telos/amenities/${servicio.slug}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
