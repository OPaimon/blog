# 个人博客（Astro + MDX）

一个以内容为中心的静态博客项目，使用 Astro 构建，文章来源于 `src/content/blog` 下的 MDX 文件。

## 技术栈

- Astro 5
- MDX（`@astrojs/mdx`）
- TypeScript
- UnoCSS
- ESLint（`@antfu/eslint-config`）

## 项目结构

```text
.
├── public/
├── src/
│   ├── components/       # 页面组件（导航、文章列表、目录等）
│   ├── content/
│   │   ├── config.ts     # 内容 schema
│   │   └── blog/         # 博客文章（.mdx）
│   ├── layouts/          # 页面布局
│   ├── pages/            # 路由页面
│   └── styles/           # 全局样式
├── astro.config.mjs
└── package.json
```

## 本地开发

```bash
pnpm install
pnpm dev --host
```

开发服务器默认地址：`http://localhost:4321`

## 常用命令

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm lint:fix
pnpm check
pnpm format
```

说明：

- `pnpm lint`: 运行 ESLint 检查
- `pnpm check`: 运行 `astro check`（类型与内容检查）
- `pnpm format`: 使用 ESLint 自动修复可修复问题

## 写作与发布

### 新增文章

在 `src/content/blog/` 下新增 `.mdx` 文件，并在 frontmatter 中提供至少以下字段：

```md
---
title: 文章标题
description: 文章摘要
pubDate: 2026-03-12
tags: [Astro, 前端]
---
```

### 构建产物

```bash
pnpm build
```

静态站点输出到 `dist/`。

### 发布方式

项目是静态站点，可部署到任意静态托管平台（如 Vercel、Netlify、Cloudflare Pages、GitHub Pages）。
