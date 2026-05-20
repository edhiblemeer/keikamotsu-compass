/**
 * IndexNow bulk submit (keikamotsu-compass).
 *
 * sitemap.ts の default export を直接 import (B案、 self-loop なし)。
 *
 * セキュリティ:
 * - env 値 (INDEXNOW_KEY_KEIKAMOTSU) は body / keyLocation にのみ使用、 console に出さない
 *
 * リトライ: 4xx no retry / 5xx 指数バックオフ 3回まで
 * 失敗時 exit 0 (deploy 影響なし)
 */
import sitemapFn from "../app/sitemap";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const HOST = "keikamotsu-compass.vercel.app";
const KEY = process.env.INDEXNOW_KEY_KEIKAMOTSU;
const KEY_LOCATION = KEY ? `https://${HOST}/${KEY}.txt` : "";

async function postWithRetry(body: unknown, attempt = 1): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (res.status === 200 || res.status === 202) {
    console.log(`[indexnow] OK status=${res.status}`);
    return;
  }

  if (res.status >= 400 && res.status < 500) {
    console.warn(`[indexnow] client error status=${res.status} (no retry)`);
    return;
  }

  if (attempt >= 3) {
    console.warn(`[indexnow] server error status=${res.status} (attempts exhausted)`);
    return;
  }
  const delay = 2 ** (attempt - 1) * 1000;
  console.warn(`[indexnow] server error status=${res.status}, retry in ${delay}ms`);
  await new Promise((r) => setTimeout(r, delay));
  await postWithRetry(body, attempt + 1);
}

async function main(): Promise<void> {
  if (!KEY) {
    console.warn("[indexnow] INDEXNOW_KEY_KEIKAMOTSU not set, skip submit.");
    return;
  }
  if (!/^[a-f0-9]{32}$/i.test(KEY)) {
    console.warn("[indexnow] key format invalid, skip submit.");
    return;
  }

  let urls: string[];
  try {
    const entries = sitemapFn();
    urls = entries.map((e) => e.url).filter((u) => u.startsWith("https://"));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.warn(`[indexnow] sitemap load failed: ${msg}, skip submit.`);
    return;
  }

  if (urls.length === 0) {
    console.warn("[indexnow] no URLs found in sitemap, skip submit.");
    return;
  }

  console.log(`[indexnow] submitting ${urls.length} URLs to ${ENDPOINT}`);
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };

  try {
    await postWithRetry(body);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.warn(`[indexnow] network error: ${msg}`);
  }
}

main().catch(() => {
  process.exit(0);
});

export {};
