"use server"

import { createSupabaseClient } from "@/supabase/auth/server";

export async function loginAction(formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const {auth} = await createSupabaseClient();

        const { error } = await auth.signInWithPassword({email, password});

        if (error) throw error
    } catch (error) {
        return { errorMessage: (error as Error).message };
    }
}