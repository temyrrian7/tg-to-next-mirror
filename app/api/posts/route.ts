// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';

type TelegramPost = {
    id: number;
    text: string;
    date?: Date;
};

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH || '';
const sessionString = process.env.TELEGRAM_SESSION_STRING || '';
const channelUsername = process.env.TELEGRAM_CHANNEL || '';

let client: TelegramClient | null = null;

async function getTelegramClient() {
    if (!client) {
        const stringSession = new StringSession(sessionString);
        client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
        await client.connect();
    }
    return client;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TelegramPost[] | { error: string }>
) {
    try {
        const tgClient = await getTelegramClient();
        const result = await tgClient.getMessages(channelUsername, { limit: 10 });

        const posts: TelegramPost[] = result.map((msg) => ({
            id: msg.id,
            text: msg.message || '',
            date: msg.date,
        }));

        res.status(200).json(posts);
    } catch (error: any) {
        console.error('Error fetching Telegram posts:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch posts' });
    }
}