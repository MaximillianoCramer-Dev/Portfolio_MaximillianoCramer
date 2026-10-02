/* Inicialização, controles, foco e sincronização dos volumes. */
(function () {
    'use strict';
    const $ = (selector) => document.querySelector(selector);
    const cover = $('#cover');
    const reader = $('#reader');
    const pages = Array.from(document.querySelectorAll('.page'));
    const collection = $('.book-collection');
    const openButtons = Array.from(document.querySelectorAll('[data-open-volume]'));
    let lastOpenedButton = openButtons[0];
    const previousButton = $('#previous-page');
    const nextButton = $('#next-page');
    const dialog = $('#index-dialog');
    const volumeButtons = Array.from(document.querySelectorAll('[data-volume-start]'));
    const mobile = window.matchMedia('(max-width: 859px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionButton = $('#motion-toggle');
    let savedMotion = null;

    try {
        savedMotion = localStorage.getItem('portfolio-motion');
    } catch {
        /* A preferência continua funcionando sem armazenamento. */
    }

    let motionEnabled = savedMotion === 'on' || (savedMotion !== 'off' && !reducedMotion.matches);
    const motionPreference = {
        get matches() {
            return !motionEnabled;
        },
    };

    function syncMotion() {
        document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
        motionButton.setAttribute('aria-pressed', String(motionEnabled));
        motionButton.textContent = motionEnabled ? 'Pausar animações' : 'Ativar animações';
    }

    syncMotion();
    motionButton.hidden = false;
    motionButton.addEventListener('click', () => {
        motionEnabled = !motionEnabled;
        savedMotion = motionEnabled ? 'on' : 'off';
        syncMotion();
        animator.cancel();
        render();

        try {
            localStorage.setItem('portfolio-motion', savedMotion);
        } catch {
            /* Não impede a interação em navegadores com armazenamento bloqueado. */
        }
    });
    const volumes = [];
    pages.forEach((page, index) => {
        const last = volumes.at(-1);
        if (last?.id === page.dataset.volume) last.count += 1;
        else
            volumes.push({
                id: page.dataset.volume,
                label: page.dataset.volumeLabel || `Volume ${page.dataset.volume}`,
                start: index,
                count: 1,
            });
    });
    const book = new window.PortfolioBook.Pagination(pages.length, mobile.matches ? 1 : 2, volumes);
    const animator = new window.PortfolioBook.Animator($('#book-spread'), mobile, motionPreference);
    let opened = false;
    let opening = false;

    function render({ focus = false } = {}) {
        pages.forEach((page, index) => {
            page.hidden = !book.visible.includes(index);
        });
                const blankPage = $('#blank-page-invitation');
        const stampText = blankPage.querySelector('.story-stamp p');
        const isMyStory = book.volume.id === '1';

        blankPage.hidden = book.visible.length !== 1 || mobile.matches;
        blankPage.setAttribute(
            'aria-label',
            isMyStory ? 'Continuação da minha história' : 'Convite para um próximo projeto'
        );

        const lines = isMyStory
            ? [
                'Toda história tem um começo.',
                'A minha continua',
                'nas próximas páginas.',
            ]
            : [
                'Sua história',
                'pode fazer parte',
                'destas páginas.',
            ];

        stampText.replaceChildren();

        lines.forEach((line, index) => {
            if (index > 0) {
                stampText.append(document.createElement('br'));
            }

            stampText.append(document.createTextNode(line));
        });
        previousButton.disabled = animator.isTurning || !book.hasPrevious;
        const atVolumeEnd = book.visible.at(-1) === book.volume.start + book.volume.count - 1;
        const volumeIndex = volumes.indexOf(book.volume);
        nextButton.disabled = animator.isTurning;
        nextButton.textContent = atVolumeEnd
            ? volumeIndex < volumes.length - 1
                ? 'Próximo volume'
                : 'Voltar à coleção'
            : 'Próxima página';
        previousButton.textContent =
            book.current === book.volume.start && book.hasPrevious
                ? 'Volume anterior'
                : 'Página anterior';
        const volumeButton = openButtons.find(
            (button) => button.dataset.openVolume === book.volume.id
        );
        if (volumeButton) lastOpenedButton = volumeButton;
        const first = book.current - book.volume.start + 1;
        const last = book.visible.at(-1) - book.volume.start + 1;
        const volumeName = book.volume.label;
        $('#page-status').textContent =
            `${volumeName} · ${first === last ? `Página ${first}` : `Páginas ${first}–${last}`} de ${book.volume.count}`;
        volumeButtons.forEach((button) => {
            button.setAttribute(
                'aria-pressed',
                String(Number(button.dataset.volumeStart) === book.volume.start)
            );
        });
        if (focus) pages[book.current].focus({ preventScroll: true });
    }

    async function changePage(target) {
        if (!opened || animator.isTurning) return;
        const previous = book.current;
        const previousPages = book.visible.map((index) => pages[index]);
        book.goTo(target);
        if (book.current === previous) {
            render({ focus: true });
            return;
        }
        const nextPages = book.visible.map((index) => pages[index]);
        render();
        const finished = animator.turn({
            previousPages,
            nextPages,
            direction: book.current > previous ? 1 : -1,
        });
        render();
        if ((await finished) && opened) render({ focus: true });
    }

    async function openBook(volumeId, button) {
        if (opening || opened) return;

        const volume = volumes.find((item) => item.id === volumeId);
        const selectedCover = button.closest('.collection-book');

        if (!volume || !selectedCover) return;

        opening = true;
        lastOpenedButton = button;

        openButtons.forEach((item) => {
            item.disabled = true;
        });

        book.goTo(volume.start);
        selectedCover.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        selectedCover.classList.add('is-selected');
        collection.classList.add('is-opening');
        collection.setAttribute('aria-busy', 'true');

        try {
            await animator.openCover(selectedCover);

            cover.hidden = true;
            reader.hidden = false;
            opened = true;

            render({ focus: true });
            reader.scrollIntoView({ block: 'start', behavior: 'instant' });
        } finally {
            animator.finishOpening();
            opening = false;
            selectedCover.classList.remove('is-selected');
            collection.classList.remove('is-opening');
            collection.removeAttribute('aria-busy');

            openButtons.forEach((item) => {
                item.disabled = false;
            });
        }
    }

    function closeBook() {
        animator.cancel();
        reader.hidden = true;
        cover.hidden = false;
        opened = false;
        lastOpenedButton.focus({ preventScroll: true });
        cover.scrollIntoView({ block: 'start', behavior: 'instant' });
    }

    function turn(direction) {
        if (!opened || animator.isTurning) return;
        if (direction > 0) {
            if (book.hasNext) changePage(book.visible.at(-1) + 1);
            else closeBook();
        }
        if (direction < 0 && book.hasPrevious) changePage(book.current - 1);
    }

    openButtons.forEach((button) => {
        button.addEventListener('click', () => {
            openBook(button.dataset.openVolume, button);
        });
    });
    collection.querySelectorAll('.collection-book').forEach((bookCover) => {
        bookCover.addEventListener('click', (event) => {
            if (event.target.closest('button, a')) return;
            const button = bookCover.querySelector('[data-open-volume]');
            openBook(button.dataset.openVolume, button);
        });
    });
    $('#close-book').addEventListener('click', closeBook);
    previousButton.addEventListener('click', () => turn(-1));
    nextButton.addEventListener('click', () => turn(1));
    volumeButtons.forEach((button) =>
        button.addEventListener('click', () => {
            if (animator.isTurning) animator.cancel();
            changePage(Number(button.dataset.volumeStart));
        })
    );
    $('#open-index').addEventListener('click', () => {
        if (animator.isTurning) {
            animator.cancel();
            render();
        }
        dialog.showModal();
    });
    $('#close-index').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('[data-go-page]').forEach((button) =>
        button.addEventListener('click', () => {
            dialog.close();
            changePage(Number(button.dataset.goPage));
        })
    );
    dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        )
            dialog.close();
    });
    document.addEventListener('keydown', (event) => {
        if (!opened || dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            turn(event.key === 'ArrowRight' ? 1 : -1);
        }
    });
    window.addEventListener('resize', () => {
        if (animator.isTurning) {
            animator.cancel();
            render();
        }
    });
    reducedMotion.addEventListener('change', () => {
        if (savedMotion === 'on' || savedMotion === 'off') return;
        motionEnabled = !reducedMotion.matches;
        syncMotion();
        animator.cancel();
        render();
    });
    mobile.addEventListener('change', () => {
        animator.cancel();
        book.resize(mobile.matches ? 1 : 2);
        render();
    });

    // Sem JavaScript, os artigos permanecem acessíveis no documento.
    reader.hidden = true;
    openButtons.forEach((button) => {
        button.hidden = false;
    });

    ['#reader-toolbar', '#reader-controls', '#reader-help'].forEach((selector) => {
        $(selector).hidden = false;
    });
    $('#year').textContent = new Date().getFullYear();
    render();
})();
