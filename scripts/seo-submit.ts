/**
 * postbuild SEO submit entry point (keikamotsu-compass).
 *
 * boost-sys/scripts/seo-submit.ts と同パターン。
 * IndexNow (全URL bulk) → Google Indexing API (3 pillar記事) の順で実行。
 * いずれの失敗も deploy には影響させない (exit 0)。
 */
async function main(): Promise<void> {
  try {
    await import("./indexnow-submit");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.warn(`[seo-submit] indexnow module error: ${msg}`);
  }

  try {
    await import("./indexing-api-submit");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.warn(`[seo-submit] indexing-api module error: ${msg}`);
  }
}

main().catch(() => {
  process.exit(0);
});

export {};
