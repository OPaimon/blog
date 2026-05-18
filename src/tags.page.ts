export const layout = "layouts/base.vto";
export const renderOrder = 1;

interface PageData {
  url: string;
  title: string;
  date: Date;
  tags?: string[];
  draft?: boolean;
}

export default function* ({ search }: Lume.Data) {
  const posts = search.pages<PageData>("type=post draft!=true", "date=desc");

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const tags = [...tagCounts.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // Tag index page
  const tagListHtml = tags.length === 0
    ? `<p class="m-0 opacity-80">暂时还没有标签。</p>`
    : `<ul class="m-0 p-0 list-none flex flex-wrap gap-2">${
      tags.map(([tag, count]) =>
        `<li><a href="/tags/${tag}/" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-current no-underline hover:underline opacity-70 hover:opacity-100"><span>${tag}</span><span class="text-xs opacity-70">${count}</span></a></li>`
      ).join("")
    }</ul>`;

  yield {
    url: "/tags/",
    title: "标签",
    description: "按主题分类浏览博客文章。",
    content: `<h1 class="m-0 text-2xl font-semibold">标签</h1>${tagListHtml}`,
  };

  // Per-tag pages
  for (const [tag, count] of tags) {
    const tagPosts = posts.filter((p) => p.tags?.includes(tag));
    const listHtml = tagPosts.map((post) =>
      `<li class="border-b pb-2"><span class="text-sm opacity-60 mr-4">${
        post.date.toLocaleDateString("zh-CN")
      }</span><a href="${post.url}" class="text-xl font-medium hover:underline">${post.title}</a></li>`
    ).join("");

    yield {
      url: `/tags/${tag}/`,
      title: `标签：${tag}`,
      description: `包含标签「${tag}」的文章。`,
      content:
        `<div class="flex items-baseline gap-3"><h1 class="m-0 text-2xl font-semibold">${tag}</h1><span class="text-sm opacity-60">${count} 篇文章</span></div><ul class="space-y-4 mt-4">${listHtml}</ul><a href="/tags/" class="text-sm opacity-60 hover:opacity-100 no-underline hover:underline">← 所有标签</a>`,
    };
  }
}
