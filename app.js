(() => {
  const SUPABASE_URL = 'https://c--05719e7a-a474-4306-8357-699a6212224f-prod.lovable.cloud';
  const SUPABASE_KEY = 'sb_publishable_pNb7LJp5G4k69yUd2xIZPw_lmjY6mHm';
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

  function httpsUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'https:' ? parsed.href : null;
    } catch (_) { return null; }
  }

  function mapRecord(row) {
    return {
      type: row.kind, title: row.title, description: row.description || '',
      version: row.version || '', size: row.file_size || '', date: row.published_at || '',
      url: row.url || '', file_path: row.file_path || '', thumbnail: row.thumbnail_url || ''
    };
  }

  async function makeSignedUrl(path, downloadName) {
    if (typeof path !== 'string' || !path.trim() || path.startsWith('/') || path.split('/').includes('..') || path.includes('\\')) {
      throw new Error('Invalid file path.');
    }
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    const body = { expiresIn: 3600 };
    if (downloadName) body.download = downloadName;
    const response = await fetch(SUPABASE_URL + '/storage/v1/object/sign/downloads/' + encodedPath, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Could not prepare this file. Please try again.');
    const result = await response.json();
    const signed = result.signedURL || result.signedUrl;
    if (typeof signed !== 'string') throw new Error('The file link was not returned.');
    if (/^https:\/\//i.test(signed)) return signed;
    if (signed.startsWith('/storage/v1/')) return SUPABASE_URL + signed;
    return SUPABASE_URL + '/storage/v1' + (signed.startsWith('/') ? signed : '/' + signed);
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = items.filter(item =>
      (filter === 'all' || item.type === filter) &&
      (String(item.title || '') + ' ' + String(item.description || '')).toLowerCase().includes(query)
    );
    count.textContent = visible.length + (visible.length === 1 ? ' item' : ' items');
    grid.replaceChildren();

    if (!visible.length) {
      const empty = make('div', 'empty');
      empty.append(make('h3', '', query ? 'No matching uploads' : 'The library is ready for its first upload'));
      empty.append(make('p', '', query ? 'Try another search or category.' : 'Apps, links and videos added by the site owner will appear here.'));
      grid.append(empty);
      return;
    }

    visible.forEach(item => {
      const card = make('article', 'media-card');
      const top = make('div', 'card-top');
      const isVideo = item.type === 'video';
      const isLink = item.type === 'link';
      top.append(make('div', 'type-icon ' + (isVideo ? 'video' : ''), isVideo ? '▶' : (isLink ? '↗' : '▣')));
      top.append(make('span', 'tag ' + (isVideo ? 'video' : ''), isVideo ? 'VIDEO' : (isLink ? 'LINK' : 'APK')));
      card.append(top);

      if (httpsUrl(item.thumbnail)) {
        const image = make('img', 'card-video');
        image.src = httpsUrl(item.thumbnail);
        image.alt = '';
        image.loading = 'lazy';
        card.append(image);
      }

      card.append(make('h3', 'card-title', item.title || 'Untitled'));
      card.append(make('p', 'card-desc', item.description || ''));

      const meta = make('div', 'card-meta');
      const details = [];
      if (item.version) details.push('Version ' + item.version);
      if (item.size) details.push(String(item.size));
      if (item.date) {
        const parsedDate = new Date(item.date + 'T00:00:00');
        if (!Number.isNaN(parsedDate.getTime())) details.push(parsedDate.toLocaleDateString());
      }
      meta.append(make('span', '', details.join(' · ') || (isVideo ? 'VIDEO' : 'ANDROID')));
      card.append(meta);

      if (isLink && httpsUrl(item.url)) {
        const link = make('a', 'card-action', 'Open link ↗');
        link.href = httpsUrl(item.url);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        card.append(link);
      } else if (item.file_path && (item.type === 'app' || isVideo)) {
        const button = make('button', 'card-action', isVideo ? 'Play video ▶' : 'Download APK ↓');
        button.type = 'button';
        button.addEventListener('click', async () => {
          button.disabled = true;
          button.textContent = 'Preparing…';
          try {
            const filename = item.file_path.split('/').pop();
            const url = await makeSignedUrl(item.file_path, item.type === 'app' ? filename : null);
            if (isVideo) {
              const player = make('video', 'card-video');
              player.controls = true;
              player.playsInline = true;
              player.preload = 'metadata';
              player.src = url;
              const previous = card.querySelector('video.card-video');
              if (previous) previous.remove();
              card.insertBefore(player, card.querySelector('.card-title'));
              player.play().catch(() => {});
              button.textContent = 'Video ready';
            } else {
              window.location.assign(url);
              button.textContent = 'Opening download…';
            }
          } catch (error) {
            button.textContent = 'Try again';
            alert(error && error.message ? error.message : 'Could not open this file.');
          } finally {
            button.disabled = false;
          }
        });
        card.append(button);
      } else if (httpsUrl(item.url)) {
        const link = make('a', 'card-action', isVideo ? 'Watch video ↗' : 'Open link ↗');
        link.href = httpsUrl(item.url);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        card.append(link);
      } else {
        card.append(make('p', 'hint', 'File or link not available.'));
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

  async function loadCatalogue() {
    const endpoint = SUPABASE_URL + '/rest/v1/catalogue_items?select=*&order=published_at.desc,created_at.desc';
    const response = await fetch(endpoint, {
      headers: { apikey: SUPABASE_KEY, Accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Could not load the live catalogue.');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('The live catalogue returned an invalid response.');
    return data.filter(row => row && ['app', 'video', 'link'].includes(row.kind) && typeof row.title === 'string').map(mapRecord);
  }

  loadCatalogue().then(data => {
    items = data;
    render();
  }).catch(error => {
    console.error(error);
    fetch('media.json', { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Fallback library is unavailable.');
        return response.json();
      })
      .then(data => {
        items = Array.isArray(data) ? data.filter(item => item && ['app', 'video', 'link'].includes(item.type) && typeof item.title === 'string') : [];
        render();
        grid.prepend(make('p', 'hint', 'Showing the saved fallback list because the live catalogue could not be reached.'));
      })
      .catch(() => {
        count.textContent = 'Library unavailable';
        grid.replaceChildren();
        const empty = make('div', 'empty');
        empty.append(make('h3', '', 'World Mods Official is temporarily unavailable'));
        empty.append(make('p', '', 'Please refresh the page later.'));
        grid.append(empty);
      });
  });
})();