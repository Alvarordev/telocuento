import Container from "@/app/common/container";
import getTelos from "../../services/getTelos";
import {
  AirVent,
  Bath,
  Coffee,
  Star,
  Tv,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FotoCarousel from "./components/foto-carousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import MapEmbed from "@/app/common/mapEmbed";
import getDistritos from "@/services/get-distritos";
import { Metadata } from "next";

interface PageProps {
  district: string;
  telo_slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageProps>;
}): Promise<Metadata> {
  const telos = await getTelos();
  const distritos = await getDistritos();

  const { district, telo_slug } = await params;

  const districtData = distritos.districts.find((d) => d.slug === district);
  const telo = telos.find((t) => t.slug === telo_slug);

  if (!telo) {
    return {
      title: "Telo no encontrado - Teloscuento",
      description: "Lo sentimos, el telo que buscas no está disponible.",
    };
  }

  const title = `${telo.nombre} en ${
    districtData?.nombre || district
  } - Teloscuento`;
  const description = `${telo.descripcion.substring(
    0,
    150
  )}... Reserva tu experiencia en ${telo.nombre} en ${
    districtData?.nombre || district
  }, Lima.`;
  const imageUrl =
    telo.fotos && telo.fotos.length > 0 ? telo.fotos[0] : "/placeholder.svg";
  const canonicalUrl = `https://teloscuento.com/telos/${district}/${telo.slug}`;

  return {
    title: title,
    description: description,
    keywords: [
      telo.nombre.toLowerCase(),
      districtData?.nombre.toLowerCase() || "",
      "telos",
      "hoteles",
      "reservas",
      "Lima",
      telo.slug.toLowerCase(),
      "telo de lujo",
      "motería",
      "servicios exclusivos",
      "telos en " + (districtData?.nombre || district),
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: "Teloscuento",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${telo.nombre} en ${districtData?.nombre || district}`,
        },
      ],
      locale: "es_PE",
      type: "article",
    },
  };
}

async function TeloPage({
  params,
}: {
  params: Promise<{ district: string; telo_slug: string }>;
}) {
  const telos = await getTelos();
  const distritos = await getDistritos();

  const { district, telo_slug } = await params;

  const districtData = distritos.districts.find((d) => d.slug === district);

  const telo = telos.find((t) => t.slug === telo_slug);

  if (!telo) {
    return (
      <Container>
        <div className="text-center w-6xl mx-auto py-10">
          <h1 className="text-3xl font-bold">Telo no encontrado</h1>
          <p className="text-gray-500">
            Lo sentimos, no pudimos encontrar el telo solicitado.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="px-2 md:px-0 md:w-6xl mx-auto flex flex-col gap-2 py-10">
        <header className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList className="text-base">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={"/telos"}>Telos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/telos/${district}`}>
                    {districtData?.nombre}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{telo?.nombre}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold">{telo?.nombre}</h1>
          <div className="flex gap-2 items-center">
            <Star className="h-4 w-4 text-yellow-500" />
            <p>{telo?.stars} (reseñas en google)</p>
          </div>
        </header>

        <section className="py-4">
          <FotoCarousel fotos={telo!.fotos} />
        </section>

        <div className="grid lg:grid-cols-4 gap-8 py-4 lg:py-6 pt-0">
          <div className="lg:col-span-3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">
                {telo?.descripcion}
              </p>
            </section>

            <section className="lg:col-span-1 md:hidden mb-8">
              <div className="space-y-4">
                <Card>
                  <CardContent className="px-6 py-2">
                    <h3 className="text-xl font-bold mb-4">Turnos</h3>
                    <div className="space-y-3">
                      {telo?.turnos.map((turno) => (
                        <div
                          key={turno.descripcion}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-700">
                            {turno.descripcion}
                          </span>
                          <span className="font-semibold">
                            {turno.duracion_horas}hs
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardContent className="px-6 py-2">
                    <h3 className="text-xl font-bold mb-4">Precios</h3>
                    <div className="space-y-3 mb-6">
                      {telo?.precios.map((precio) => (
                        <div
                          key={precio.tipo}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-700">{precio.tipo}</span>
                          <span className="font-semibold">
                            S/. {precio.precio}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      💬 contactar
                    </Button>

                    <p className="text-xs text-gray-500 mt-3">
                      Las tarifas son orientativas y pueden sufrir
                      modificaciones y/o actualizaciones que no se vean
                      reflejadas en esta página. Ante cualquier duda consulte al
                      momento de ingresar al Hotel.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Servicios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <AirVent className="w-5 h-5 text-gray-600" />
                  <span>Aire acondicionado</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <span>Batas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-gray-600" />
                  <span>Cafetería</span>
                </div>
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="w-5 h-5 text-gray-600" />
                  <span>Comidas disponibles</span>
                </div>
                <div className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-gray-600" />
                  <span>Hidromasajes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Tv className="w-5 h-5 text-gray-600" />
                  <span>Televisión codificada</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span>Tragos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-gray-600" />
                  <span>Wifi</span>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
              <p className="text-gray-600 mb-4">{telo?.ubicacion}</p>
              <MapEmbed address={telo?.ubicacion} />
            </section>
          </div>

          <div className="lg:col-span-1 hidden md:block">
            <div className="sticky top-6 space-y-4">
              <Card>
                <CardContent className="px-6 py-2">
                  <h3 className="text-xl font-bold mb-4">Turnos</h3>
                  <div className="space-y-3">
                    {telo?.turnos.map((turno) => (
                      <div
                        key={turno.descripcion}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700">
                          {turno.descripcion}
                        </span>
                        <span className="font-semibold">
                          {turno.duracion_horas}hs
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardContent className="px-6 py-2">
                  <h3 className="text-xl font-bold mb-4">Precios</h3>
                  <div className="space-y-3 mb-6">
                    {telo?.precios.map((precio) => (
                      <div
                        key={precio.tipo}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700">{precio.tipo}</span>
                        <span className="font-semibold">
                          S/. {precio.precio}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    💬 contactar
                  </Button>

                  <p className="text-xs text-gray-500 mt-3">
                    Las tarifas son orientativas y pueden sufrir modificaciones
                    y/o actualizaciones que no se vean reflejadas en esta
                    página. Ante cualquier duda consulte al momento de ingresar
                    al Hotel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default TeloPage;
