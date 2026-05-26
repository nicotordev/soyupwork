"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ["className", /^language-./],
    ],
  },
};

type MarkdownContentProps = {
  content: string;
  className?: string;
  emptyMessage?: string;
};

export function MarkdownContent({
  content,
  className,
  emptyMessage = "Sin contenido para previsualizar.",
}: MarkdownContentProps) {
  const trimmed = content.trim();

  if (!trimmed) {
    return (
      <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
    );
  }

  return (
    <article
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight",
        "prose-p:text-foreground/90 prose-li:text-foreground/90",
        "prose-a:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:font-bold prose-strong:text-foreground",
        "prose-code:rounded prose-code:border prose-code:border-foreground/20",
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:rounded prose-pre:border-2 prose-pre:border-foreground",
        "prose-pre:bg-muted/50 prose-pre:shadow-[2px_2px_0px_0px_var(--foreground)]",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:font-normal",
        "prose-hr:border-foreground/25",
        "prose-table:border prose-table:border-foreground/25",
        "prose-th:border prose-th:border-foreground/25 prose-th:bg-muted/40",
        "prose-td:border prose-td:border-foreground/20",
        "dark:prose-invert",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        urlTransform={(url) => {
          if (url.startsWith("javascript:") || url.startsWith("data:")) {
            return "";
          }
          return url;
        }}
      >
        {trimmed}
      </ReactMarkdown>
    </article>
  );
}
