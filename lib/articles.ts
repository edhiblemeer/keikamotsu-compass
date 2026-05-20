import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const articlesDirectory = path.join(process.cwd(), "articles");
const detailArticlesDirectory = path.join(process.cwd(), "articles-detail");

// === v2 colorful 用 type 群 (architect 設計書 §5.1 / §6.2 準拠) ===

export type CompanyTier = "gold" | "silver" | "bronze";

export interface CompanyMonthlyIncome {
  entry: string;
  experienced: string;
  top: string;
}

export interface CompanySubScores {
  reward_transparency: number;
  regulation_compliance: number;
  location_access: number;
  support_quality: number;
  future_potential: number;
}

export interface CompanyData {
  id: string;
  rank: number;
  name: string;
  score: number;
  tier: CompanyTier;
  relationship_disclosure?: string;
  strengths: string[];
  monthly_income: CompanyMonthlyIncome;
  locations: string[];
  official_url: string;
  apply_url?: string;
  line_url?: string;
  image?: string;
  profile_description?: string;
  caveat?: string;
  sub_scores?: CompanySubScores;
}

export interface AreaCity {
  name: string;
  population: number;
  key_route?: string;
}

export interface AreaPeakSeason {
  month: number;
  intensity: string;
  reason: string;
}

export interface AreaData {
  name: string;
  prefectures: string[];
  cities: AreaCity[];
  main_clients: string[];
  transport_arteries: string[];
  peak_seasons: AreaPeakSeason[];
}

export interface HeroBadge {
  emoji: string;
  label: string;
  value: string;
}

export interface VisualsHeroImage {
  src: string;
  alt: string;
  fallback?: string;
}

export interface VisualsDriverVoice {
  persona_id: string;
  label: string;
  city: string;
  image: string;
}

export interface VisualsData {
  hero_image: VisualsHeroImage;
  driver_voices?: VisualsDriverVoice[];
}

export interface PersonaTarget {
  persona_id: string;
  label: string;
  primary_sections: string[];
}

export interface ArticleFrontmatter {
  title: string;
  description?: string;
  publishedAt: string;
  updatedAt?: string;
  nextReviewAt?: string;
  tags?: string[];
  area?: string;
  excerpt?: string;
  ogImage?: string;
  // === v2 colorful 拡張 (全 optional / 後方互換) ===
  template?: "v2_colorful" | "default";
  companies?: CompanyData[];
  area_data?: AreaData;
  visuals?: VisualsData;
  hero_badges?: HeroBadge[];
  personas_targeted?: PersonaTarget[];
}

export interface ArticleSummary {
  slug: string;
  frontmatter: ArticleFrontmatter;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Article extends ArticleSummary {
  contentHtml: string;
  faqs: FaqItem[];
}

type RawFrontmatter = Record<string, unknown>;

// === normalize ヘルパ ===

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeMonthlyIncome(v: unknown): CompanyMonthlyIncome {
  if (!isRecord(v)) return { entry: "", experienced: "", top: "" };
  return {
    entry: typeof v.entry === "string" ? v.entry : "",
    experienced: typeof v.experienced === "string" ? v.experienced : "",
    top: typeof v.top === "string" ? v.top : "",
  };
}

function normalizeSubScores(v: unknown): CompanySubScores | undefined {
  if (!isRecord(v)) return undefined;
  const num = (key: string): number => {
    const n = v[key];
    return typeof n === "number" && Number.isFinite(n) ? n : 0;
  };
  return {
    reward_transparency: num("reward_transparency"),
    regulation_compliance: num("regulation_compliance"),
    location_access: num("location_access"),
    support_quality: num("support_quality"),
    future_potential: num("future_potential"),
  };
}

function normalizeCompanies(data: RawFrontmatter): CompanyData[] | undefined {
  if (!Array.isArray(data.companies)) return undefined;
  const companies = data.companies
    .filter(isRecord)
    .map((c): CompanyData => {
      const tier: CompanyTier =
        c.tier === "gold" || c.tier === "silver" || c.tier === "bronze"
          ? c.tier
          : "bronze";
      return {
        id: typeof c.id === "string" ? c.id : "",
        rank: typeof c.rank === "number" ? c.rank : 0,
        name: typeof c.name === "string" ? c.name : "",
        score: typeof c.score === "number" ? c.score : 0,
        tier,
        relationship_disclosure:
          typeof c.relationship_disclosure === "string"
            ? c.relationship_disclosure
            : undefined,
        strengths: Array.isArray(c.strengths)
          ? c.strengths.filter((s): s is string => typeof s === "string")
          : [],
        monthly_income: normalizeMonthlyIncome(c.monthly_income),
        locations: Array.isArray(c.locations)
          ? c.locations.filter((l): l is string => typeof l === "string")
          : [],
        official_url: typeof c.official_url === "string" ? c.official_url : "",
        apply_url: typeof c.apply_url === "string" ? c.apply_url : undefined,
        line_url: typeof c.line_url === "string" ? c.line_url : undefined,
        image: typeof c.image === "string" ? c.image : undefined,
        profile_description:
          typeof c.profile_description === "string"
            ? c.profile_description
            : undefined,
        caveat: typeof c.caveat === "string" ? c.caveat : undefined,
        sub_scores: normalizeSubScores(c.sub_scores),
      };
    })
    .sort((a, b) => a.rank - b.rank);
  return companies.length > 0 ? companies : undefined;
}

function normalizeVisuals(data: RawFrontmatter): VisualsData | undefined {
  if (!isRecord(data.visuals)) return undefined;
  const v = data.visuals;
  if (!isRecord(v.hero_image)) return undefined;
  const h = v.hero_image;
  const driverVoicesRaw = v.driver_voices;
  const driverVoices: VisualsDriverVoice[] | undefined = Array.isArray(
    driverVoicesRaw,
  )
    ? driverVoicesRaw.filter(isRecord).map(
        (d): VisualsDriverVoice => ({
          persona_id: typeof d.persona_id === "string" ? d.persona_id : "",
          label: typeof d.label === "string" ? d.label : "",
          city: typeof d.city === "string" ? d.city : "",
          image: typeof d.image === "string" ? d.image : "",
        }),
      )
    : undefined;
  return {
    hero_image: {
      src: typeof h.src === "string" ? h.src : "",
      alt: typeof h.alt === "string" ? h.alt : "",
      fallback: typeof h.fallback === "string" ? h.fallback : undefined,
    },
    driver_voices: driverVoices,
  };
}

function normalizeHeroBadges(data: RawFrontmatter): HeroBadge[] | undefined {
  if (!Array.isArray(data.hero_badges)) return undefined;
  const badges = data.hero_badges.filter(isRecord).map(
    (b): HeroBadge => ({
      emoji: typeof b.emoji === "string" ? b.emoji : "",
      label: typeof b.label === "string" ? b.label : "",
      value: typeof b.value === "string" ? b.value : "",
    }),
  );
  return badges.length > 0 ? badges : undefined;
}

function normalizeAreaData(data: RawFrontmatter): AreaData | undefined {
  if (!isRecord(data.area)) return undefined;
  const a = data.area;
  return {
    name: typeof a.name === "string" ? a.name : "",
    prefectures: Array.isArray(a.prefectures)
      ? a.prefectures.filter((p): p is string => typeof p === "string")
      : [],
    cities: Array.isArray(a.cities)
      ? a.cities.filter(isRecord).map(
          (c): AreaCity => ({
            name: typeof c.name === "string" ? c.name : "",
            population: typeof c.population === "number" ? c.population : 0,
            key_route:
              typeof c.key_route === "string" ? c.key_route : undefined,
          }),
        )
      : [],
    main_clients: Array.isArray(a.main_clients)
      ? a.main_clients.filter((c): c is string => typeof c === "string")
      : [],
    transport_arteries: Array.isArray(a.transport_arteries)
      ? a.transport_arteries.filter((t): t is string => typeof t === "string")
      : [],
    peak_seasons: Array.isArray(a.peak_seasons)
      ? a.peak_seasons.filter(isRecord).map(
          (p): AreaPeakSeason => ({
            month: typeof p.month === "number" ? p.month : 0,
            intensity: typeof p.intensity === "string" ? p.intensity : "",
            reason: typeof p.reason === "string" ? p.reason : "",
          }),
        )
      : [],
  };
}

function normalizePersonasTargeted(
  data: RawFrontmatter,
): PersonaTarget[] | undefined {
  if (!Array.isArray(data.personas_targeted)) return undefined;
  const personas = data.personas_targeted.filter(isRecord).map(
    (p): PersonaTarget => ({
      persona_id: typeof p.persona_id === "string" ? p.persona_id : "",
      label: typeof p.label === "string" ? p.label : "",
      primary_sections: Array.isArray(p.primary_sections)
        ? p.primary_sections.filter((s): s is string => typeof s === "string")
        : [],
    }),
  );
  return personas.length > 0 ? personas : undefined;
}

function normalizeFrontmatter(data: RawFrontmatter): ArticleFrontmatter {
  const title = typeof data.title === "string" ? data.title : "";
  const description =
    typeof data.description === "string"
      ? data.description
      : typeof data.meta_description === "string"
        ? data.meta_description
        : undefined;
  const publishedAt =
    typeof data.publishedAt === "string"
      ? data.publishedAt
      : typeof data.published_at === "string"
        ? data.published_at
        : "";
  const updatedAt =
    typeof data.updatedAt === "string"
      ? data.updatedAt
      : typeof data.updated_at === "string"
        ? data.updated_at
        : undefined;
  const nextReviewAt =
    typeof data.nextReviewAt === "string"
      ? data.nextReviewAt
      : typeof data.next_review_at === "string"
        ? data.next_review_at
        : undefined;
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : undefined;
  // area は v1 では string、 v2 では object (area_data として扱う)
  const areaLabel =
    typeof data.area_label === "string"
      ? data.area_label
      : typeof data.area === "string"
        ? data.area
        : isRecord(data.area) && typeof data.area.name === "string"
          ? `${data.area.name}エリア`
          : undefined;
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : undefined;
  const ogImage =
    typeof data.og_image === "string"
      ? data.og_image
      : typeof data.ogImage === "string"
        ? data.ogImage
        : undefined;
  const template =
    data.template === "v2_colorful" || data.template === "default"
      ? data.template
      : undefined;

  return {
    title,
    description,
    publishedAt,
    updatedAt,
    nextReviewAt,
    tags,
    area: areaLabel,
    excerpt,
    ogImage,
    template,
    companies: normalizeCompanies(data),
    area_data: normalizeAreaData(data),
    visuals: normalizeVisuals(data),
    hero_badges: normalizeHeroBadges(data),
    personas_targeted: normalizePersonasTargeted(data),
  };
}

/**
 * v2 colorful 記事の markdown body から「Hero (H1+badges+導入) + ranking-cards」 を切り取る。
 *
 * 境界判定:
 *   開始 = ファイル先頭
 *   終端 = 最初に登場する `## 🥇 Gold Tier` 見出し or `{#scoring-breakdown}` アンカー
 *
 * 既存千葉船橋記事では:
 *   - L218 `## 📊 千葉船橋エリア 軽貨物業者ランキング 2026 {#ranking-cards}` 〜 L327 `### ⭐ 5位` 末尾 = 削除対象
 *   - L329 `## 🔍 採点の中身` 以降 = 維持
 *
 * 注: companies 未定義の v1 記事には適用しない (page.tsx 側で判定)
 */
export function stripV2HeaderSections(content: string): string {
  // 終端マーカー: `## 🔍 採点の中身` (scoring-breakdown) を最優先、 無ければ `## 🥇 Gold Tier` (tier-gold)
  const scoringMarker = /^##\s+🔍\s+採点の中身/m;
  const goldMarker = /^##\s+🥇\s+Gold\s+Tier/m;
  const scoringMatch = content.match(scoringMarker);
  if (scoringMatch && scoringMatch.index !== undefined) {
    return content.slice(scoringMatch.index);
  }
  const goldMatch = content.match(goldMarker);
  if (goldMatch && goldMatch.index !== undefined) {
    return content.slice(goldMatch.index);
  }
  return content;
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  return fs
    .readdirSync(articlesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllArticleSummaries(): ArticleSummary[] {
  const slugs = getAllArticleSlugs();
  return slugs
    .map((slug) => {
      const filePath = path.join(articlesDirectory, `${slug}.md`);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      return {
        slug,
        frontmatter: normalizeFrontmatter(data as RawFrontmatter),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime(),
    );
}

async function processMarkdown(content: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return processed.toString();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = normalizeFrontmatter(data as RawFrontmatter);

  // v2 colorful (companies 定義あり) のときだけ markdown 冒頭を切り取る
  const processedContent =
    frontmatter.companies && frontmatter.companies.length > 0
      ? stripV2HeaderSections(content)
      : content;

  return {
    slug,
    frontmatter,
    contentHtml: await processMarkdown(processedContent),
    faqs: parseFaqs(processedContent),
  };
}

/**
 * markdown content から FAQ section を抽出して FaqItem[] を返す。
 * LLM最適化 C (FAQPage schema) の source。
 *
 * 対応 pattern:
 *   - `## ❓ XXX FAQ` / `## XXX FAQ` / `## よくある質問` / `## Q&A`
 *   - section 内 `### Q1. 〜?` / `### 〜?` / `### 質問` ヘディング + 直後 paragraph (A. プレフィックス除去)
 */
export function parseFaqs(content: string): FaqItem[] {
  // FAQ section 開始位置の find
  const headingRe = /^##\s+.*(?:FAQ|よくある質問|Q&A|質問)/im;
  const startMatch = content.match(headingRe);
  if (!startMatch || startMatch.index === undefined) return [];

  // 開始位置から次の H2 ('## ') までを section とする
  const rest = content.slice(startMatch.index + startMatch[0].length);
  const nextH2 = rest.search(/\n##\s/);
  const faqSection = nextH2 >= 0 ? rest.slice(0, nextH2) : rest;

  const faqs: FaqItem[] = [];
  const lines = faqSection.split("\n");
  let currentQ = "";
  const currentA: string[] = [];

  const flush = (): void => {
    if (currentQ && currentA.length > 0) {
      const answer = currentA.join(" ").replace(/\s+/g, " ").trim();
      if (answer.length >= 10) {
        faqs.push({ question: currentQ, answer });
      }
    }
  };

  for (const line of lines) {
    // ### 〜 ヘディング = 新質問
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      flush();
      // Q1. / Q1: / Q1： プレフィックス除去
      let q = h3[1].replace(/^Q\d+[.:：]\s*/i, "").trim();
      // 末尾に ? が無ければ追加 (日本語/英文両対応)
      if (!/[??]\s*$/.test(q)) q += "?";
      currentQ = q;
      currentA.length = 0;
      continue;
    }
    if (!currentQ) continue;

    // section 終了 (---) or H2
    if (/^##\s/.test(line) || /^---\s*$/.test(line)) {
      break;
    }

    // 回答 paragraph (A. / A: / A： プレフィックス除去・markdown装飾は維持)
    const stripped = line.replace(/^A[.:：]\s*/i, "").trim();
    if (stripped) {
      currentA.push(stripped);
    }
  }

  flush();
  return faqs;
}

export function getAllDetailSlugs(): string[] {
  if (!fs.existsSync(detailArticlesDirectory)) return [];
  return fs
    .readdirSync(detailArticlesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getDetailArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const filePath = path.join(detailArticlesDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: normalizeFrontmatter(data as RawFrontmatter),
    contentHtml: await processMarkdown(content),
    faqs: parseFaqs(content),
  };
}
