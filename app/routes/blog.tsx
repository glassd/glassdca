import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/blog";
import { BlogCard } from "../components/BlogCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog" },
    { name: "description", content: "Read my latest blog posts." },
  ];
}

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
  tags?: Tag[];
  snippet: string;
  publishedAt?: string | null;
};

type BlogResponse = {
  posts: Post[];
  nextOffset: number;
  hasMore: boolean;
  total: number;
};

const PAGE_SIZE = 10;

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounce search input
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => clearTimeout(handle);
  }, [q]);

  // Load tags initially
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch(`/api/blog/tags`, {
          headers: { "Cache-Control": "no-store" },
        });
        if (!res.ok) throw new Error(`Failed to load tags (${res.status})`);
        const data: Tag[] = await res.json();
        if (!cancelled) setAvailableTags(data);
      } catch (e: any) {
        console.error("[Blog] Failed to load tags:", e?.message || e);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build query string for API
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("offset", String(nextOffset));
    params.set("limit", String(PAGE_SIZE));
    if (debouncedQ) params.set("q", debouncedQ);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    return params.toString();
  }, [nextOffset, debouncedQ, selectedTags]);

  // Load a page of posts
  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog?${queryString}`, {
        headers: { "Cache-Control": "no-store" },
      });
      if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
      const data: BlogResponse = await res.json();
      setPosts((prev) =>
        nextOffset === 0 ? data.posts : [...prev, ...data.posts],
      );
      setNextOffset(data.nextOffset);
      setHasMore(data.hasMore);
    } catch (e: any) {
      const msg = e?.message || "Unknown error";
      console.error("[Blog] Error fetching posts:", msg);
      setError(msg);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Reset and load when filters/search change
  useEffect(() => {
    // Reset
    setPosts([]);
    setNextOffset(0);
    setHasMore(true);
    setInitialLoading(true);
  }, [debouncedQ, selectedTags]);

  // When nextOffset resets to 0 (due to filter/search change), trigger initial load
  useEffect(() => {
    if (nextOffset === 0 && hasMore && initialLoading) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextOffset, hasMore, initialLoading, queryString]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    // Clean up any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observerRef.current.observe(sentinelRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, queryString, hasMore]);

  const toggleTag = (slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setQ("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Blog
      </h1>

      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1">
          <label htmlFor="blog-search" className="sr-only">
            Search posts
          </label>
          <input
            id="blog-search"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="self-start md:self-auto inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {/* Tag filters */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by tags
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((t) => {
              const checked = selectedTags.includes(t.slug);
              return (
                <label
                  key={t._id}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm cursor-pointer transition ${
                    checked
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200"
                      : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleTag(t.slug)}
                    aria-label={`Filter by ${t.title}`}
                  />
                  <span>#{t.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      {initialLoading && posts.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-300">Loading posts…</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-300">No posts found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <BlogCard
              key={p._id}
              title={p.title}
              slug={p.slug}
              mainImage={p.mainImage}
              tags={p.tags || []}
              snippet={p.snippet}
              publishedAt={p.publishedAt}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-600 dark:text-red-400">
          Error loading posts: {error}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-10" />

      {/* Loading indicator at bottom */}
      {loading && posts.length > 0 && (
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          Loading more…
        </div>
      )}
    </div>
  );
}
