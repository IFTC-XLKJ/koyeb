import { supabase, messagesTable } from "./shared.ts";

export default class RecordMessages {
    constructor() {}
    static async recordMessage(obj: Object): Promise<Object> {
        return await messagesTable.insert(obj);
    }
}