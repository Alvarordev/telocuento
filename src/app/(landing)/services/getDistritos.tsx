import { createSupabaseClient } from "@/supabase/client";

interface Distrito {
    id: string;
    nombre: string;
    slug?: string;
    foto: string;
}

async function getDistritos(): Promise<{ districts: Distrito[] }> {
    const supabase = createSupabaseClient();

    const { data, error} = await supabase
          .from("distritos")
          .select("*");

    if (error) {
        console.error("Error fetching distritos:", error);
        return { districts: [] };
    }

    return { districts: data || [] };
}

export default getDistritos;