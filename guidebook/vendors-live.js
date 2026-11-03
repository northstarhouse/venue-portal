// Fills the vendor list from the venue team's list (added in the Portal under Venue Rentals > Tools), so a new recommendation shows up in every
// guide without editing the pages. If the list can't be loaded, the list already written in the page stays as it is.
(function () {
  var grid = document.querySelector('.vendors');
  if (!grid) return;
  var URL = 'https://uvzwhhwzelaelfhfkvdb.supabase.co', KEY = 'sb_publishable_EbFMfEbyEp3gASl-GZm3tQ_LnPEe5do';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function safeUrl(u) { u = String(u || '').trim(); if (!u) return ''; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; return /^https?:\/\/[^\s"<>]+$/i.test(u) ? u : ''; }
  fetch(URL + '/rest/v1/venue_vendors?select=category,category_order,name,website,phone,instagram,email,sort_order&active=eq.true&order=category_order.asc,category.asc,sort_order.asc,name.asc&limit=1000',
    { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (rows) {
      if (!Array.isArray(rows) || !rows.length) return;
      var cats = [], by = {};
      rows.forEach(function (v) { if (!by[v.category]) { by[v.category] = []; cats.push(v.category); } by[v.category].push(v); });
      grid.innerHTML = cats.map(function (c) {
        return '<div class="vcard"><h3>' + esc(c) + '</h3><ul>' + by[c].map(function (v) {
          var site = safeUrl(v.website);
          var name = site ? '<a href="' + esc(site) + '" target="_blank" rel="noopener">' + esc(v.name) + '</a>' : esc(v.name);
          var bits = [];
          if (v.phone) bits.push('<a href="tel:' + esc(String(v.phone).replace(/\D/g, '')) + '">' + esc(v.phone) + '</a>');
          if (v.instagram) bits.push(esc(String(v.instagram).charAt(0) === '@' ? v.instagram : '@' + v.instagram));
          if (v.email) bits.push('<a href="mailto:' + esc(v.email) + '">' + esc(v.email) + '</a>');
          return '<li><strong>' + name + '</strong>' + (bits.length ? '<span>' + bits.join(' &middot; ') + '</span>' : '') + '</li>';
        }).join('') + '</ul></div>';
      }).join('');
    }).catch(function () {});
})();
