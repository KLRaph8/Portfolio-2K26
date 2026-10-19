/* ==========================================================
   MAIN.JS | Comportement du site (aucune donnée de projet ici)
   Sommaire : 1 Outils · 2 Génération des cartes et filtres · 3 Apparitions
   4 Scroll (progression, parallaxe, timecode) · 5 Filtres & vue grille/liste
   6 Modale · 7 Formulaire
   Les projets, sections et filtres viennent de js/projects-data.js
   ========================================================== */
(() => {
    'use strict';

    const { SECTIONS, FILTERS, FILTERED_PATTERN, SHOWREEL, PROJECTS } = window.PORTFOLIO;
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    /* ===== 1. OUTILS ===== */
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const pad = (n) => String(n).padStart(2, '0');
    const isUrl = (u) => /^https?:\/\//i.test(u || '');

    function ytId(raw) {
        if (!raw || typeof raw !== 'string') return null;
        const str = raw.trim();
        if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
        const m = str.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : null;
    }

    const FALLBACK_SECTION = { id: 'autre', title: 'Autres projets', meta: '', categories: [], pattern: [6, 6] };
    const sectionOf = (p) => SECTIONS.find((s) => s.categories.includes(p.category)) || FALLBACK_SECTION;

    /* ===== 2. GÉNÉRATION DES CARTES ET DES FILTRES ===== */
    const grid = $('#projects-grid');

    function dividerHTML(sec, isFirst) {
        return `
            <div class="grid-category-divider ${isFirst ? 'first-divider' : ''}">
                <div class="divider-title"><span class="divider-dot"></span><span>${esc(sec.title)}</span></div>
                <span class="divider-meta">${esc(sec.meta)}</span>
            </div>`;
    }

    function visualHTML(p, isCollection) {
        const gallery = p.type === 'gallery' && Array.isArray(p.media) ? p.media : [];
        const firstMedia = isCollection ? (p.videos[0] && p.videos[0].media) : (p.type === 'video' ? p.media : null);
        const id = ytId(firstMedia);
        const cover = p.cover || gallery[0] || '';
        const style = [
            p.coverPos && `object-position:${p.coverPos}`,
            p.coverStyle === 'logo' && `padding:${p.coverPad || '3rem 4rem'}`
        ].filter(Boolean).join(';');
        const styleAttr = style ? ` style="${style}"` : '';

        if (cover) {
            return `<img src="${esc(cover)}"${styleAttr} alt="${esc(p.title)}" loading="lazy" decoding="async">`;
        }
        if (id) {
            return `<img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg"${styleAttr} onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg';" alt="${esc(p.title)}" loading="lazy" decoding="async">`;
        }
        const status = p.upcoming ? '● POST-PROD' : (p.type === 'gallery' ? '● GALERIE RAW' : '● ARCHIVE READY');
        return `
            <div class="card-slate">
                <div class="card-slate-top"><span>SCN-${esc(p.id)}</span><span>${esc(p.aspect)}</span></div>
                <div class="card-slate-center">
                    <span class="card-slate-id">[ ${p.type === 'gallery' ? 'SÉRIE' : 'PRISE'} ${esc(p.id)} ]</span>
                    <div class="card-slate-name">${esc(p.title)}</div>
                </div>
                <div class="card-slate-bottom"><span>${status}</span><span>RK // STUDIO</span></div>
            </div>`;
    }

    function cardHTML(p, index, span) {
        const isCollection = p.type === 'video-collection' && Array.isArray(p.videos);
        const n = isCollection ? p.videos.length : 0;
        const pillLabel = isCollection ? `CHOISIR VIDÉO (${n})` : (p.type === 'gallery' ? 'OUVRIR SÉRIE' : 'VISIONNER HD');
        const footLabel = isCollection ? `Ouvrir les ${n} vidéos ↗` : (p.type === 'gallery' ? 'Voir série ↗' : 'Visionner ↗');
        const topRight = isCollection ? `${n} vidéos` : (p.upcoming ? 'Bientôt dispo' : '');

        return `
            <article class="project-card bento-span-${span}" role="button" tabindex="0" aria-label="Ouvrir : ${esc(p.title)}"
                style="--delay:${(index % 3) * 65}ms" data-id="${esc(p.id)}" data-category="${esc(p.category)}" data-default-span="bento-span-${span}">
                <div>
                    <div class="card-tech-bar">
                        <span><strong class="card-tech-index">${esc(p.id)}</strong> - ${esc(p.topLabel)}</span>
                        <span class="${p.upcoming ? 'card-tech-status' : ''}">${esc(topRight)}</span>
                    </div>
                    <div class="card-viewport ${p.coverStyle === 'logo' ? 'is-logo' : ''}">
                        <span class="vf-corner vf-tl"></span><span class="vf-corner vf-tr"></span>
                        <span class="vf-corner vf-bl"></span><span class="vf-corner vf-br"></span>
                        <span class="vf-action-pill">+ ${pillLabel} ↗</span>
                        ${visualHTML(p, isCollection)}
                    </div>
                    <div class="card-body">
                        <div class="card-header-row">
                            <h3 class="card-title">${esc(p.title)}</h3>
                            <span class="role-tag ${p.upcoming ? 'upcoming' : ''}">${esc(p.roleBadge)}</span>
                        </div>
                        <p class="card-desc">${esc(p.shortDesc)}</p>
                    </div>
                </div>
                <div class="card-footer">
                    
                    <span class="card-action">${footLabel}</span>
                </div>
            </article>`;
    }

    function buildGrid() {
        let html = '';
        let lastSection = null;
        const positions = {};
        PROJECTS.forEach((p, i) => {
            const sec = sectionOf(p);
            if (sec.id !== lastSection) {
                html += dividerHTML(sec, lastSection === null);
                lastSection = sec.id;
            }
            positions[sec.id] = (positions[sec.id] ?? -1) + 1;
            const span = p.span || sec.pattern[positions[sec.id] % sec.pattern.length];
            html += cardHTML(p, i, span);
        });
        grid.innerHTML = html;
    }

    function buildFilters() {
        const counts = { all: PROJECTS.length };
        PROJECTS.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
        $('#filters-bar').innerHTML = FILTERS
            .filter((f) => f.id === 'all' || counts[f.id])
            .map((f, i) => `
                <button type="button" data-filter="${esc(f.id)}" class="filter-btn ${i === 0 ? 'active' : ''}">
                    <span>${esc(f.label)}</span>
                    <span class="filter-count">[${pad(counts[f.id])}]</span>
                </button>`).join('');
    }

    buildGrid();
    buildFilters();

    const cards = $$('.project-card', grid);
    const dividers = $$('.grid-category-divider', grid);

    /* ===== 3. APPARITIONS AU SCROLL ===== */
    /* Le délai d'apparition (--delay) est retiré une fois l'animation finie, pour que le survol reste instantané */
    const clearDelayLater = (el) => setTimeout(() => el.style.removeProperty('--delay'), 1500);

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            clearDelayLater(entry.target);
            obs.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    $$('.js-reveal-up, .js-reveal-box, .js-line-reveal, .project-card').forEach((el) => revealObserver.observe(el));

    /* Lien actif dans le menu */
    const navLinks = $$('.nav-list .nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => link.classList.toggle('active-nav', link.getAttribute('href') === `#${id}`));
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    $$('main > section, main > footer').forEach((sec) => navObserver.observe(sec));

    /* ===== 4. SCROLL : barre de progression, timecode, parallaxe ===== */
    const progressBar = $('#scroll-progress');
    const siteHeader = $('#site-header');
    const timecodeEl = $('#header-timecode');
    const parallaxNodes = $$('[data-parallax]').map((el) => ({ el, speed: parseFloat(el.dataset.parallax) || 0 }));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const activeViewports = new Set();
    const viewportTracker = new IntersectionObserver((entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? activeViewports.add(entry.target) : activeViewports.delete(entry.target)));
    }, { rootMargin: '150px 0px 150px 0px' });
    $$('.card-viewport').forEach((vp) => viewportTracker.observe(vp));

    let ticking = false;
    function updateScrollEffects() {
        const scrollY = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

        progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
        siteHeader.classList.toggle('is-scrolled', scrollY > 40);

        if (timecodeEl) {
            const frames = Math.floor(progress * 2400);
            timecodeEl.textContent = `TC // 00:${pad(Math.floor(frames / 1440))}:${pad(Math.floor((frames % 1440) / 24))}:${pad(frames % 24)}`;
        }

        if (!prefersReducedMotion && window.innerWidth >= 768) {
            if (scrollY < window.innerHeight * 1.4) {
                parallaxNodes.forEach(({ el, speed }) => { el.style.transform = `translate3d(0, ${(scrollY * speed).toFixed(1)}px, 0)`; });
            }
            if (!grid.classList.contains('list-mode')) {
                const halfWin = window.innerHeight / 2;
                activeViewports.forEach((vp) => {
                    const rect = vp.getBoundingClientRect();
                    const shift = Math.max(-16, Math.min(16, ((rect.top + rect.height / 2) - halfWin) * -0.035));
                    vp.style.setProperty('--media-parallax', `${shift.toFixed(1)}px`);
                });
            }
        }
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(updateScrollEffects); ticking = true; }
    }, { passive: true });
    updateScrollEffects();

    /* ===== 5. FILTRES ET VUE GRILLE / LISTE ===== */
    const spanClasses = [12, 8, 7, 6, 5, 4].map((n) => `bento-span-${n}`);

    $('#filters-bar').addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const filter = btn.dataset.filter;
        $$('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
        dividers.forEach((d) => d.classList.toggle('is-hidden', filter !== 'all'));

        let visible = 0;
        cards.forEach((card) => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('is-hidden', !match);
            if (!match) return;

            card.classList.remove(...spanClasses);
            card.classList.add(filter === 'all' ? card.dataset.defaultSpan : `bento-span-${FILTERED_PATTERN[visible % FILTERED_PATTERN.length]}`);

            card.classList.remove('is-visible');
            card.style.setProperty('--delay', `${(visible % 4) * 50}ms`);
            void card.offsetWidth;
            card.classList.add('is-visible');
            clearDelayLater(card);
            visible++;
        });
    });

    const btnGrid = $('#btn-grid-view');
    const btnList = $('#btn-list-view');
    btnGrid.addEventListener('click', () => {
        grid.classList.remove('list-mode');
        btnGrid.classList.add('active');
        btnList.classList.remove('active');
        updateScrollEffects();
    });
    btnList.addEventListener('click', () => {
        grid.classList.add('list-mode');
        btnList.classList.add('active');
        btnGrid.classList.remove('active');
    });

    /* ===== 6. MODALE ===== */
    const modal = $('#project-modal');
    const closeBtn = $('#close-modal');
    const mediaBox = $('#modal-media');
    const modalTitle = $('#modal-title');
    const modalDesc = $('#modal-desc');
    const modalRole = $('#modal-role-box');
    const modalType = $('#modal-type-label');
    const modalTags = $('#modal-tags');
    const modalExt = $('#modal-ext-link');

    let lastFocused = null;
    let galleryStep = null; // fonction de navigation si une galerie est ouverte

    const placeholderHTML = (title, text) => `
        <div class="modal-placeholder">
            <p class="modal-placeholder-title">[ ${esc(title)} ]</p>
            <p>${esc(text)}</p>
        </div>`;

    function renderVideo(d) {
        const id = ytId(d.media);
        const isVertical = Boolean(d.isVertical || /\/shorts\//i.test(d.media || ''));
        modalType.textContent = d.status || (isVertical ? 'FORMAT VERTICAL 9:16 // SOCIAL MEDIA' : 'PRODUCTION AUDIOVISUELLE // HD');

        if (!id) {
            mediaBox.innerHTML = placeholderHTML(d.title || 'Bientôt disponible', 'Cette vidéo sera mise en ligne prochainement.');
            return;
        }
        const embed = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&vq=hd1080&hd=1`;
        const iframe = `<iframe class="${isVertical ? '' : 'video-frame'}" ${isVertical ? 'style="width:100%;height:100%;border:0;"' : ''} src="${embed}" title="${esc(d.title)}" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        mediaBox.innerHTML = isVertical
            ? `<div class="vertical-media-wrapper"><div class="vertical-phone-frame">${iframe}</div></div>`
            : iframe;
        modalExt.innerHTML = `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" class="modal-ext-btn"><span>Regarder en 1080p/4K sur YouTube ↗</span></a>`;
    }

    function renderCollection(d) {
        const vertical = Boolean(d.isVertical);
        modalType.textContent = `${pad(d.videos.length)} ${vertical ? 'REELS // FORMAT 9:16' : 'VIDÉOS // FORMAT 16:9'}`;
        const orient = vertical ? '' : 'is-landscape';

        const tiles = d.videos.map((v, idx) => {
            const id = ytId(v.media);
            const href = id ? `https://www.youtube.com/watch?v=${id}` : v.media;
            const link = Boolean(id) || isUrl(v.media);
            const thumb = v.cover || (id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : '');
            const onErr = id ? `onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg';"` : '';
            const inner = `
                ${thumb ? `<img src="${esc(thumb)}" ${onErr} alt="${esc(v.title)}" loading="lazy" decoding="async">` : `<span class="reel-tile-title">${esc(v.title)}<br>(bientôt disponible)</span>`}
                <span class="reel-tile-num">${pad(idx + 1)}</span>
                ${link ? `<span class="reel-tile-cta">${vertical ? 'Voir sur Instagram' : 'Voir sur YouTube'} ↗</span>` : ''}`;
            return link
                ? `<a class="reel-tile ${orient}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(v.title)}">${inner}</a>`
                : `<div class="reel-tile is-empty ${orient}">${inner}</div>`;
        }).join('');

        mediaBox.innerHTML = `<div class="reels-grid-wrapper"><div class="reels-grid ${orient}">${tiles}</div></div>`;
        if (d.instaAccountUrl) {
            modalExt.innerHTML = `<a href="${esc(d.instaAccountUrl)}" target="_blank" rel="noopener noreferrer" class="modal-ext-btn"><span>Compte de l'entreprise ↗</span></a>`;
        }
    }

    function renderGallery(d) {
        modalType.textContent = 'SÉRIE PHOTOGRAPHIQUE';
        const urls = Array.isArray(d.media) ? d.media : [];
        if (urls.length === 0) {
            mediaBox.innerHTML = placeholderHTML(d.title, 'Les photos de cette série arrivent bientôt.');
            return;
        }
        mediaBox.innerHTML = `
            <div class="gallery">
                <img id="gallery-img" class="gallery-img" src="${esc(urls[0])}" alt="${esc(d.title)}">
                ${urls.length > 1 ? `
                    <button type="button" id="prev-img" class="gallery-btn prev" aria-label="Photo précédente">←</button>
                    <button type="button" id="next-img" class="gallery-btn next" aria-label="Photo suivante">→</button>
                    <span id="gallery-counter" class="gallery-counter">1 / ${urls.length}</span>` : ''}
            </div>`;
        if (urls.length > 1) {
            let idx = 0;
            const img = $('#gallery-img');
            const counter = $('#gallery-counter');
            galleryStep = (dir) => {
                idx = (idx + dir + urls.length) % urls.length;
                img.src = urls[idx];
                counter.textContent = `${idx + 1} / ${urls.length}`;
            };
            $('#prev-img').onclick = () => galleryStep(-1);
            $('#next-img').onclick = () => galleryStep(1);
        }
    }

    function openModal(d) {
        currentId = d.id || null;
        galleryStep = null;
        modalTitle.textContent = d.modalTitle || d.title;
        modalDesc.innerHTML = d.fullDesc || '';
        modalRole.textContent = d.roleFull || '';
        modalRole.style.display = d.roleFull ? '' : 'none';
        modalTags.innerHTML = (d.tags || []).map((t) => `<span class="tech-tag">${esc(t)}</span>`).join('');
        modalExt.innerHTML = '';

        if (d.type === 'video-collection' && Array.isArray(d.videos) && d.videos.length) renderCollection(d);
        else if (d.type === 'gallery') renderGallery(d);
        else renderVideo(d);

        if (!modal.classList.contains('open')) lastFocused = document.activeElement;
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        closeBtn.focus();
        updateModalNav();
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        mediaBox.innerHTML = ''; // coupe aussi la lecture vidéo
        galleryStep = null;
        currentId = null;
        history.replaceState(null, '', location.pathname + location.search);
        if (lastFocused) lastFocused.focus();
    }

    /* Navigation entre projets dans la modale + lien direct (#projet-01) */
    let currentId = null;
    const navBox = $('#modal-nav');
    const visibleIds = () => cards.filter((c) => !c.classList.contains('is-hidden')).map((c) => c.dataset.id);
    function updateModalNav() {
        navBox.style.display = currentId && visibleIds().length > 1 ? '' : 'none';
        if (currentId) history.replaceState(null, '', `#projet-${currentId}`);
    }
    function stepProject(dir) {
        const ids = visibleIds();
        const i = ids.indexOf(currentId);
        if (i < 0 || ids.length < 2) return;
        const next = PROJECTS.find((p) => p.id === ids[(i + dir + ids.length) % ids.length]);
        if (next) openModal(next);
    }

    const openFromCard = (card) => {
        const project = PROJECTS.find((p) => p.id === card.dataset.id);
        if (project) openModal(project);
    };

    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card) openFromCard(card);
    });
    grid.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.project-card')) {
            e.preventDefault();
            openFromCard(e.target);
        }
    });

    $('#showreel-btn').addEventListener('click', () => openModal(SHOWREEL));
    $('#modal-prev').addEventListener('click', () => stepProject(-1));
    $('#modal-next').addEventListener('click', () => stepProject(1));

    /* Ouverture directe d'un projet via l'adresse (ex. monsite.fr/#projet-03) */
    const hashMatch = location.hash.match(/^#projet-(.+)$/);
    if (hashMatch) {
        const target = PROJECTS.find((p) => p.id === hashMatch[1]);
        if (target) { $('#projets').scrollIntoView(); openModal(target); }
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') { galleryStep ? galleryStep(-1) : stepProject(-1); }
        if (e.key === 'ArrowRight') { galleryStep ? galleryStep(1) : stepProject(1); }
    });

    /* ===== 7. MENU MOBILE ET VIDÉO DU HERO ===== */
    const menuBtn = $('#menu-toggle');
    const setMenu = (open) => {
        document.body.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    $$('#mobile-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 768) setMenu(false); });

    /* La vidéo n'est chargée que sur grand écran (la voûte est masquée sur mobile) et sans "réduction des animations" */
    const heroVideo = $('#hero-video');
    if (heroVideo && window.innerWidth >= 1024 && !prefersReducedMotion) {
        heroVideo.addEventListener('loadeddata', () => heroVideo.classList.add('is-ready'));
        heroVideo.src = heroVideo.dataset.src;
        heroVideo.play().catch(() => {});
    }

    /* ===== 8. FORMULAIRE ===== */
    /* Tant que l'identifiant Formspree n'est pas renseigné dans index.html, on évite un envoi dans le vide */
    const form = $('#contact-form');
    const formStatus = $('#form-status');
    form.addEventListener('submit', (e) => {
        if (form.action.includes('VOTRE_ID_FORMSPREE_ICI')) {
            e.preventDefault();
            formStatus.textContent = "Le formulaire n'est pas encore actif. Écris-moi directement par email, merci !";
        }
    });
})();