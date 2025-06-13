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
}

export interface TeloWithDistrictName extends Omit<Telo, 'distrito_id'> {
  distrito_id: Distrito; 
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

export async function getFilteredTelos(
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
