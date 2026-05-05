// static/js/umami-footer.js
(function () {
  const siteStart = '2025-10-13T00:00:00+08:00'; // 站点上线时间

  function formatDuration(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${days}天${hours}小时${minutes}分钟`;
  }

  function renderUptime() {
    const uptimeElement = document.getElementById('site-uptime');
    if (!uptimeElement) {
      return;
    }
    const diff = Date.now() - new Date(siteStart).getTime();
    uptimeElement.textContent = `运行时间：${formatDuration(diff)}`;
  }

  renderUptime();
  setInterval(renderUptime, 60000);
})();
