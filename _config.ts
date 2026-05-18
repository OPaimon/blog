import lume from "lume/mod.ts";
import plugins from "./plugins.ts";

const site = lume({
  src: "./src",
});

site.use(plugins());

// site.process([".html"], (pages) => {
//     for (const page of pages) {
//         const doc = page.document;
//         if (!doc) continue;

//         const aside = doc.querySelector(".post-toc");
//         if (!aside) continue;

//         const article = doc.querySelector("article");
//         if (!article) continue;

//         const headings = article.querySelectorAll("h2, h3");
//         if (!headings.length) continue;

//         type TocItem = { text: string; id: string; children: TocItem[] };
//         const toc: TocItem[] = [];

//         for (const heading of headings) {
//             const el = heading as unknown as { tagName: string; textContent: string; id: string; setAttribute: (k: string, v: string) => void };
//             const text = el.textContent.trim();
//             const id = el.id || text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w一-鿿-]/g, "");
//             if (!el.id) el.setAttribute("id", id);

//             if (el.tagName === "H2") {
//                 toc.push({ text, id, children: [] });
//             } else if (el.tagName === "H3" && toc.length > 0) {
//                 toc[toc.length - 1].children.push({ text, id, children: [] });
//             }
//         }

//         if (toc.length === 0) continue;

//         const renderItems = (items: TocItem[], indent = false): string => {
//             return items.map((item) => {
//                 const cls = indent ? ' class="pl-3"' : "";
//                 let li = `<li${cls}><a href="#${item.id}" class="block opacity-60 hover:opacity-100 no-underline hover:underline leading-snug py-0.5">${item.text}</a>`;
//                 if (item.children.length > 0) {
//                     li += `<ul class="m-0 p-0 list-none space-y-1">${renderItems(item.children, true)}</ul>`;
//                 }
//                 li += "</li>";
//                 return li;
//             }).join("");
//         };

//         aside.innerHTML = `<nav aria-label="文章目录" class="toc"><p class="m-0 mb-2 text-xs font-semibold uppercase tracking-wider opacity-50">目录</p><ul class="m-0 p-0 list-none space-y-1 text-sm">${renderItems(toc)}</ul></nav>`;
//     }
// });

export default site;
