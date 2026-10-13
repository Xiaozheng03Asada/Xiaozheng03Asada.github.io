<%*
const title = await tp.system.prompt("这篇日记的标题？（直接回车可留空）", "");
const date = tp.date.now("YYYY-MM-DD");
await tp.file.rename(date + (title ? "-" + title : ""));
-%>
---
title: <% title %>
date: <% tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>
showTags: false
hideBackToTop: true
---

