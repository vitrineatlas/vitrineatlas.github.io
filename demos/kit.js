/* Kit commun aux démos Vitrine Atlas */
(function(){
  var me = document.currentScript;
  var sector = (me && me.getAttribute('data-sector')) || 'site vitrine';
  var shot = /[?&]shot/.test(location.search);
  if (shot) Array.prototype.forEach.call(document.querySelectorAll('img[loading="lazy"]'), function(i){ i.loading = 'eager'; });

  /* bandeau démo */
  var msg = encodeURIComponent("Bonjour Vitrine Atlas, j'ai vu votre démo « " + sector + " ». Je voudrais un site comme celui-ci pour mon commerce.");
  var bar = document.createElement('div');
  bar.className = 'va-bar';
  bar.setAttribute('role', 'complementary');
  bar.setAttribute('aria-label', 'Démonstration Vitrine Atlas');
  bar.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="6" width="32" height="29" rx="7" fill="#2563EB"/><rect x="9" y="12" width="22" height="17" rx="3" fill="#fff"/><path d="M9 29l7-9 4 5 4-6 7 10z" fill="#22D3EE"/><circle cx="26.5" cy="16" r="1.8" fill="#2563EB"/></svg>'
    + '<span class="t">Site de démonstration réalisé par <b>Vitrine Atlas</b></span><span class="s">Démo Vitrine Atlas</span>'
    + '<a href="https://wa.me/212663892173?text=' + msg + '" target="_blank" rel="noopener">Je veux ce site</a>'
    + '<button type="button" aria-label="Réduire le bandeau" aria-expanded="true">×</button>';
  var space = document.createElement('div'); space.className = 'va-space';
  document.body.appendChild(space);
  if (!shot) document.body.appendChild(bar);
  var bb = bar.querySelector('button');
  bb.addEventListener('click', function(){
    var m = bar.classList.toggle('min');
    bb.textContent = m ? '+' : '×';
    bb.setAttribute('aria-expanded', m ? 'false' : 'true');
    bb.setAttribute('aria-label', m ? 'Afficher le bandeau' : 'Réduire le bandeau');
  });

  /* notification */
  var toast = document.createElement('div');
  toast.className = 'va-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  var tt;
  window.vaToast = function(title, text){
    toast.innerHTML = '<b></b><span></span>';
    toast.querySelector('b').textContent = title;
    toast.querySelector('span').textContent = text || '';
    toast.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove('on'); }, 6000);
  };
  toast.addEventListener('click', function(){ toast.classList.remove('on'); });
  var DEF = "C’est une démo : sur votre vrai site, cette demande arrive directement sur votre WhatsApp ou votre e-mail.";
  document.addEventListener('submit', function(e){
    var f = e.target; if (f.hasAttribute('data-own')) return;
    e.preventDefault();
    vaToast(f.getAttribute('data-title') || 'Demande envoyée (démo)', f.getAttribute('data-msg') || DEF);
  });
  document.addEventListener('click', function(e){
    var a = e.target.closest('[data-demo]');
    if (!a) return;
    e.preventDefault();
    vaToast(a.getAttribute('data-demo-title') || 'Lien de démonstration', a.getAttribute('data-demo') || DEF);
  });

  /* menu mobile */
  Array.prototype.forEach.call(document.querySelectorAll('.burger'), function(btn){
    var nav = document.getElementById(btn.getAttribute('aria-controls'));
    if (!nav) return;
    function set(o){ btn.setAttribute('aria-expanded', o ? 'true' : 'false'); nav.classList.toggle('open', o); btn.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu'); }
    btn.addEventListener('click', function(){ set(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function(e){ if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') set(false); });
  });

  /* en-tête au défilement */
  var h = document.querySelector('[data-header]');
  if (h){ var f = function(){ h.classList.toggle('scrolled', window.scrollY > 40); }; f(); window.addEventListener('scroll', f, {passive:true}); }

  /* onglets : [data-tabs] > [role=tab][aria-controls] */
  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function(box){
    var tabs = box.querySelectorAll('[role="tab"]');
    Array.prototype.forEach.call(tabs, function(t){
      t.addEventListener('click', function(){
        Array.prototype.forEach.call(tabs, function(o){
          var on = o === t; o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1;
          var p = document.getElementById(o.getAttribute('aria-controls')); if (p) p.hidden = !on;
        });
      });
      t.addEventListener('keydown', function(e){
        var i = Array.prototype.indexOf.call(tabs, t), n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n){ e.preventDefault(); n.focus(); n.click(); }
      });
    });
  });

  /* ouvert / fermé en direct : [data-hours='{"1":["09:00","19:00"],...}'] (0 = dimanche), heure du Maroc */
  Array.prototype.forEach.call(document.querySelectorAll('[data-hours]'), function(el){
    try{
      var H = JSON.parse(el.getAttribute('data-hours'));
      var now = new Date(new Date().toLocaleString('en-US', {timeZone:'Africa/Casablanca'}));
      var d = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
      var r = H[d], open = false, txt;
      function m(s){ var p = s.split(':'); return +p[0] * 60 + +p[1]; }
      if (r){ for (var i = 0; i < r.length; i += 2){ if (mins >= m(r[i]) && mins < m(r[i + 1])) { open = true; txt = 'Ouvert maintenant · jusqu’à ' + r[i + 1].replace(':', 'h'); } } }
      if (!open){
        txt = 'Fermé maintenant';
        for (var k = 0; k < 8; k++){ var dd = (d + k) % 7, rr = H[dd]; if (!rr) continue;
          for (var j = 0; j < rr.length; j += 2){ if (k > 0 || m(rr[j]) > mins){ var jours = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
            txt += ' · ouvre ' + (k === 0 ? 'à ' : k === 1 ? 'demain à ' : jours[dd] + ' à ') + rr[j].replace(':', 'h'); k = 9; break; } } }
      }
      el.textContent = txt; el.classList.add(open ? 'is-open' : 'is-closed');
      var row = document.querySelector('[data-day="' + d + '"]'); if (row) row.classList.add('today');
    }catch(e){}
  });

  /* apparition au défilement */
  var els = document.querySelectorAll('.rv');
  if (shot || !('IntersectionObserver' in window)){ Array.prototype.forEach.call(els, function(e){ e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if (x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } }); }, {rootMargin:'0px 0px -8% 0px'});
    Array.prototype.forEach.call(els, function(e){ io.observe(e); });
  }

  /* dates min = aujourd'hui */
  var today = new Date(); var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  Array.prototype.forEach.call(document.querySelectorAll('input[type="date"]'), function(i){ if (!i.min) i.min = iso; });
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function(e){ e.textContent = today.getFullYear(); });
})();
