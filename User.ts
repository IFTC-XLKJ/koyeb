import { sign } from "./shared.ts";
import crypto from "crypto";
import type {
    GetAllUsersResponse,
    GetByIDResponse,
    SearchResponse,
    UserLoginResponse,
    UserRegisterResponse,
    UserResponse,
} from "./types.ts";

const VVZHkey: string =
    "LkduYVIN+ZWY+y+kN565pfAF4JJRhfpNk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOjMsGiImi0mbmolRNbRck3er4BHin3lsS3b1WYXDgY826RZEvDia4yFo15DuJZVFC0=";
const getDataURL: string = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL: string = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType: string = "application/json";

function md5Hash(input: string): string {
    const hash: crypto.Hash = crypto.createHash("md5");
    hash.update(input);
    return hash.digest("hex");
}

export default class User {
    constructor() {}
    async getByID(id: number): Promise<GetByIDResponse> {
        return (await this.fetchData(getDataURL, {
            filter: `ID=${id}`,
            page: 1,
            limit: 1,
        })) as GetByIDResponse;
    }
    async search(keyword: string): Promise<SearchResponse> {
        return (await this.fetchData(getDataURL, {
            filter: `昵称 LIKE "%${keyword}%" OR 邮箱 LIKE "%${keyword}%" OR ID LIKE "%${keyword}%" OR 头衔 LIKE "%${keyword}%"`,
            page: 1,
            limit: 100,
        })) as SearchResponse;
    }
    async getAll(): Promise<GetAllUsersResponse> {
        return (await this.fetchData(getDataURL, {
            page: 1,
            limit: 1000,
        })) as GetAllUsersResponse;
    }
    async login(user: string | number, password: string): Promise<UserLoginResponse> {
        return (await this.fetchData(getDataURL, {
            filter: `(ID="${user}" OR 昵称="${user}" OR 邮箱="${user}") AND 密码="${md5Hash(password)}"`,
            page: 1,
            limit: 1,
        })) as UserLoginResponse;
    }
    async register(
        email: string,
        nickname: string,
        avatar: string,
        password: string,
    ): Promise<UserRegisterResponse> {
        // Check email uniqueness via API instead of loading all users
        const emailCheck = await this.fetchData(getDataURL, {
            filter: `邮箱="${email}"`,
            page: 1,
            limit: 1,
        }) as GetByIDResponse;
        if (emailCheck.code === 200 && emailCheck.fields.length > 0) {
            return {
                code: 400,
                msg: "邮箱已被注册",
                logid: "",
                createdAt: 0,
                count: 0,
                fields: [],
                sql: "",
            };
        }

        // Check nickname uniqueness via API instead of loading all users
        const nicknameCheck = await this.fetchData(getDataURL, {
            filter: `昵称="${nickname}"`,
            page: 1,
            limit: 1,
        }) as GetByIDResponse;
        if (nicknameCheck.code === 200 && nicknameCheck.fields.length > 0) {
            return {
                code: 400,
                msg: "昵称已被注册",
                logid: "",
                createdAt: 0,
                count: 0,
                fields: [],
                sql: "",
            };
        }

        // Get next available ID
        const all: GetAllUsersResponse = await this.getAll();
        if (all.code != 200) throw new Error(all.msg);
        const count: number = all.fields.length > 0 ? all.fields[0].ID + 1 : 1;

        const body: Object = {
            type: "INSERT",
            filter: `ID,昵称,头像,邮箱,密码,V币,头衔,头衔色`,
            fields: `("${count}","${nickname}","${avatar}","${email}","${md5Hash(password)}",0,"用户","#1BC514FF")`,
        };
        return (await this.fetchData(setDataURL, body)) as UserRegisterResponse;
    }
    async setTelegram(ID: number, telegram: number) {
        return (await this.fetchData(setDataURL, {
            type: "UPDATE",
            filter: `ID=${ID}`,
            fields: `telegram=${telegram}`,
        })) as UserRegisterResponse;
    }
    async getByToken(token: string): Promise<UserResponse> {
        return (await this.fetchData(getDataURL, {
            filter: `token="${token}"`,
            page: 1,
            limit: 1,
        })) as UserResponse;
    }
    async sign(token: string) {
        return (await this.fetchData(setDataURL, {
            type: "UPDATE",
            filter: `token="${token}"`,
            fields: `签到=${Date.now()}, V币=V币+5`,
        })) as UserResponse;
    }
    async fetchData(url: string, body: Object): Promise<Object> {
        const timestamp: number = Date.now();
        const signature: string = sign.get(String(timestamp));
        try {
            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
            const json = await response.json();
            return json;
        } catch (error: unknown) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }
}