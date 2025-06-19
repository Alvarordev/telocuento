import { createSupabaseClient } from "@/supabase/client";
import { Distrito } from "./get-distritos";

export interface Telo {
  id: string;
  nombre: string;
  descripcion: string;
  precios: Array<{ tipo: string; precio: number }>;
  turnos: Array<{ descripcion: string; duracion_horas: number; costo: number }>;
  ubicacion: string;
  fotos: Array<string>;
  distrito_id: string;
  slug: string;
  stars: number;
  servicios_relacion?: { servicio_id: string }[];
  created_at?: string;
}

interface TeloSupabaseResponse extends Telo {
  telos_servicios: { servicio_id: string }[];
  servicios_relacion?: undefined;
}

export interface TeloWithDistrictName extends Omit<Telo, "distrito_id"> {
  distrito_id: Distrito;
}

export interface Telos_Servicios {
  id: string;
  telo_id: string;
  servicio_id: string;
}

export async function getTelos(): Promise<Telo[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("telos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching telos:", error);
    return [];
  }
  return data || [];
}

export async function getTelosWithRange(range = 1000): Promise<Telo[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("telos")
    .select("*")
    .order("id", { ascending: true })
    .range(0, range);

  if (error) {
    console.error("Error fetching telos:", error);
    return [];
  }
  return data || [];
}

export async function getTelosWithServices(): Promise<Telo[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("telos")
    .select(
      `
      *,
      telos_servicios (
        servicio_id
      )
      `
    )
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching telos with services:", error);
    return [];
  }

  const mappedData: Telo[] = data.map((teloResponse: TeloSupabaseResponse) => {
    const { telos_servicios, ...rest } = teloResponse;

    const newTelo: Telo = {
      ...rest,
      servicios_relacion: telos_servicios.map((ts) => ({
        servicio_id: ts.servicio_id,
      })),
    };

    return newTelo;
  });

  return mappedData || [];
}

export async function getTelosWithDistrict(
  selectedDistrictIds: string[] = [],
  selectedServiceIds: string[] = []
): Promise<TeloWithDistrictName[]> {
  const supabase = createSupabaseClient();
  let query = supabase.from("telos").select("*");

  if (selectedDistrictIds.length > 0) {
    query = query.in("distrito_id", selectedDistrictIds);
  }

  if (selectedServiceIds.length > 0) {
    const { data: teloServices, error: teloServicesError } = await supabase
      .from("telos_servicios")
      .select("telo_id")
      .in("servicio_id", selectedServiceIds);

    if (teloServicesError) {
      console.error(
        "Error fetching telo_servicios for filtering:",
        teloServicesError.message
      );
      return [];
    }

    const teloIdsWithSelectedServices = teloServices.map((ts) => ts.telo_id);

    if (teloIdsWithSelectedServices.length === 0) {
      return [];
    }

    query = query.in("id", teloIdsWithSelectedServices);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching telos:", error.message);
    return [];
  }
  return data as TeloWithDistrictName[];
}
