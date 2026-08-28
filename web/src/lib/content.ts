import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

// Content root is one level up from web/
const CONTENT_ROOT = path.join(process.cwd(), "..");

export async function getMarkdownContent(filePath: string): Promise<{
  content: string;
  title: string;
}> {
  const fullPath = path.join(CONTENT_ROOT, filePath);

  if (!fs.existsSync(fullPath)) {
    return { content: "<p>Content not found.</p>", title: "Not Found" };
  }

  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  // Extract first H1 as title if not in frontmatter
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1] || "Content";

  return { content: processed.toString(), title };
}
