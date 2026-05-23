import mdx from "lume/plugins/mdx.ts";
import unocss from "lume/plugins/unocss.ts";
import metas from "lume/plugins/metas.ts";
import date from "lume/plugins/date.ts";
import prism from "lume/plugins/prism.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed from "lume/plugins/feed.ts";
import robots from "lume/plugins/robots.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import pagefind from "lume/plugins/pagefind.ts";
import ogImages from "lume/plugins/og_images.ts";
import { read } from "lume/core/utils/read.ts";

import unocssConfig from "./unocss.config.ts";

import "lume/types.ts";

// Satori (og_images) defaults to Inter, which has no CJK glyphs. Load Noto Sans
// SC so Chinese titles/descriptions render instead of tofu. `read` caches the
// remote file in Lume's `lume_remote_files` cache, so it's fetched once.
const notoSansSCUrl =
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf";
const notoSansSCBold =
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Bold.otf";

// Prism language grammars used across posts. Base prismjs only ships
// markup/css/clike/js, so ts/yaml/bash/json must be registered explicitly.
import "npm:prismjs@1.30.0/components/prism-typescript.js";
import "npm:prismjs@1.30.0/components/prism-yaml.js";
import "npm:prismjs@1.30.0/components/prism-bash.js";
import "npm:prismjs@1.30.0/components/prism-json.js";

export default async function () {
  // Load CJK fonts up front so the returned installer stays synchronous —
  // site.use() calls plugins synchronously and does not await them.
  const [regular, bold] = await Promise.all([
    read(notoSansSCUrl, true),
    read(notoSansSCBold, true),
  ]);

  return (site: Lume.Site) => {
    site.use(mdx())
      .use(unocss({ options: unocssConfig }))
      .use(slugifyUrls({
        alphanumeric: false, // keep non-ASCII characters
        lowercase: true,
        separator: "-",
        replace: {
          "&": "-and-",
        },
      }))
      .use(ogImages({
        options: {
          fonts: [
            {
              name: "Noto Sans SC",
              data: regular.buffer as ArrayBuffer,
              weight: 400,
              style: "normal",
            },
            {
              name: "Noto Sans SC",
              data: bold.buffer as ArrayBuffer,
              weight: 700,
              style: "normal",
            },
          ],
        },
      }))
      .use(metas())
      .use(date())
      .use(prism())
      .add("style.css")
      .copy("styles/global.css")
      .use(sitemap())
      .use(robots())
      .use(readingInfo())
      .use(pagefind({
        ui: {
          containerId: "search",
          showImages: false,
          showEmptyFilters: false,
          excerptLength: 30,
          resetStyles: false,
          translations: {
            placeholder: "搜索文章",
            zero_results: "没有找到 [SEARCH_TERM] 的结果",
            many_results: "找到 [COUNT] 条 [SEARCH_TERM] 的结果",
            one_result: "找到 [COUNT] 条 [SEARCH_TERM] 的结果",
            load_more: "加载更多",
            search_label: "站内搜索",
            clear_search: "清除",
          },
        },
      }));
    site.use(feed({
      output: ["/rss.xml", "/rss.json"],
      query: "url^=/posts/", // 或者用 "type=post"，取决于你怎么组织文章
      sort: "date=desc",
      limit: 20,
      info: {
        title: "=site.title",
        description: "=site.description",
        lang: "zh",
        generator: true,
      },
      items: {
        title: "=title",
        description: "=description",
        published: "=date",
        content: "=children",
        lang: "zh",
      },
    }));

    buildToc(site);

    site.use(minifyHTML());
  };
}

// Build the table of contents from rendered HTML so it works for both .md and
// .mdx posts. The markdown-it `toc` plugin only ran in the markdown pipeline,
// leaving .mdx posts without a TOC; post-processing the HTML covers both.
function buildToc(site: Lume.Site) {
  site.process([".html"], (pages) => {
    for (const page of pages) {
      const doc = page.document;
      if (!doc) continue;

      const aside = doc.querySelector(".post-toc");
      if (!aside) continue;

      const article = doc.querySelector("article");
      if (!article) continue;

      const headings = article.querySelectorAll("h2, h3");
      if (!headings.length) {
        aside.remove();
        continue;
      }

      const slugify = (text: string) =>
        text
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w一-鿿-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

      type TocItem = { text: string; id: string; children: TocItem[] };
      const toc: TocItem[] = [];
      const seen = new Map<string, number>();

      for (const node of headings) {
        const heading = node as unknown as {
          tagName: string;
          textContent: string;
          id: string;
          setAttribute: (k: string, v: string) => void;
        };
        const text = heading.textContent.trim();
        let id = heading.id || slugify(text) || "section";
        const count = seen.get(id) ?? 0;
        seen.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;
        if (!heading.id) heading.setAttribute("id", id);

        if (heading.tagName === "H2") {
          toc.push({ text, id, children: [] });
        } else if (heading.tagName === "H3" && toc.length > 0) {
          toc[toc.length - 1].children.push({ text, id, children: [] });
        }
      }

      if (toc.length === 0) {
        aside.remove();
        continue;
      }

      const link =
        "block opacity-60 hover:opacity-100 no-underline hover:underline leading-snug py-0.5";
      const renderItems = (items: TocItem[]): string =>
        items
          .map((item) => {
            let li =
              `<li><a href="#${item.id}" class="${link}">${item.text}</a>`;
            if (item.children.length) {
              li += `<ul class="m-0 p-0 list-none pl-3 space-y-1">${
                renderItems(item.children)
              }</ul>`;
            }
            return li + "</li>";
          })
          .join("");

      aside.innerHTML =
        `<nav aria-label="文章目录" class="toc"><p class="m-0 mb-2 text-xs font-semibold uppercase tracking-wider opacity-50">目录</p><ul class="m-0 p-0 list-none space-y-1 text-sm">${
          renderItems(toc)
        }</ul></nav>`;
    }
  });
}
