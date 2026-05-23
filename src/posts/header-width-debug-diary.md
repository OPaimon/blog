---
title: ' Header 宽度幽灵问题排查'
author: OPaimon
description: 记录今天如何定位并修复 Header 右侧漏底、TOC 错位与容器宽度联动回归问题。
date: 2026-03-12 00:00:00
updatedDate: 2026-05-23 22:07:00
tags:
  - Astro
  - UnoCSS
  - CSS
  - 调试
draft: false
---

## 现象

视口宽度约 778px 时出现：

- Header 背景未覆盖到右侧，正文从缝隙透出
- TOC 在宽屏下位置不稳定
- Header 从宽屏收缩到正文宽度的过渡偶尔失效

---

## 根因

`site-header-inner` 同时使用 `w-full` 与 `px-4`，盒模型为默认的 `content-box`：`w-full` 只计算内容盒，`px-4` 再向外加宽，导致内层渲染宽度大于外层。`main`、`footer` 同样存在 `w-full + padding` 的组合。

---

## 修复

**1. 关键容器统一 `box-border`**

`site-header-inner`、`main`、`footer` 改为 `box-border`，让 padding 计入宽度。

**2. 容器宽度变量包含 padding**

为保持视觉内容宽度不变：

```css
:root {
  --site-container-wide: calc(72ch + 2rem);
  --site-container-prose: calc(65ch + 2rem);
}
```

Header、footer、Header 收缩目标宽度因此保持对齐。

**3. TOC 偏移改用变量**

```css
left: calc(50% + var(--site-container-prose) / 2 + 2rem);
```

避免正文宽度调整后 TOC 公式留下硬编码值。

---

## 备注

- 曾尝试将 Header 改为 `100vw`：会引入横向滚动条，且与居中容器叠加后定位更复杂，未采用。
- 在 `global.css` 加局部补丁可短期遮盖现象，但会累积联动回归。

排查顺序：盒模型 → 宽度来源 → 溢出路径 → 定位公式 → 响应式边界。
