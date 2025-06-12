import { createSupabaseClient } from "@/supabase/client";

export interface Servicios {
    id: string;
    nombre: string;
    foto: string;
    slug: string;
}

async function getServicios(): Promise<{ servicios: Servicios[] }> {
    const supabase = createSupabaseClient();

    const { data, error} = await supabase
          .from("servicios")
          .select("*");

    if (error) {
        console.error("Error fetching servicios:", error);
        return { servicios: [] };
    }

    return { servicios: data || [] };
}

export default getServicios;