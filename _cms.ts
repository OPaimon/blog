import lumeCMS from "lume/cms/mod.ts";
import GitHub from "lume/cms/storage/github.ts";

const token = Deno.env.get("GITHUB_TOKEN");
const cmsUser = Deno.env.get("CMS_USER");
const cmsPassword = Deno.env.get("CMS_PASSWORD");

// On Deno Deploy there is no writable filesystem, so use GitHub storage.
// Locally, fall back to filesystem storage so `deno task lume -s` works
// without any credentials.
const onDeploy = !!Deno.env.get("DENO_DEPLOYMENT_ID");

const cms = lumeCMS({
  root: onDeploy ? "" : Deno.cwd(),
  basePath: "/admin",
  site: {
    name: "后台",
  },
});

if (cmsUser && cmsPassword) {
  cms.auth({ [cmsUser]: cmsPassword });
}

if (onDeploy) {
  if (!token) {
    throw new Error("GITHUB_TOKEN is required on Deno Deploy");
  }
  cms.storage("src", GitHub.create("opaimon/blog/src", token));
} else {
  cms.storage("src");
}

cms.upload({
  name: "images",
  store: "src:assets/img",
  publicPath: "/img",
});

cms.collection({
  name: "posts",
  label: "文章管理",
  description: "撰写、编辑或删除技术博客和排查记录",
  store: "src:posts/*.md",

  documentName: "{title}.md",
  rename: "auto",

  fields: [
    "title: text!",
    "author: text",
    "description: textarea",
    {
      name: "date",
      label: "发布日期",
      type: "datetime",
    },
    {
      name: "updatedDate",
      label: "最后更新",
      type: "datetime",
    },
    {
      name: "tags",
      label: "标签分类",
      type: "list",
    },
    {
      name: "draft",
      label: "是否为草稿",
      type: "checkbox",
    },
    "content: markdown",
  ],
});

export default cms;