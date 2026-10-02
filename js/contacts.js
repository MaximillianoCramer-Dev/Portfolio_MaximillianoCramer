/* Montagem dos canais de contato a partir da configuração local. */
(function (root) {
    'use strict';

    function buildContactLinks(config = {}) {
        const links = [];
        const phone = String(config.whatsapp || '').replace(/\D/g, '');
        const email = String(config.email || '').trim();

        if (/^\d{10,15}$/.test(phone)) {
            links.push({ label: 'WhatsApp', href: `https://wa.me/${phone}`, external: true });
        }
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            links.push({ label: 'E-mail', href: `mailto:${email}`, external: false });
        }
        for (const [key, label] of [
            ['linkedin', 'LinkedIn'],
            ['github', 'GitHub'],
        ]) {
            const value = String(config[key] || '').trim();
            if (!value) continue;
            try {
                const url = new URL(value);
                if (url.protocol === 'https:') {
                    links.push({ label, href: url.href, external: true });
                }
            } catch {
                // Um endereço incompleto não produz um link no site.
            }
        }
        return links;
    }

    root.PortfolioBook = root.PortfolioBook || {};
    root.PortfolioBook.buildContactLinks = buildContactLinks;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { buildContactLinks };
    }
    if (typeof document === 'undefined') return;

    const container = document.querySelector('#contact-links');
    if (!container) return;
    const links = buildContactLinks(root.PortfolioBook.contacts);
    links.forEach(({ label, href, external }) => {
        const link = document.createElement('a');
        link.className = 'contact-link';
        link.textContent = label;
        link.href = href;
        if (external) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', `${label} — abre em nova aba`);
        }
        container.append(link);
    });
    container.hidden = links.length === 0;
})(typeof window !== 'undefined' ? window : globalThis);
