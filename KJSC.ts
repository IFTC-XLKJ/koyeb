import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://dbmz1b27dzr6u9pi9g.database.nocode.cn",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ2OTc5MjAwLCJleHAiOjE5MDQ3NDU2MDB9.6syOikzLorGQ3q_SIUvqGctC1h6aaQDYxd-hBNygi30",
);

const forumsBase = supabase.from("forums");

export class KJSC {
    async publishPost() {}
}
