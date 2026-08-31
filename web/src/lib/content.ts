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

async function processMarkdown(text: string): Promise<string> {
  if (!text.trim()) return "";
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
    .process(text);
  return processed.toString();
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

  const html = await processMarkdown(content);

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1] || "Content";

  return { content: html, title };
}

export interface ParsedSlide {
  number: number;
  title: string;
  visual: string;
  bullets: string[];
  speakerNotes: string;
}

export interface ContentSections {
  title: string;
  fullHtml: string;
  slides: string;
  slidesData: ParsedSlide[];
  script: string;
  examTips: string;
  summary: string;
  quiz: string;
  objectives: string;
  isLecture: boolean;
}

function parseSlides(rawSection: string): ParsedSlide[] {
  const blocks = rawSection.split(/(?=^###\s+Slide\s+\d+)/m).filter((b) =>
    /^###\s+Slide\s+\d+/.test(b.trim())
  );

  return blocks.map((block) => {
    const titleMatch = block.match(/^###\s+Slide\s+(\d+)[:.)]?\s*(.*)/m);
    const number = titleMatch ? parseInt(titleMatch[1]) : 0;
    const title = titleMatch ? titleMatch[2].trim() : "";

    const visualMatch = block.match(/\*\*Visual[^*]*\*\*[:\s]*([\s\S]+?)(?=\n\*\*|\n###|$)/);
    const visual = visualMatch ? visualMatch[1].replace(/\n/g, " ").trim() : "";

    const contentMatch = block.match(/\*\*Content[^*]*\*\*[:\s]*\n([\s\S]*?)(?=\n\*\*|\n###|$)/);
    const bullets: string[] = [];
    if (contentMatch) {
      for (const line of contentMatch[1].split("\n")) {
        const m = line.match(/^[-*•]\s+(.+)/);
        if (m) bullets.push(m[1].trim());
      }
    }

    const notesMatch = block.match(/\*\*Speaker Notes[^*]*\*\*[:\s]*([\s\S]+?)(?=\n###|$)/);
    const speakerNotes = notesMatch ? notesMatch[1].replace(/\n+/g, " ").trim() : "";

    return { number, title, visual, bullets, speakerNotes };
  }).filter((s) => s.title);
}

export async function getMarkdownSections(filePath: string): Promise<ContentSections> {
  const empty: ContentSections = {
    title: "Not Found",
    fullHtml: "<p>Content not found.</p>",
    slides: "",
    slidesData: [],
    script: "",
    examTips: "",
    summary: "",
    quiz: "",
    objectives: "",
    isLecture: false,
  };

  const fullPath = path.join(CONTENT_ROOT, filePath);
  if (!fs.existsSync(fullPath)) return empty;

  const raw = fs.readFileSync(fullPath, "utf-8");
  if (!raw.trim()) return empty;

  const { data, content } = matter(raw);

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1] || "Content";

  const fullHtml = await processMarkdown(content);

  // Split raw markdown into level-2 sections
  const sectionRegex = /(?=^## )/m;
  const rawSections = content.split(sectionRegex).filter((s) => s.trim().length > 0);

  let slides = "";
  let slidesRaw = "";
  let script = "";
  let examTips = "";
  let summary = "";
  let quiz = "";
  let objectives = "";

  for (const sec of rawSections) {
    const headerLine = sec.split("\n")[0] ?? "";
    if (/SLIDES|📊/.test(headerLine)) {
      slidesRaw = sec;
      slides = await processMarkdown(sec);
    } else if (/RECORDING SCRIPT|🎙️/.test(headerLine)) {
      script = await processMarkdown(sec);
    } else if (/EXAM TIPS|🔔/.test(headerLine)) {
      examTips = await processMarkdown(sec);
    } else if (/LECTURE SUMMARY|✅/.test(headerLine)) {
      summary = await processMarkdown(sec);
    } else if (/MINI QUIZ|❓/.test(headerLine)) {
      quiz = await processMarkdown(sec);
    } else if (/Learning Objectives|🎯/.test(headerLine)) {
      objectives = await processMarkdown(sec);
    }
  }

  const slidesData = slidesRaw ? parseSlides(slidesRaw) : [];
  const isLecture = slidesData.length > 0 && script.length > 0;

  return { title, fullHtml, slides, slidesData, script, examTips, summary, quiz, objectives, isLecture };
}
