import { Metadata } from "next";
import getDistritos from "@/services/get-distritos";

interface DistrictPageProps {
  params: Promise<{
    district: string;
  }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: DistrictPageProps): Promise<Metadata> {
  const { district: currentDistrictSlug } = await params;

  const distritosData = await getDistritos();

  const districtData = distritosData.districts.find(
    (d) => d.slug === currentDistrictSlug
  );

  const title = districtData
    ? `Telos en ${districtData.nombre} - Teloscuento`
    : "Telos por Distrito - Teloscuento";
  const description = districtData
    ? `Encuentra los mejores telos en ${districtData.nombre} en Lima. Descubre opciones y servicios.`
    : "Explora telos y hoteles por distrito en Lima. Tu guía para encontrar el lugar perfecto.";

  const keywords = [
    "telos",
    "hoteles",
    "reservas",
    "Lima",
    "telos en " + districtData?.nombre.toLowerCase(),
  ].filter(Boolean);

  const imageUrl = "/placeholder-district.svg";
  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `https://teloscuento.com/telos/${currentDistrictSlug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://teloscuento.com/telos/${currentDistrictSlug}`,
      siteName: "Teloscuento",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Telos en ${districtData?.nombre || currentDistrictSlug}`,
        },
      ],
      locale: "es_PE",
      type: "website",
    },
  };
}

export default function DistrictLayout({
  children,
}: DistrictPageProps & { children: React.ReactNode }) {
  return <>{children}</>;
}
