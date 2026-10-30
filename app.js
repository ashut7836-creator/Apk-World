(() => {
  const grid = document.getElementById('library-grid');
  const count = document.getElementById('item-count');
  const search = document.getElementById('search');
  let items = [];
  let filter = 'all';
  document.getElementById('year').textContent = new Date().getFullYear();

  const make = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };

  function safeLocalFile(path) {
    if (typeof path !== 'string' || !path.trim() || path.includes('..') || path.startsWith('/') || path.includes('\\')) return null;
    return new URL(path, window.location.href).href;
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = items.filter(item => {
      const type = item.type === 'link' ? 'link' : item.type;
      return (filter === 'all' || type === filter) &&
        (String(item.title || '') + ' ' + String(item.description || '')).toLowerCase().includes(query);
    });
    count.textContent = visible.length + (visible.length === 1 ? ' item' : ' items');
    grid.replaceChildren();

    if (!visible.length) {
      const empty = make('div', 'empty');
      empty.append(make('h3', '', query ? 'No matching uploads' : 'The library is ready for its first upload'));
      empty.append(make('p', '', query ? 'Try another search or category.' : 'Apps, links and videos added to APK World will appear here.'));
      grid.append(empty);
      return;
    }

    visible.forEach(item => {
      const card = make('article', 'media-card');
      const top = make('div', 'card-top');
      const isVideo = item.type === 'video';
      const isLink = item.type === 'link';
      top.append(make('div', 'type-icon ' + (isVideo ? 'video' : ''), isVideo ? '▶' : (isLink ? '↗' : '▣')));
      top.append(make('span', 'tag ' + (isVideo ? 'video' : ''), isVideo ? 'VIDEO' : (isLink ? 'DOWNLOAD LINK' : 'APK')));
      card.append(top, make('h3', 'card-title', item.title || 'Untitled'), make('p', 'card-desc', item.description || ''));
      const source = isLink ? (typeof item.url === 'string' && item.url.startsWith('https://') ? item.url : null) : safeLocalFile(item.file);

      if (isVideo && source) {
        const player = make('video', 'card-video');
        player.controls = true;
        player.preload = 'none';
        player.playsInline = true;
        player.src = source;
        if (item.thumbnail) {
          const thumbnail = safeLocalFile(item.thumbnail);
          if (thumbnail) player.poster = thumbnail;
        }
        card.append(player);
      }

      const meta = make('div', 'card-meta');
      const details = [];
      if (item.version) details.push('Version ' + item.version);
      if (item.size) details.push(String(item.size));
      if (item.date) details.push(String(item.date));
      meta.append(make('span', '', details.join(' · ') || (isVideo ? 'VIDEO' : 'ANDROID')));
      card.append(meta);

      if (!isVideo && source) {
        const link = make('a', 'card-action', isLink ? 'Open link ↗' : 'Download APK ↓');
        link.href = source;
        link.rel = 'noopener noreferrer';
        if (isLink) link.target = '_blank';
        else link.setAttribute('download', '');
        card.append(link);
      } else if (isVideo && !source) {
        card.append(make('p', 'hint', 'Video file not available.'));
      }
      grid.append(card);
    });
  }

  document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      filter = button.dataset.filter;
      render();
    });
  });
  search.addEventListener('input', render);

  fetch('media.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Could not load the library.');
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('The library file has an invalid format.');
      items = data.filter(item => item && ['app', 'video', 'link'].includes(item.type) && typeof item.title === 'string');
      render();
    })
    .catch(error => {
      console.error(error);
      count.textContent = 'Library unavailable';
      grid.replaceChildren();
      const empty = make('div', 'empty');
      empty.append(make('h3', '', 'APK World is getting ready'));
      empty.append(make('p', '', 'The content library could not be loaded. Please try again later.'));
      grid.append(empty);
    });
})();