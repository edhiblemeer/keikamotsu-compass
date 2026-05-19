import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const articlesDirectory = path.join(process.cwd(), "articles");
const detailArticlesDirectory = path.join(process.cwd(), "articles-detail");

export interface ArticleFrontmatter {
  title: string;
  description?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  area?: string;
  excerpt?: string;
}

export interface ArticleSummary {
  slug: string;
  frontmatter: ArticleFrontmatter;
}

export interface Article extends ArticleSummary {
  contentHtml: string;
}

type RawFrontmatter = Record<string, unknown>;

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
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : undefined;
  const area =
    typeof data.area_label === "string"
      ? data.area_label
      : typeof data.area === "string"
        ? data.area
        : undefined;
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : undefined;

  return { title, description, publishedAt, updatedAt, tags, area, excerpt };
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

  return {
    slug,
    frontmatter: normalizeFrontmatter(data as RawFrontmatter),
    contentHtml: await processMarkdown(content),
  };
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
  };
}
