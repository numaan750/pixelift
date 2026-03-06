import sanitizeHtml from "sanitize-html";

function sanitize(html) {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "iframe",
      "video",
      "source",
      "figure",
      "figcaption",
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "pre",
      "code",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      table: ["border", "cellpadding", "cellspacing"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      iframe: [
        "src",
        "width",
        "height",
        "title",
        "allow",
        "allowfullscreen",
        "frameborder",
      ],
      video: [
        "src",
        "controls",
        "muted",
        "playsinline",
        "loop",
        "autoplay",
        "poster",
        "preload",
      ],
      source: ["src", "type"],
      '*': ["id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      iframe: ["https"],
      source: ["http", "https"],
      video: ["http", "https"],
    },
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "youtu.be",
      "player.vimeo.com",
      "vimeo.com",
    ],
    transformTags: {
      a: (tagName, attribs) => {
        const rel = attribs.rel
          ? attribs.rel
          : "nofollow noopener noreferrer";
        const target = attribs.target ? attribs.target : "_blank";
        return {
          tagName,
          attribs: { ...attribs, rel, target },
        };
      },
      img: (tagName, attribs) => {
        const loading = attribs.loading ? attribs.loading : "lazy";
        return { tagName, attribs: { ...attribs, loading } };
      },
      iframe: (tagName, attribs) => {
        // Ensure common safe defaults for embeds.
        const title = attribs.title ? attribs.title : "Embedded content";
        const allow = attribs.allow
          ? attribs.allow
          : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        const allowfullscreen =
          typeof attribs.allowfullscreen === "undefined"
            ? "true"
            : attribs.allowfullscreen;

        return {
          tagName,
          attribs: {
            ...attribs,
            title,
            allow,
            allowfullscreen,
            loading: "lazy",
            referrerpolicy: "strict-origin-when-cross-origin",
          },
        };
      },
    },
  });
}

export default function SafeHtml({ html, className }) {
  const clean = sanitize(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
