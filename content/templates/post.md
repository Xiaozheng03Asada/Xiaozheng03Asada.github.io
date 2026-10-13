<%*
const title = tp.file.title;
const date = tp.date.now("YYYY-MM-DD");
await tp.file.rename(date + "-" + title);
-%>
---
title: <% title %>
date: <% date %>
tags:
summary:
showTags: true
toc: true
readTime: true
math: false
---

