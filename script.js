/* Укажите здесь подтверждённый e-mail владельца сайта, например:
   const CONTACT_EMAIL = 'hello@example.com';
   Пока пусто — сайт честно собирает черновик заявки, но ничего не отправляет сам. */
const CONTACT_EMAIL = 'egorlehanov600@gmail.com';

/* ── мобильное меню ── */
const burger = document.querySelector('.burger');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
    mobileNav.hidden = open;
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
  }));
}

/* ── появление блоков при прокрутке (герой виден сразу, без ожидания) ── */
const revealEls = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const belowFold = [...revealEls].filter(el => el.getBoundingClientRect().top > window.innerHeight * 0.92);
  belowFold.forEach(el => el.classList.add('pre-reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  belowFold.forEach(el => io.observe(el));
}

/* ── галереи в карточках игр ── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const mainBtn = gallery.querySelector('[data-lightbox]');
  const mainImg = gallery.querySelector('[data-main-img]');
  const caption = gallery.querySelector('[data-caption]');
  const thumbs = gallery.querySelectorAll('.g-thumbs button');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('is-active')) return;
      thumbs.forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      gallery.classList.add('is-fading');
      const swap = () => {
        mainImg.src = thumb.dataset.full;
        mainImg.alt = thumb.dataset.alt || '';
        if (caption) caption.textContent = thumb.dataset.cap || '';
        gallery.classList.remove('is-fading');
      };
      setTimeout(swap, 140);
    });
  });

  if (mainBtn) {
    mainBtn.addEventListener('click', () => {
      lbImg.src = mainImg.src;
      lbImg.alt = mainImg.alt;
      lbCap.textContent = caption ? caption.textContent : mainImg.alt;
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  }
});
document.getElementById('lbClose').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

/* ── фильтр по жанрам ── */
const chips = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.game-card');
const emptyFilter = document.getElementById('emptyFilter');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const f = chip.dataset.filter;
    let visible = 0;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.genre === f;
      card.hidden = !show;
      if (show) visible++;
    });
    if (emptyFilter) emptyFilter.hidden = visible !== 0;
  });
});

/* ── переход к форме заказа ── */
const serviceType = document.getElementById('serviceType');
const referenceGame = document.getElementById('referenceGame');
const orderSection = document.getElementById('order');
const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function goToOrder({ reference = '', service = '' } = {}) {
  if (reference) {
    referenceGame.value = reference;
    if (!serviceType.value) serviceType.value = 'Небольшая 3D-игра';
  }
  if (service) serviceType.value = service;
  orderSection.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}
document.querySelectorAll('[data-similar]').forEach(b =>
  b.addEventListener('click', () => goToOrder({ reference: b.dataset.similar })));
document.querySelectorAll('[data-service]').forEach(b =>
  b.addEventListener('click', () => goToOrder({ service: b.dataset.service })));

/* ── форма заявки ── */
const orderForm = document.getElementById('orderForm');
const result = document.getElementById('draftResult');
const draftText = document.getElementById('draftText');
const draftStatus = document.getElementById('draftStatus');
const contactNote = document.getElementById('draftContactNote');
let currentDraft = '';

orderForm.addEventListener('submit', e => {
  e.preventDefault();
  for (const f of [orderForm.elements.name, orderForm.elements.contact, orderForm.elements.idea]) {
    f.setCustomValidity(f.value.trim() ? '' : 'Заполните это поле');
  }
  if (!orderForm.reportValidity()) return;

  const data = new FormData(orderForm);
  const v = k => String(data.get(k) || '').trim();
  currentDraft = [
    'ЗАЯВКА НА РАЗРАБОТКУ ИГРЫ — GOGOWERU (Подземелье игр)',
    '',
    `Имя: ${v('name')}`,
    `Контакт для ответа: ${v('contact')}`,
    `Квест (формат): ${v('type')}`,
    `Референс из подземелья: ${v('reference') || 'не выбран'}`,
    `Бюджет: ${v('budget') || 'обсудим'}`,
    `Желаемый срок: ${v('deadline') || 'обсудим'}`,
    '',
    'О проекте:',
    v('idea')
  ].join('\n');

  draftText.value = currentDraft;
  draftStatus.textContent = '';
  contactNote.textContent = CONTACT_EMAIL
    ? 'Нажмите «Открыть письмо» и подтвердите отправку в своей почтовой программе. Данные не передаются через сайт.'
    : 'Адрес получателя пока не указан: впишите его в почте вручную. Владельцу сайта: добавьте e-mail в начале файла script.js — и письма будут адресованы автоматически.';
  result.hidden = false;
  result.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
});

document.getElementById('copyDraft').addEventListener('click', async () => {
  if (!currentDraft) return;
  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(currentDraft); copied = true; } catch (_) { /* запасной путь ниже */ }
  }
  if (!copied) {
    draftText.focus(); draftText.select();
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
  }
  draftStatus.textContent = copied ? 'Текст заявки скопирован. Осталось отправить его разработчику!' : 'Выделите текст заявки и скопируйте его вручную.';
});

document.getElementById('emailDraft').addEventListener('click', () => {
  if (!currentDraft) return;
  if (!CONTACT_EMAIL) draftStatus.textContent = 'В открывшемся письме укажите адрес получателя вручную.';
  const subject = encodeURIComponent('Заявка на разработку игры — Gogoweru');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(currentDraft)}`;
});

document.getElementById('year').textContent = new Date().getFullYear();
