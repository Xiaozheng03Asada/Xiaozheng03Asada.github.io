// static/js/umami-footer.js
(function () {
  const websiteId = '6b19b065-a8db-403e-80b0-1ff1da10ae24';
  const apiKey = 'api_GTOZvVQYnxhODtYgHWdIrE1R04ufKfdh';
  const siteStart = '2025-10-13T00:00:00+08:00'; // 站点上线时间

  function formatDuration(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${days}天${hours}小时${minutes}分钟`;
  }

  async function loadUmami() {
    try {
      const endAt = Date.now();
      const res = await fetch(`https://cloud.umami.is/api/websites/${websiteId}/stats?startAt=0&endAt=${endAt}`, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      });
      const data = await res.json();
      document.getElementById('umami-pageviews').textContent = `访问量：${data.pageviews?.value ?? '未知'}`;
    } catch (err) {
      console.error('加载 Umami 数据失败', err);
      document.getElementById('umami-pageviews').textContent = '访问量：获取失败';
    }
  }

  function renderUptime() {
    const diff = Date.now() - new Date(siteStart).getTime();
    document.getElementById('site-uptime').textContent = `运行时间：${formatDuration(diff)}`;
  }

  loadUmami();
  renderUptime();
  setInterval(renderUptime, 60000);
})();
