/**
 * IndexNow key file generator (prebuild hook) — keikamotsu-compass.
 *
 * IndexNowプロトコルでは、 host の `https://{host}/{key}.txt` に
 * keyそのものを記載したplain text fileを配置することで「key 所有証明」を行う。
 *
 * - 対象 host: keikamotsu-compass.vercel.app
 * - 参照 env: INDEXNOW_KEY_KEIKAMOTSU (32文字 UUIDv4 hex)
 * - 出力: public/{INDEXNOW_KEY_KEIKAMOTSU}.txt (中身も同じ key)
 *
 * セキュリティ:
 * - env 値そのものは file 名 / file 内容にのみ使用、 console には出さない
 * - 失敗時もエラー文面に env 値を含めない
 * - public/*.txt は .gitignore で除外 (key file commit防止)
 */
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = join(process.cwd(), "public");
const KEY = process.env.INDEXNOW_KEY_KEIKAMOTSU;

function main(): void {
  if (!KEY) {
    console.warn("[indexnow-key] INDEXNOW_KEY_KEIKAMOTSU not set, skip key file generation.");
    return;
  }

  if (!/^[a-f0-9]{32}$/i.test(KEY)) {
    console.warn("[indexnow-key] key format invalid (expected 32 hex chars), skip.");
    return;
  }

  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  for (const f of readdirSync(PUBLIC_DIR)) {
    if (/^[a-f0-9]{32}\.txt$/i.test(f) && f !== `${KEY}.txt`) {
      try {
        unlinkSync(join(PUBLIC_DIR, f));
      } catch {
        /* ignore */
      }
    }
  }

  const target = join(PUBLIC_DIR, `${KEY}.txt`);
  writeFileSync(target, KEY, { encoding: "utf8" });
  const masked = `${KEY.substring(0, 4)}***`;
  console.log(`[indexnow-key] generated public/${masked}.txt`);
}

main();

export {};
