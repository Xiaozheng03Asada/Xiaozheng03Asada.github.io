<%*
const title = tp.file.title;
const date = tp.date.now("YYYY-MM-DD");
await tp.file.rename(date + "-" + title);
-%>
---
title: "<% title %>"
description: ""
date: <% tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>
theme: "garden-page auto"
math: true
toc: true
---

