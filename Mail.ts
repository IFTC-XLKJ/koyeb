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
    const html = content.replace(/\{captcha\}/g, code);
    return sendMail({ to: email, subject: title, html }, config);
}
