import { useLoaderData } from "react-router";
import type { Route } from "./+types/blog.$slug";
import { client } from "../lib/sanity";
import { urlFor } from "../lib/sanity";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeShiki from "@shikijs/rehype";
import { defaultSchema } from "hast-util-sanitize";
import { useMemo } from "react";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes || {}),
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
    pre: [...(defaultSchema.attributes?.pre || []), ["className"]],
    span: [...(defaultSchema.attributes?.span || []), ["className"], ["style"]],
  },
};

type Tag = {
  _id: string;
  title: string;
  slug: string;
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: any;
  publishedAt?: string | null;
  tags?: Tag[];
  bodyMarkdown?: string | null;
  excerpt?: string | null;
};

function formatDate(iso?: string | null) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Missing slug", { status: 400 });
  }

  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    "tags": tags[]->{ _id, title, "slug": slug.current },
    bodyMarkdown,
    excerpt
  }`;

  const post = await client.fetch<Post | null>(query, { slug });
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return Response.json(post, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}

export function meta({ data }: Route.MetaArgs) {
  const post = data as Post | undefined;
  const title = post?.title ? `${post.title} · Blog` : "Blog Post";
  const description = post?.excerpt?.trim() || "Read this blog post.";
  const url = post?.slug ? `/blog/${post.slug}` : "/blog";
  const image = post?.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return [
    { title },
    { name: "description", content: description },
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    ...(image ? [{ property: "og:image", content: image }] : []),
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(image ? [{ name: "twitter:image", content: image }] : []),
    // Canonical
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function BlogPostRoute() {
  const post = useLoaderData<typeof loader>();
  const prettyDate = formatDate(post.publishedAt);

  const hero = useMemo(() => {
    if (!post.mainImage) return null;
    try {
      return urlFor(post.mainImage).width(1200).height(600).fit("crop").url();
    } catch {
      return null;
    }
  }, [post.mainImage]);

  const mdComponents = useMemo(
    () => ({
      h1: (props: any) => (
        <h1
          {...props}
          className="mt-8 text-3xl font-bold text-gray-900 dark:text-white"
        />
      ),
      h2: (props: any) => (
        <h2
          {...props}
          className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white"
        />
      ),
      h3: (props: any) => (
        <h3
          {...props}
          className="mt-6 text-xl font-semibold text-gray-900 dark:text-white"
        />
      ),
      p: (props: any) => (
        <p
          {...props}
          className="my-4 leading-7 text-gray-800 dark:text-gray-200"
        />
      ),
      ul: (props: any) => (
        <ul
          {...props}
          className="my-4 list-disc pl-6 space-y-1 text-gray-800 dark:text-gray-200"
        />
      ),
      ol: (props: any) => (
        <ol
          {...props}
          className="my-4 list-decimal pl-6 space-y-1 text-gray-800 dark:text-gray-200"
        />
      ),
      li: (props: any) => <li {...props} className="leading-7" />,
      code: (props: any) => (
        <code
          {...props}
          className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-sm text-gray-900 dark:text-gray-100"
        />
      ),
      pre: (props: any) => (
        <pre
          {...props}
          className="my-4 overflow-x-auto rounded-md bg-gray-900 p-4 text-gray-100"
        />
      ),
      a: (props: any) => {
        const isExternal =
          typeof props.href === "string" && /^https?:\/\//.test(props.href);
        return (
          <a
            {...props}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-indigo-600 underline decoration-indigo-300 hover:decoration-indigo-500 dark:text-indigo-400"
          />
        );
      },
      img: (props: any) => (
        // Images embedded via the Markdown plugin will often be Sanity CDN URLs
        // We just give them nice defaults.
        <img
          {...props}
          loading="lazy"
          className="my-6 max-h-[600px] w-full rounded-md object-contain"
          alt={props.alt || ""}
        />
      ),
      blockquote: (props: any) => (
        <blockquote
          {...props}
          className="my-6 border-l-4 border-indigo-300/60 pl-4 italic text-gray-700 dark:text-gray-300"
        />
      ),
      hr: (props: any) => (
        <hr {...props} className="my-8 border-gray-200 dark:border-gray-800" />
      ),
      table: (props: any) => (
        <div className="my-6 overflow-x-auto">
          <table {...props} className="min-w-full border-collapse text-sm" />
        </div>
      ),
      th: (props: any) => (
        <th
          {...props}
          className="border-b border-gray-300 bg-gray-50 px-3 py-2 text-left font-medium dark:border-gray-700 dark:bg-gray-800"
        />
      ),
      td: (props: any) => (
        <td
          {...props}
          className="border-b border-gray-200 px-3 py-2 align-top dark:border-gray-800"
        />
      ),
    }),
    [],
  );

  return (
    <article className="container mx-auto max-w-8xl px-4 py-10">
      <nav className="mb-6 text-sm">
        <a
          href="/blog"
          className="inline-flex items-center text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to Blog
        </a>
        <div className="mt-2 text-gray-500 dark:text-gray-400">
          <a href="/blog" className="hover:underline">
            Blog
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{post.title}</span>
        </div>
      </nav>
      {/* Title + meta */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {prettyDate && (
            <time className="text-gray-500 dark:text-gray-400">
              {prettyDate}
            </time>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <a
                  key={t._id}
                  href={`/blog?tags=${encodeURIComponent(t.slug)}`}
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  #{t.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero image */}
      {hero && (
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <img
            src={hero}
            alt={post.title}
            className="h-auto w-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Body */}
      <section className="prose prose-indigo max-w-none dark:prose-invert">
        {post.bodyMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              [
                rehypeShiki,
                { themes: { light: "github-light", dark: "github-dark" } },
              ],
              [rehypeSanitize, sanitizeSchema],
            ]}
            components={mdComponents as any}
          >
            {post.bodyMarkdown}
          </ReactMarkdown>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            This post has no content yet.
          </p>
        )}
      </section>
    </article>
  );
}
