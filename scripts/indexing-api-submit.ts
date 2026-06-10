/**
 * Google Indexing API submit (keikamotsu-compass / 主要記事URL).
 *
 * boost-sys/scripts/indexing-api-submit.ts と同パターン (boost-sys側で動作実証済)。
 * kei-compass.org は GSC sc-domain登録済 → 同OAuthクレデンシャル (boost-sys側 .env と同じ
 * GOOGLE_INDEXING_CLIENT_ID/SECRET/REFRESH_TOKEN) で動作確認済 (#137 SEO追加batch 2026-06-10)
 *
 * 認証フロー:
 *   1. REFRESH_TOKEN + CLIENT_ID + CLIENT_SECRET で access_token (1h有効) を取得
 *   2. POST https://indexing.googleapis.com/v3/urlNotifications:publish
 *      body: { url, type: "URL_UPDATED" }
 *      header: Authorization: Bearer <access_token>
 *
 * 対象URL:
 *   - 3 pillar (top page狙い・最重要)
 *   - 主要area記事 (千葉Type A家具・東京北部Type B EC の集客engine)
 *
 * 注: Indexing APIは公式にはJobPosting/BroadcastEvent専用だが、boost-sys運用実績で一般URLも
 *     200受領可 (Google側で indexing保証はないが notify自体は通る)
 *
 * 失敗時 exit 0:
 *   postbuildで deploy影響を出さないため、warning ログのみで終了
 */

const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const INDEXING_API_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";

// 主要記事 URL list
// pillar 3本 + 千葉東葛3記事 (6/8 deploy・GSC Discovered but not indexed状態・notify強化対象)
// 既indexedの17本 (千葉8 + 東京9) は除外 (再submit不要)
// 20area health audit結果 (#138 2026-06-10): indexed 17/20 + 未indexed 3/20 = kashiwa/nagareyama/noda
const TARGET_URLS = [
  // pillar 3本
  "https://www.kei-compass.org/articles/keikamotsu-ranking-2026",
  "https://www.kei-compass.org/articles/keikamotsu-hikaku-guide",
  "https://www.kei-compass.org/articles/keikamotsu-cost-guide",
  // 千葉東葛3記事 (#125 deploy・未indexed・Indexing API notify強化)
  "https://www.kei-compass.org/articles/kashiwa-keikamotsu-ranking-2026",
  "https://www.kei-compass.org/articles/nagareyama-keikamotsu-ranking-2026",
  "https://www.kei-compass.org/articles/noda-keikamotsu-ranking-2026",
  // 千葉外房1記事 (#146 K Day31 24h稼働 lp-copywriter委譲)
  "https://www.kei-compass.org/articles/kisarazu-keikamotsu-ranking-2026",
  // 千葉外房中央1記事 (#148 DD Day31 24h稼働 lp-copywriter委譲)
  "https://www.kei-compass.org/articles/mobara-keikamotsu-ranking-2026",
  // 千葉北東部1記事 (#150 LL Day31 24h稼働 lp-copywriter委譲・成田空港国際物流ハブ)
  "https://www.kei-compass.org/articles/narita-keikamotsu-ranking-2026",
  // 千葉北東部水郷 (#153 B Day31 24h稼働 lp-copywriter委譲・香取小江戸佐原+茨城県境)
  "https://www.kei-compass.org/articles/katori-keikamotsu-ranking-2026",
  // 千葉東総 (#154 RR Day31 24h稼働 lp-copywriter委譲・旭九十九里北側+水産+農業)
  "https://www.kei-compass.org/articles/asahi-keikamotsu-ranking-2026",
];

const CLIENT_ID = process.env.GOOGLE_INDEXING_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_INDEXING_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_INDEXING_REFRESH_TOKEN;

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.warn("[indexing-api] OAuth env not fully set, skip.");
    return null;
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    console.warn(`[indexing-api] token exchange failed status=${res.status}`);
    return null;
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    console.warn("[indexing-api] token exchange: no access_token in response");
    return null;
  }
  return json.access_token;
}

async function publishUrl(accessToken: string, url: string): Promise<void> {
  const res = await fetch(INDEXING_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });

  if (res.ok) {
    console.log(`[indexing-api] OK url=${url} status=${res.status}`);
    return;
  }
  console.warn(`[indexing-api] failed url=${url} status=${res.status}`);
}

async function main(): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;

  for (const url of TARGET_URLS) {
    try {
      await publishUrl(token, url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      console.warn(`[indexing-api] network error url=${url}: ${msg}`);
    }
  }
}

main().catch(() => {
  process.exit(0);
});

export {};
