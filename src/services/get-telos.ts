import { createSupabaseClient } from "@/supabase/client";

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
    stars: number
}

async function getTelos(): Promise<Telo[]> {
    const supabase = createSupabaseClient();

    const {data, error} = await supabase.from("telos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error fetching telos:", error);
        return [];
    }
    return data || [];
}

export default getTelos;