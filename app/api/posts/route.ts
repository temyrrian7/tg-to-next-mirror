import { NextRequest, NextResponse } from "next/server";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

type TelegramPost = {
    id: number;
    text: string;
    date?: Date;
};

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH || "";
const sessionString = process.env.TELEGRAM_SESSION_STRING || "";
const channelUsername = process.env.TELEGRAM_CHANNEL || "";

let client: TelegramClient | null = null;

async function getTelegramClient() {
    if (!client) {
        const stringSession = new StringSession(sessionString);
        client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
        await client.connect();
    }
    return client;
}

export async function GET(request: NextRequest) {
    console.log(request);
    try {
        const tgClient = await getTelegramClient();
        const result = await tgClient.getMessages(channelUsername, { limit: 10 });

        const posts: TelegramPost[] = result.map((msg) => ({
            id: msg.id,
            text: msg.message || "",
            date: new Date (msg.date * 1000),
        }));

        return NextResponse.json(posts);
    } catch (error: any) {
        console.error("Error fetching Telegram posts:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch posts" },
            { status: 500 }
        );
    }
}