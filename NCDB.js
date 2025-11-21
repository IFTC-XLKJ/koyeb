const { createClient } = require("@supabase/supabase-js");

class NCDB {
    SUPABASE_URL;
    SUPABASE_ANON_KEY;
    supabase;
    /**
     * 初始化
     * @param {String} url 
     * @param {String} key 
     */
    constructor(url, key) {
        this.SUPABASE_URL = url;
        this.SUPABASE_ANON_KEY = key;
        this.supabase = createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
        const that = this;
        this.Channel = class Channel {
            table;
            name;
            /**
             * 频道
             * @param {String} name
             * @param {String} table
             */
            constructor(name, table) {
                this.table = table;
                this.name = name;
                this.channel = that.supabase.channel(name);
            }
            /**
             * 监听数据变化
             * @param {String} event 
             * @param {Function} callback 
             * @param {Object} filter 
             */
            on(event, callback, filter) {
                this.channel.on("postgres_changes", { event: event, schema: "public", table: this.table, filter }, callback)
                    .subscribe();
            }
        };
    }
    formatMore(more) {
        let moreStr = "";
        if (more) {
            for (const m of more) {
                moreStr += `.${m.type}("${m.col}", ${typeof m.value == "string" ? `"${m.value}"` : m.value})`;
            }
        }
        return moreStr;
    }
    /**
     * 查询数据
     * @param {Object} options 
     * @returns 
     */
    async query(options) {
        const { table, select = "*", more } = options;
        console.log("query", options);
        const queryFun = eval(`this.supabase
            .from(table)
            .select(select)
            ${this.formatMore(more)}`);
        const { data, error } = await queryFun;
        if (error) return error;
        else return data;
    }
    /**
     * 插入数据
     * @param {Object} options 
     * @returns 
     */
    async insert(options) {
        const { table, data, upsert, more } = options;
        console.log("insert", options);
        const insertFun = eval(`this.supabase
            .from(table)
            ${upsert ? ".upsert(data)" : ".insert(data)"}
            ${this.formatMore(more)}`);
        const { data: insertData, error } = await insertFun;
        if (error) return error;
        else return insertData;
    }
    /**
     * 更新数据
     * @param {Object} options 
     * @returns 
     */
    async update(options) {
        const { table, data, more } = options;
        console.log("update", options);
        const updateFun = eval(`this.supabase
            .from(table)
            .update(data)
            ${this.formatMore(more)}`);
        const { data: updateData, error } = await updateFun;
        if (error) return error;
        else return updateData;
    }
    /**
     * 删除数据
     * @param {Object} options 
     * @returns 
     */
    async delete(options) {
        const { table, more } = options;
        console.log("delete", options);
        const deleteFun = eval(`this.supabase
            .from(table)
            .delete()
            ${this.formatMore(more)}`);
        const { data: deleteData, error } = await deleteFun;
        if (error) return error;
        else return deleteData;
    }
    /**
     * 上传文件
     * @param {Object} options 
     * @returns 
     */
    async uploadFile(options) {
        const { table, file = new File([], "file"), path = "file" } = options;
        console.log("uploadFile", options);
        const { error: uploadError } = await this.supabase.storage
            .from(table)
            .upload(path, file);
        console.log(uploadError);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = this.supabase.storage
            .from(table)
            .getPublicUrl(path);
        return publicUrl;
    }
    /**
     * 
     * @param {Object} options 
     * @returns Promise<Object>
     */
    async deleteFile(options) {
        const { table, path = "path" } = options;
        console.log("deleteFile", options);
        const { data, error: removeError } = await this.supabase.storage
            .from(table)
            .remove([path]);
        if (removeError) throw removeError;
        return data;
    }
}
module.exports = NCDB;