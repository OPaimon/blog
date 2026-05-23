# 个人博客（Lume + Deno）

一个以内容为中心的静态博客项目，使用 [Lume](https://lume.land) 构建。文章源文件在
`src/posts/` 下，以 Markdown / MDX 编写。后台 (LumeCMS) 部署在
[Deno Deploy](https://deno.com/deploy)，静态站本身可托管到任意静态平台。

## 技术栈

- Lume 3（Deno-native SSG）
- MDX
- Vento 模板（`.vto`）
- UnoCSS
- LumeCMS 0.15（管理面板，挂在 `/admin`）

## 项目结构

```text
.
├── public/
├── src/
│   ├── _data.yml              # 站点级数据
│   ├── _includes/layouts/     # 布局模板 (Vento)
│   ├── index.vto              # 首页
│   ├── about.vto              # 关于页
│   ├── tags.page.ts           # 标签页生成器
│   ├── posts/                 # 文章 (.md / .mdx)
│   └── styles/global.css
├── _cms.ts                    # LumeCMS 配置（管理后台入口）
├── _config.ts                 # Lume 站点配置
├── plugins.ts                 # 启用的 Lume 插件
├── unocss.config.ts
└── deno.json
```

## 环境要求

- [Deno](https://deno.com) ≥ 1.45

不需要 Node / pnpm。

## 本地开发

```bash
deno task serve
```

开发服务器默认地址：`http://localhost:3000`

- 前台：`http://localhost:3000/`
- 管理后台：`http://localhost:3000/admin`

本地运行时 CMS 使用文件系统存储，直接读写 `src/`，无需任何 token。

## 常用命令

```bash
deno task serve     # 开发服务器（含热更新）
deno task build     # 构建到 _site/
deno task lume      # 直接调用 Lume CLI，例如 deno task lume upgrade
```

## 写作与发布

### 新增文章

在 `src/posts/` 下新增 `.md`（或 `.mdx`）文件，frontmatter 示例：

```md
---
title: 文章标题
description: 文章摘要
date: 2026-05-23
tags: [lume, 前端]
draft: false
---
```

或者通过 `/admin` 后台可视化创建。

### 构建产物

```bash
deno task build
```

静态站点输出到 `_site/`，可部署到 Vercel / Netlify / Cloudflare Pages / GitHub
Pages 等任意静态托管。

## 部署

### 静态站点

构建 `_site/` 并上传到任意静态托管即可。

### CMS 后台（Deno Deploy）

[_cms.ts](./_cms.ts) 默认导出一个带 `.fetch` 的 LumeCMS 实例，可直接被
`deno serve` 使用。

1. 在 Deno Deploy 新建 project，绑定本仓库。
2. **Entry point**: `_cms.ts`
3. 设置环境变量：
   - `GITHUB_TOKEN` —— 对内容仓库有写权限的 PAT
   - `CMS_USER`、`CMS_PASSWORD` —— 后台 Basic Auth 凭据
4. 绑定独立域名（推荐 `admin.yourdomain.com`）。

运行时通过 `DENO_DEPLOYMENT_ID` 自动切换到 GitHub storage，
通过 GitHub API 读写 `src/`；前台静态站监听同一仓库的 push，
保存后会触发重新构建并发布。
