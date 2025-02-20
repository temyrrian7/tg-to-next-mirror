// app/page.tsx
import Image from "next/image";
import { fetchTelegramPosts } from "@/lib/telegram";

type TelegramPost = {
  id: number;
  text: string;
  date: number;
  photo?: string | null;
  views: number;
};

export default async function Home() {
  const posts: TelegramPost[] = await fetchTelegramPosts(10);

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {/* Блок для отображения Telegram постов */}
          <section className="mt-8 w-full">
            <h2 className="text-2xl font-bold mb-4">Latest Telegram Posts</h2>
            <ul className="space-y-4">
              {posts.map((post) => (
                  <li
                      key={post.id}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                  >
                    {post.photo && (
                        <div className="relative w-64 h-40 mt-2">
                          <Image
                              src={post.photo}
                              alt="Telegram post image"
                              fill
                              className="rounded-lg object-cover w-full h-full
               shadow-lg dark:shadow-gray-700
               border border-gray-200 dark:border-gray-600
               hover:shadow-xl dark:hover:shadow-gray-600
               transition-all"
                          />
                        </div>
                    )}
                    <p className="text-lg mt-2">{post.text}</p>
                    {post.date && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(post.date * 1000).toLocaleString()}
                        </p>
                    )}

                    {post.views !== undefined && (
                        <p className=" flex justify-self-end text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Views: {post.views}
                        </p>
                    )}
                  </li>
              ))}
            </ul>
          </section>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
            />
            Learn
          </a>
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
            />
            Examples
          </a>
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
  );
}