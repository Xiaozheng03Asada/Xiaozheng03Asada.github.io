// static/js/umami-footer.js
(function () {
  const shareId = 'U63fmlnzu8CuQ25x';
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
      const apiUrl = `https://cloud.umami.is/api/share/${shareId}/stats?startAt=0&endAt=${endAt}`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        throw new Error(`Umami stats request failed: ${res.status} ${res.statusText}`);
      }
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
