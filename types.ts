export interface UserData {
    createdAt: number;
    updatedAt: number;
    ID: number;
    昵称: string;
    头像: string;
    V币: number;
    邮箱: string | null;
    容量: number | null;
    VIP: string | null;
    签到: number | null;
    管理员: number | null;
    封号: number | null;
    头衔: string;
    头衔色: string;
    密码: string | null;
    token: string | null;
    QQ: number | null;
    telegram: number | null;
}

export interface GetByIDResponse {
    code: number;
    msg: string;
    logid: string;
    createdAt: number;
    count: number;
    fields: UserData[];
    sql: string;
}

export interface SearchResponse {
    code: number;
    msg: string;
    logid: string;
    createdAt: number;
    count: number;
    fields: UserData[];
    sql: string;
}

export interface UserLoginResponse {
    code: number;
    msg: string;
    logid: string;
    createdAt: number;
    count: number;
    fields: UserData[];
    sql: string;
}

export interface UserRegisterResponse {
    code: number;
    msg: string;
    logid: string;
    createdAt: number;
    count: number;
    fields: UserData[];
    sql: string;
}

export interface GetAllUsersResponse {
    code: number;
    msg: string;
    logid: string;
    createdAt: number;
    count: number;
    fields: UserData[];
    sql: string;
}
