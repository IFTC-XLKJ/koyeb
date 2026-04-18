export interface UserData {
    createdAt: number;
    updatedAt: number;
    ID: number;
    昵称: string;
    头像: string;
    V币: number;
    邮箱: string;
    容量: number;
    VIP: string;
    签到: number;
    管理员: number | null;
    封号: number | null;
    头衔: string;
    头衔色: string;
    密码: string;
    token: string;
    QQ: number;
    telegram: number;
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
