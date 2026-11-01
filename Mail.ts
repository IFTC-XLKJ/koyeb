import nodemailer from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";

interface MailConfig {
    user: string;
    pass: string;
    fromName: string;
}

const defaultConfig: MailConfig = {
    user: "iftcceo@gmail.com",
    pass: "mqpsbiaieilzgxdb",
    fromName: "IFTC官方",
};

let transporter: Transporter | null = null;

function getTransporter(config?: Partial<MailConfig>): Transporter {
    if (!transporter) {
        const cfg = { ...defaultConfig, ...config };
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: cfg.user,
                pass: cfg.pass,
            },
        });
    }
    return transporter;
}

interface SendMailParams {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

interface SendMailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface CodeRecord {
    code: string;
    expiresAt: number;
}

const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const codeStore = new Map<string, CodeRecord>();

export async function sendMail(params: SendMailParams, config?: Partial<MailConfig>): Promise<SendMailResult> {
    const transport = getTransporter(config);
    const mailOptions: SendMailOptions = {
        from: `"${config?.fromName || defaultConfig.fromName}" <${config?.user || defaultConfig.user}>`,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
    };

    try {
        const info = await transport.sendMail(mailOptions);
        console.log("邮件发送成功:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("邮件发送失败:", error);
        return { success: false, error: error.message || String(error) };
    }
}

export async function sendCode(
    email: string,
    title: string,
    content: string,
    code: string,
    config?: Partial<MailConfig>,
): Promise<SendMailResult> {
    codeStore.set(email, { code, expiresAt: Date.now() + CODE_EXPIRY_MS });
    const html = content.replace(/\{captcha\}/g, code);
    return sendMail({ to: email, subject: title, html }, config);
}

export function verifyCode(email: string, code: string): { success: boolean; msg: string } {
    const record = codeStore.get(email);
    if (!record) {
        return { success: false, msg: "未找到验证码，请先发送验证码" };
    }
    if (Date.now() > record.expiresAt) {
        codeStore.delete(email);
        return { success: false, msg: "验证码已过期，请重新发送" };
    }
    if (record.code !== code) {
        return { success: false, msg: "验证码错误" };
    }
    codeStore.delete(email);
    return { success: true, msg: "验证成功" };
}
