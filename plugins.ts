import mdx from "lume/plugins/mdx.ts";
import unocss from "lume/plugins/unocss.ts";
import metas from "lume/plugins/metas.ts";
import date from "lume/plugins/date.ts";
import toc from "markdown-plugins/toc.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed from "lume/plugins/feed.ts";
import robots from "lume/plugins/robots.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import minifyHTML from "lume/plugins/minify_html.ts";

import unocssConfig from "./unocss.config.ts";

import "lume/types.ts";

export default function () {
  return (site: Lume.Site) => {
    site.use(mdx())
      .use(unocss({ options: unocssConfig }))
      .use(slugifyUrls())
      .use(metas())
      .use(date())
      .use(toc({
        anchor: false,
        slugify(text) {
          return text
            .toLowerCase()
            .trim()
            .replace(/[\s]+/g, "-")
            .replace(/[^\w\u4e00-\u9fff-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
        },
      }))
      .add("style.css")
      .copy("styles/global.css")
      .use(sitemap())
      .use(robots())
      .use(readingInfo());
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
    }))
      .use(minifyHTML());
  };
}
