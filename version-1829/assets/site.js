
import { H as Hls } from './hls-vendor-dru42stk.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (value) => String(value ?? '').replace(/[&<>"]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

function setupHeader(){
  const header = $('.site-header');
  const toggle = $('[data-mobile-toggle]');
  const menu = $('[data-mobile-menu]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if(toggle && menu){
    toggle.addEventListener('click', () => menu.classList.toggle('is-open'));
  }
}

function setupHero(){
  const slider = $('[data-hero-slider]');
  if(!slider) return;
  const slides = $$('[data-hero-slide]', slider);
  const dots = $$('[data-hero-dot]', slider);
  let active = 0;
  const show = (idx) => {
    active = (idx + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
  };
  $('[data-hero-prev]', slider)?.addEventListener('click', () => show(active - 1));
  $('[data-hero-next]', slider)?.addEventListener('click', () => show(active + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  show(0);
  setInterval(() => show(active + 1), 6500);
}

function cardTemplate(movie){
  const tags = (movie.tags || []).slice(0, 2).map(t => `<span class="meta-pill">${esc(t)}</span>`).join('');
  return `<a class="movie-card" href="${esc(movie.url)}">
    <div class="poster-wrap"><img src="${esc(movie.cover)}" alt="${esc(movie.title)}" loading="lazy"><span class="badge-type">${esc(movie.type)}</span><span class="badge-year">${esc(movie.year)}</span></div>
    <div class="movie-card-body"><h3 class="movie-card-title">${esc(movie.title)}</h3><p class="movie-card-desc">${esc(movie.oneLine)}</p><div class="meta-row"><span class="meta-pill">${esc(movie.region)}</span>${tags}</div></div>
  </a>`;
}

function setupSearch(){
  const input = $('#movieSearch');
  const category = $('#movieCategory');
  const type = $('#movieType');
  const results = $('#searchResults');
  const count = $('#searchCount');
  if(!input || !results || !window.MOVIE_INDEX) return;
  const run = () => {
    const q = input.value.trim().toLowerCase();
    const c = category?.value || '';
    const t = type?.value || '';
    const hasFilter = q || c || t;
    if(!hasFilter){
      results.classList.remove('is-visible');
      results.innerHTML = '';
      if(count) count.textContent = '';
      return;
    }
    const matched = window.MOVIE_INDEX.filter(movie => {
      const hay = `${movie.title} ${movie.region} ${movie.type} ${movie.year} ${movie.genre} ${(movie.tags||[]).join(' ')} ${movie.oneLine}`.toLowerCase();
      return (!q || hay.includes(q)) && (!c || movie.categorySlug === c) && (!t || movie.type.includes(t));
    });
    const limited = matched.slice(0, 60);
    results.classList.add('is-visible');
    results.innerHTML = limited.length ? `<div class="movie-grid compact">${limited.map(cardTemplate).join('')}</div>` : '<div class="no-results">没有找到匹配影片，请尝试更换关键词或筛选条件。</div>';
    if(count) count.textContent = `找到 ${matched.length} 部影片${matched.length > 60 ? '，当前显示前 60 部' : ''}`;
  };
  input.addEventListener('input', run);
  category?.addEventListener('change', run);
  type?.addEventListener('change', run);
}

function setupPageFilter(){
  const root = $('[data-filter-scope]');
  if(!root) return;
  const input = $('[data-filter-input]', root);
  const year = $('[data-filter-year]', root);
  const type = $('[data-filter-type]', root);
  const cards = $$('[data-filter-card]', root);
  const counter = $('[data-filter-count]', root);
  const run = () => {
    const q = (input?.value || '').trim().toLowerCase();
    const y = year?.value || '';
    const t = type?.value || '';
    let visible = 0;
    cards.forEach(card => {
      const hay = card.dataset.search || '';
      const ok = (!q || hay.toLowerCase().includes(q)) && (!y || card.dataset.year === y) && (!t || (card.dataset.type || '').includes(t));
      card.style.display = ok ? '' : 'none';
      if(ok) visible += 1;
    });
    if(counter) counter.textContent = `当前显示 ${visible} / ${cards.length} 部`;
  };
  input?.addEventListener('input', run);
  year?.addEventListener('change', run);
  type?.addEventListener('change', run);
  run();
}

function setupPlayers(){
  $$('[data-player]').forEach((box) => {
    const video = $('video[data-hls-src]', box);
    if(!video) return;
    const src = video.dataset.hlsSrc;
    const loading = $('[data-player-loading]', box);
    const error = $('[data-player-error]', box);
    const playBtn = $('[data-player-play]', box);
    const hideLoading = () => loading?.classList.add('is-hidden');
    const showError = (msg) => {
      hideLoading();
      if(error){ error.textContent = msg; error.classList.remove('is-hidden'); }
    };
    try{
      if(Hls.isSupported()){
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, hideLoading);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if(data && data.fatal){
            if(data.type === Hls.ErrorTypes.NETWORK_ERROR){
              showError('网络错误，无法加载播放源。');
              hls.startLoad();
            }else if(data.type === Hls.ErrorTypes.MEDIA_ERROR){
              hls.recoverMediaError();
            }else{
              showError('无法播放视频，请稍后重试。');
              hls.destroy();
            }
          }
        });
      }else if(video.canPlayType('application/vnd.apple.mpegurl')){
        video.src = src;
        video.addEventListener('loadedmetadata', hideLoading, { once: true });
      }else{
        showError('您的浏览器不支持 HLS 视频播放。');
      }
    }catch(err){
      showError('播放器初始化失败，请使用现代浏览器访问。');
    }
    playBtn?.addEventListener('click', () => video.play());
    video.addEventListener('play', () => playBtn?.classList.add('is-hidden'));
    video.addEventListener('pause', () => playBtn?.classList.remove('is-hidden'));
    video.addEventListener('canplay', hideLoading);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  setupHero();
  setupSearch();
  setupPageFilter();
  setupPlayers();
});
