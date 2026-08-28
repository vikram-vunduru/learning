import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import { visit } from "unist-util-visit";
import type { Element, Text } from "hast";

const CONTENT_ROOT = path.join(process.cwd(), "..");

// Matches URLs like trailhead.salesforce.com/..., github.com/..., https://..., http://...
const URL_RE = /^(https?:\/\/|www\.|[a-z0-9-]+\.(salesforce|github|google|amazon|microsoft|nvidia|databricks|snowflake|anthropic|youtube|developer)\.(com|io|org|ai))/i;

// Rehype plugin: wraps <code> elements whose text content is a URL in an <a> tag
function rehypeCodeLinks() {
  return (tree: import("hast").Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "code") return;
      if (!parent || index === undefined) return;
      // Skip code inside <pre> (block code)
      if ((parent as Element).tagName === "pre") return;

      const textNode = node.children[0] as Text | undefined;
      if (!textNode || textNode.type !== "text") return;

      const text = textNode.value.trim();
      if (!URL_RE.test(text)) return;

      // Build a full href
      const href = text.startsWith("http") ? text : `https://${text}`;

      // Replace the <code> with <a href="..."><code>...</code></a>
      const link: Element = {
        type: "element",
        tagName: "a",
        properties: {
          href,
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          class: "code-link",
        },
        children: [node],
      };

      (parent as Element).children.splice(index, 1, link);
    });
  };
}

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
    .use(rehypeCodeLinks)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1] || "Content";

  return { content: processed.toString(), title };
}
