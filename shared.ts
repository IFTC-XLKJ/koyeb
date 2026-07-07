import Sign from "./Sign.ts";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Singleton Sign instance - shared across all modules
export const sign: Sign = new Sign();

// Singleton Supabase client - shared across all modules
const SUPABASE_URL: string = "https://dbmp-xbgmorqeur6oh81z.database.nocode.cn";
const SUPABASE_ANON_KEY: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ2OTc5MjAwLCJleHAiOjE5MDQ3NDU2MDB9.11QbQ5OW_m10vblDXAlw1Qq7Dve5Swzn12ILo7-9IXY";
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const messagesTable = supabase.from("Messages");
export const avatarBucket = supabase.storage.from("avatar");