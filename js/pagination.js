/* Estado de leitura. Cada volume tem sua própria sequência de páginas. */
(function (root) {
    'use strict';
    class BookPagination {
        constructor(total, perView = 2, volumes = [{ start: 0, count: total }]) {
            this.total = total;
            this.perView = perView;
            this.volumes = volumes;
            this.current = 0;
        }
        get volume() {
            return this.volumes.find(
                (volume) =>
                    this.current >= volume.start && this.current < volume.start + volume.count
            );
        }
        get visible() {
            const end = Math.min(
                this.current + this.perView,
                this.volume.start + this.volume.count
            );
            return Array.from({ length: end - this.current }, (_, i) => this.current + i);
        }
        get hasPrevious() {
            return this.current > 0;
        }
        get hasNext() {
            return this.visible.at(-1) < this.total - 1;
        }
        goTo(index) {
            const bounded = Math.max(0, Math.min(this.total - 1, index));
            const volume = this.volumes.find(
                (item) => bounded >= item.start && bounded < item.start + item.count
            );
            this.current =
                volume.start + Math.floor((bounded - volume.start) / this.perView) * this.perView;
        }
        next() {
            if (this.hasNext) this.goTo(this.visible.at(-1) + 1);
        }
        previous() {
            if (this.hasPrevious) this.goTo(this.current - 1);
        }
        resize(perView) {
            this.perView = perView;
            this.goTo(this.current);
        }
    }
    root.PortfolioBook = root.PortfolioBook || {};
    root.PortfolioBook.Pagination = BookPagination;
    if (typeof module !== 'undefined' && module.exports) module.exports = { BookPagination };
})(typeof window !== 'undefined' ? window : globalThis);
