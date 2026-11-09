(() => {
  const path = decodeURIComponent(window.location.pathname).toLowerCase();
  const isOriginalsNested = path.includes('/the originals/ligacao-entre-series/');
  const series = path.includes('/supernatural/') ? 'supernatural'
    : path.includes('/diario de um vampiro/') ? 'vampire-diaries'
    : path.includes('/the originals/') ? 'originals' : '';
  if (!series || /(?:^|\/)(?:supernatural|diariodeumvampiro|the-originals)\.html$/.test(path)) return;
  const root = new URL(series === 'originals' && isOriginalsNested ? '../' : './', window.location.href);
  const home = series === 'supernatural' ? 'supernatural.html'
    : series === 'vampire-diaries' ? 'diariodeumvampiro.html' : 'the-originals.html';
  const nav = document.createElement('nav');
  nav.className = `series-quickbar series-quickbar--${series}`;
  nav.setAttribute('aria-label', 'Navega??o r?pida');
  document.body.classList.add('has-series-quickbar');
  const back = document.createElement('a');
  back.href = new URL(home, root).href;
  back.textContent = 'Voltar';
  const favorites = document.createElement('a');
  favorites.href = new URL('../Site principal/nossas-coisas/Suas series favoritos.html', root).href;
  favorites.textContent = 'Outros favoritos';
  nav.append(back, favorites);
  const anchor = document.querySelector('.barra-navegacao, .cabecalho, .titulo, header, main');
  if (anchor) anchor.before(nav);
})();
