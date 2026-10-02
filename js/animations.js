/* Apenas apresentação: abertura da capa e folha com frente e verso. */
(function (root) {
    'use strict';
    class BookAnimator {
        constructor(spread, mobile, reducedMotion) {
            this.spread = spread;
            this.mobile = mobile;
            this.reducedMotion = reducedMotion;
            this.isTurning = false;
            this.version = 0;
            this.animation = null;
            this.sheet = null;
            this.stationary = null;
        }
        cancel() {
            this.version += 1;
            this.finishOpening();
            this.animation?.cancel();
            this.sheet?.remove();
            this.stationary?.remove();
            this.animation = this.sheet = this.stationary = null;
            this.isTurning = false;
            this.spread.removeAttribute('aria-busy');
        }
        copyPage(page) {
            const copy = page.cloneNode(true);
            copy.hidden = false;
            copy.removeAttribute('id');
            copy.removeAttribute('tabindex');
            copy.removeAttribute('aria-labelledby');
            copy.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
            copy.inert = true;
            return copy;
        }
        async openCover(cover) {
            if (this.reducedMotion.matches || typeof cover.animate !== 'function') return;

            const animation = cover.animate(
                [
                    { transform: 'perspective(1400px) rotateY(0deg)', opacity: 1 },
                    {
                        transform: 'perspective(1400px) rotateY(-35deg)',
                        opacity: 1,
                        offset: 0.4,
                    },
                    { transform: 'perspective(1400px) rotateY(-105deg)', opacity: 0 },
                ],
                {
                    duration: 700,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    fill: 'forwards',
                }
            );

            this.coverAnimation = animation;
            try {
                await animation.finished;
            } catch {
                /* A leitura continua se a abertura for interrompida. */
            }
        }

        finishOpening() {
            this.coverAnimation?.cancel();
            this.coverAnimation = null;
        }

        async turn({ previousPages, nextPages, direction }) {
            if (this.reducedMotion.matches || typeof this.spread.animate !== 'function')
                return true;
            this.isTurning = true;
            const version = ++this.version;
            const source = this.copyPage(direction > 0 ? previousPages.at(-1) : previousPages[0]);
            const back = this.copyPage(direction > 0 ? nextPages[0] : nextPages.at(-1));
            this.spread.setAttribute('aria-busy', 'true');
            if (!this.mobile.matches) {
                this.stationary = document.createElement('div');
                this.stationary.className = `turn-stationary ${direction > 0 ? 'is-left' : 'is-right'}`;
                this.stationary.setAttribute('aria-hidden', 'true');
                this.stationary.inert = true;
                this.stationary.append(
                    this.copyPage(direction > 0 ? previousPages[0] : previousPages.at(-1))
                );
                this.spread.append(this.stationary);
            }
            this.sheet = document.createElement('div');
            this.sheet.className = `turn-sheet ${direction > 0 ? 'turn-forward' : 'turn-backward'}${this.mobile.matches ? ' turn-single' : ''}`;
            this.sheet.setAttribute('aria-hidden', 'true');
            this.sheet.inert = true;
            this.sheet.style.height = `${this.spread.getBoundingClientRect().height}px`;
            const front = document.createElement('div');
            const reverse = document.createElement('div');
            front.className = 'turn-face turn-front';
            reverse.className = 'turn-face turn-reverse';
            front.append(source);
            reverse.append(back);
            this.sheet.append(front, reverse);
            this.spread.append(this.sheet);
            this.animation = this.sheet.animate(
                [
                    { transform: 'rotateY(0deg)' },
                    {
                        transform: `rotateY(${-direction * 85}deg)`,
                        offset: 0.48,
                    },
                    {
                        transform: `rotateY(${-direction * 180}deg)`,
                    },
                ],
                {
                    duration: 850,
                    easing: 'cubic-bezier(.32,.05,.23,1)',
                    fill: 'forwards',
                }
            );
            try {
                await this.animation.finished;
            } catch {
                /* Fechar ou redimensionar cancela a folha. */
            }
            if (version !== this.version) return false;
            this.cancel();
            return true;
        }
    }
    root.PortfolioBook = root.PortfolioBook || {};
    root.PortfolioBook.Animator = BookAnimator;
})(typeof window !== 'undefined' ? window : globalThis);
