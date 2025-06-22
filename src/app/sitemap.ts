// app/sitemap.ts
import getDistritos from "@/services/get-distritos";
import { getServicios } from "@/services/get-servicios";
import { getTelos } from "@/services/get-telos";
import { MetadataRoute } from "next";

type changeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://teloscuento.com";

  const staticPaths = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date("2025-06-19"),
      changeFrequency: "weekly" as changeFrequency,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/telos`,
      lastModified: new Date("2025-06-19"),
      changeFrequency: "daily" as changeFrequency,
      priority: 0.9,
    },
    // Añade otras páginas estáticas importantes que tengas (ej. /about, /contact, /politicas-de-privacidad)
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date('2025-06-19'),
    //   changeFrequency: 'monthly' as 'monthly',
    //   priority: 0.7,
    // },
  ];


  async function getDistritosFromDB() {
    const distritos = await getDistritos();
    return distritos?.districts?.map((d) => d.slug) || [];
  }

  async function getServiciosFromDB() {
    const servicios = await getServicios();
    return servicios?.servicios?.map((s) => s.slug) || [];
  }

  async function getTelosFromDB() {
    const telos = await getTelos();
    const distritosResponse = await getDistritos();

    if (!telos || !distritosResponse?.districts) {
        return [];
    }

    const telosWithDistricts = telos.map((telo) => {
        const distritoSlug = distritosResponse.districts.find((d) => d.id === telo.distrito_id)?.slug;
        return {
            slug: telo.slug,
            distrito_slug: distritoSlug || "",
            created_at: telo.created_at || new Date(),
        };
    });

    return telosWithDistricts;
  }

  const distritos = await getDistritosFromDB();
  const servicios = await getServiciosFromDB();
  const allTelos = await getTelosFromDB();

  const telosPorDistritoPaths = distritos.map((distrito) => ({
    url: `${baseUrl}/telos/${distrito}`,
    lastModified: new Date(),
    changeFrequency: "daily" as changeFrequency,
    priority: 0.8,
  }));

  const telosPorServicioPaths = servicios.map((servicio) => ({
    url: `${baseUrl}/telos/amenities/${servicio}`,
    lastModified: new Date(),
    changeFrequency: "daily" as changeFrequency,
    priority: 0.8,
  }));

  const specificTelosPaths = allTelos.map((telo) => ({
    url: `${baseUrl}/telos/${telo.distrito_slug}/${telo.slug}`,
    lastModified: telo.created_at || new Date(),
    changeFrequency: "weekly" as changeFrequency,
    priority: 0.9,
  }));

  return [
    ...staticPaths,
    ...telosPorDistritoPaths,
    ...telosPorServicioPaths,
    ...specificTelosPaths,
  ];
}