// lib/telegram.ts
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH || "";
const sessionString = process.env.TELEGRAM_SESSION_STRING || "";
const channelUsername = process.env.TELEGRAM_CHANNEL || "";

let client: TelegramClient | null = null;

export async function getTelegramClient() {
    if (!client) {
        const stringSession = new StringSession(sessionString);
        client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
        await client.connect();
    }
    return client;
}

export async function fetchTelegramPosts(limit = 10): Promise<any[]> {
    const tgClient = await getTelegramClient();
    const result = await tgClient.getMessages(channelUsername, { limit });

    // Для каждого сообщения пытаемся скачать медиа, если оно есть
    const posts = await Promise.all(
        result.map(async (msg) => {
            let photo: string | null = null;
            if (msg.media) {
                let isJpeg = false;

                // Если это MessageMediaPhoto — очевидно, это фото
                if (msg.media.className === "MessageMediaPhoto") {
                    isJpeg = true;
                }
                // Если это документ, проверяем MIME-тип
                else if (
                    "document" in msg.media &&
                    msg.media.document &&
                    "mimeType" in msg.media.document &&
                    msg.media.document.mimeType === "image/jpeg"
                ) {
                    isJpeg = true;
                }

                if (isJpeg) {
                    try {
                        const media = await tgClient.downloadMedia(msg);
                        if (media && media instanceof Buffer) {
                            photo = `data:image/jpeg;base64,${media.toString("base64")}`;
                        } else if (typeof media === "string") {
                            // Если возвращается строка, используем её напрямую (например, URL)
                            photo = media;
                        }
                    } catch (e) {
                        console.error("Error downloading media for message", msg.id, e);
                    }
                }
            }
            return {
                id: msg.id,
                text: msg.message || "",
                date: msg.date, // можно преобразовать в строку, если нужно
                photo,
                views: msg.views || 0, // если поле существует, иначе 0
            };
        })
    );
    return posts;
}