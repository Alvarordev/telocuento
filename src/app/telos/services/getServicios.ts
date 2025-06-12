import { createSupabaseClient } from "@/supabase/client";

interface Servicios {
    id: string;
    nombre: string;
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