import { createSupabaseClient } from "@/supabase/client";

export interface Servicios {
  id: string;
  nombre: string;
  foto: string;
  slug: string;
}

export interface ServiciosWithCount extends Servicios {
  cantidad_telos: number;
}

export async function getServicios(): Promise<{ servicios: Servicios[] }> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("servicios").select("*");

  if (error) {
    console.error("Error fetching servicios:", error);
    return { servicios: [] };
  }

  return { servicios: data || [] };
}

export async function getTelosCountByService(servicioId: string): Promise<number> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("telos_servicios").select("*").eq("servicio_id", servicioId);

  if (error) {
    console.error(
      "Error al obtener el conteo de telos por servicio:",
      error.message
    );
    return 0;
  }

  return data.length;
}
