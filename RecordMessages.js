const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://dbmp-xbgmorqeur6oh81z.database.nocode.cn";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ2OTc5MjAwLCJleHAiOjE5MDQ3NDU2MDB9.11QbQ5OW_m10vblDXAlw1Qq7Dve5Swzn12ILo7-9IXY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const messagesTable = supabase.from("Messages");

class RecordMessages {
    static async recordMessage(obj) {
        return await messagesTable.insert(obj);
    }
}

module.exports = RecordMessages;