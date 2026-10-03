// Mobile menu and tap-to-show glossary tips
(function () {
  var b = document.querySelector('.menu'), n = document.querySelector('nav.main');
  if (b && n) b.addEventListener('click', function () {
    var o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o ? 'true' : 'false');
  });
  document.querySelectorAll('.g').forEach(function (el) { el.setAttribute('tabindex', '0'); });
})();

// Evidence page: filter + search over the embedded ledger (window.LEDGER)
(function () {
  var root = document.getElementById('ledger'); if (!root || !window.LEDGER) return;
  var NAMES = { verified: 'Verified', partly: 'Partly verified', model: 'Our model (untested)', unverified: 'Not verified' };
  var state = { status: 'all', q: '' };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    var rows = window.LEDGER.filter(function (e) {
      if (state.status !== 'all' && e.status !== state.status) return false;
      if (!state.q) return true;
      var hay = (e.topic + ' ' + e.ours + ' ' + e.found + ' ' + e.group + ' ' + e.id).toLowerCase();
      return hay.indexOf(state.q) > -1;
    });
    var out = '', group = null;
    rows.forEach(function (e) {
      if (e.group !== group) { group = e.group; out += '<h3 style="margin-top:40px">' + esc(group) + '</h3>'; }
      out += '<details class="claim" id="' + e.id + '"><summary><span class="id">' + e.id + '</span><span class="t">' + esc(e.topic) + '</span><span class="badge b-' + e.status + '">' + NAMES[e.status] + '</span></summary><div class="body">' +
        '<h5>The claim</h5><p>' + esc(e.ours) + '</p>' +
        '<h5>What the sources say</h5><p>' + esc(e.found) + '</p>' +
        (e.note ? '<h5>Note</h5><p>' + esc(e.note) + '</p>' : '') +
        '<h5>Confidence</h5><p>' + esc(e.confidence) + '</p>' +
        (e.sources.length ? '<h5>Sources</h5><ul>' + e.sources.map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title) + '</a></li>'; }).join('') + '</ul>' : '<h5>Sources</h5><p>None. This is our own estimate.</p>') +
        '</div></details>';
    });
    root.innerHTML = out || '<p>No claims match.</p>';
    document.getElementById('count').textContent = rows.length + ' of ' + window.LEDGER.length + ' claims';
    // open a claim linked from another page
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t && t.tagName === 'DETAILS') { t.open = true; } }
  }
  document.querySelectorAll('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.status = b.dataset.s;
      document.querySelectorAll('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      render();
    });
  });
  document.getElementById('q').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
  window.addEventListener('hashchange', render);
  render();
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
})();
