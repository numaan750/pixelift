"use client";

import { useEffect, useMemo, useState } from "react";

function pickHeadingIds(items) {
  if (!Array.isArray(items)) return [];
  // Only top-level headings (H2)
  return items
    .filter((i) => i && i.id && (i.level === 2 || i.level === "2"))
    .map((i) => ({ id: i.id, text: i.text }))
    .slice(0, 20);
}

export default function TocClient({ items }) {
  const headings = useMemo(() => pickHeadingIds(items), [items]);
  const [activeId, setActiveId] = useState(headings[0]?.id || "");

  useEffect(() => {
    if (!headings.length) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the top-most visible heading.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Treat heading as active a bit before it reaches top.
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) {
    return (
      <p className="text-sm text-gray-400">
        No headings detected for this article.
      </p>
    );
  }

  return (
    <nav aria-label="On this page">
      <ul className="space-y-1">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={
                  "relative block rounded-lg border px-3 py-2 text-sm transition-colors " +
                  (isActive
                    ? "border-blue-500/50 bg-blue-500/15 text-white pl-4"
                    : "border-transparent text-gray-300 hover:border-zinc-800 hover:bg-zinc-900/60 hover:text-white")
                }
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-blue-400"
                  />
                ) : null}
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
