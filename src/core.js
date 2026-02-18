/**
 * ParallaxCarousel - Core Logic (framework-free)
 */

export const DEFAULT_OPTIONS = {
  // Card dimensions per slot position (-2 to +2)
  slots: {
    '-2': { x: -490, w: 220, h: 330, ry:  50, origin: 'right center',  z: 1, op: 1 },
    '-1': { x: -255, w: 192, h: 295, ry:  26, origin: 'right center',  z: 2, op: 1 },
     '0': { x:    0, w: 188, h: 275, ry:   0, origin: 'center center', z: 3, op: 1 },
     '1': { x:  255, w: 192, h: 295, ry: -26, origin: 'left center',   z: 2, op: 1 },
     '2': { x:  490, w: 220, h: 330, ry: -50, origin: 'left center',   z: 1, op: 1 },
  },

  // Animation
  duration: 650,          // ms
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Autoplay
  autoplay: true,
  interval: 2800,         // ms
  pauseOnHover: true,

  // Style
  background: '#111111',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: '1.5px',
  borderRadius: '4px',
  stageHeight: '420px',
  perspective: 900,

  // Grid background
  showGrid: true,
  gridColor: 'rgba(255,255,255,0.032)',
  gridSize: '38px',
};

/**
 * @typedef {Object} RenderItemContext
 * @property {any} item - The item data
 * @property {number} index - Item index
 * @property {HTMLElement} container - Card container element
 */

export class ParallaxCarousel {
  /**
   * @param {string|HTMLElement} container
   * @param {any[]} items
   * @param {Object} options
   * @param {(ctx: RenderItemContext) => HTMLElement|string} [options.renderItem]
   */
  constructor(container, items = [], options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) throw new Error('[ParallaxCarousel] Container not found');

    this.items    = items;
    this.options  = this._mergeOptions(DEFAULT_OPTIONS, options);
    this.current  = 0;
    this.total    = items.length;
    this.isAnimating = false;
    this._autoTimer  = null;
    this._cardEls    = [];

    this._init();
  }

  // ─── Private ────────────────────────────────────────────────────

  _mergeOptions(defaults, overrides) {
    const merged = { ...defaults, ...overrides };
    if (overrides.slots) {
      merged.slots = { ...defaults.slots, ...overrides.slots };
    }
    return merged;
  }

  _init() {
    this._buildDOM();
    this._bindEvents();
    this._render(false);
    requestAnimationFrame(() => this._render(true));
    if (this.options.autoplay) this._startAuto();
  }

  _buildDOM() {
    const o = this.options;

    // Wrapper styles
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    // Grid bg
    if (o.showGrid) {
      this.container.style.backgroundImage = `
        linear-gradient(${o.gridColor} 1px, transparent 1px),
        linear-gradient(90deg, ${o.gridColor} 1px, transparent 1px)
      `;
      this.container.style.backgroundSize = `${o.gridSize} ${o.gridSize}`;
    }

    // Stage
    this._stage = document.createElement('div');
    this._stage.style.cssText = `
      position: relative;
      width: 100%;
      height: ${o.stageHeight};
    `;
    this.container.appendChild(this._stage);

    // Cards
    this._cardEls = this.items.map((item, i) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        pointer-events: none;
        opacity: 0;
      `;

      const card = document.createElement('div');
      card.style.cssText = `
        background: ${o.background};
        border: ${o.borderWidth} solid ${o.borderColor};
        border-radius: ${o.borderRadius};
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
      `;

      // Render item using renderItem callback or default behavior
      this._renderItem(card, item, i);

      wrap.appendChild(card);
      this._stage.appendChild(wrap);
      return { wrap, card };
    });
  }

  /**
   * Render a single item
   * @param {HTMLElement} container - Card container
   * @param {any} item - Item data
   * @param {number} index - Item index
   */
  _renderItem(container, item, index) {
    const { renderItem } = this.options;

    if (typeof renderItem === 'function') {
      // Use custom renderItem callback
      const result = renderItem({ item, index, container });
      
      if (result instanceof HTMLElement) {
        container.appendChild(result);
      } else if (typeof result === 'string') {
        container.innerHTML = result;
      }
      return;
    }

    // Default behavior
    if (typeof item === 'string') {
      container.innerHTML = item;
    } else if (item instanceof HTMLElement) {
      container.appendChild(item);
    } else if (item && typeof item.render === 'function') {
      container.appendChild(item.render());
    }
  }

  _bindEvents() {
    // Keyboard
    this._onKeydown = (e) => {
      if (e.key === 'ArrowRight') this.next();
      else if (e.key === 'ArrowLeft') this.prev();
    };
    document.addEventListener('keydown', this._onKeydown);

    // Touch / swipe
    let startX = 0;
    this._stage.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    this._stage.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) dx < 0 ? this.next() : this.prev();
    });

    // Pause on hover
    if (this.options.pauseOnHover) {
      this._stage.addEventListener('mouseenter', () => this._stopAuto());
      this._stage.addEventListener('mouseleave', () => {
        if (this.options.autoplay) this._startAuto();
      });
    }
  }

  _getIdx(offset) {
    return ((this.current + offset) % this.total + this.total) % this.total;
  }

  _applySlot(cardIndex, slotCfg, animate) {
    const { wrap, card } = this._cardEls[cardIndex];
    const o = this.options;
    const { x, w, h, ry, origin, z, op } = slotCfg;
    const transition = animate
      ? `width ${o.duration}ms ${o.easing}, height ${o.duration}ms ${o.easing}, margin ${o.duration}ms ${o.easing}, transform ${o.duration}ms ${o.easing}, opacity ${o.duration}ms ${o.easing}`
      : 'none';
    const cardTransition = animate ? `transform ${o.duration}ms ${o.easing}` : 'none';

    wrap.style.transition  = transition;
    card.style.transition  = cardTransition;
    wrap.style.width       = w + 'px';
    wrap.style.height      = h + 'px';
    wrap.style.marginLeft  = (-w / 2) + 'px';
    wrap.style.marginTop   = (-h / 2) + 'px';
    wrap.style.transform   = `translateX(${x}px)`;
    wrap.style.zIndex      = z;
    wrap.style.opacity     = op;
    wrap.style.pointerEvents = op > 0 ? 'auto' : 'none';
    card.style.transformOrigin = origin;
    card.style.transform   = `perspective(${o.perspective}px) rotateY(${ry}deg)`;
  }

  _getOffScreen(dir) {
    // dir: 'left' | 'right'
    return dir === 'left'
      ? { x: -700, w: 168, h: 255, ry:  50, origin: 'right center', z: 0, op: 0 }
      : { x:  700, w: 168, h: 255, ry: -50, origin: 'left center',  z: 0, op: 0 };
  }

  _render(animate = true) {
    const slots = this.options.slots;

    // Hide all
    this._cardEls.forEach(({ wrap }) => {
      wrap.style.opacity = '0';
      wrap.style.pointerEvents = 'none';
      wrap.onclick = null;
    });

    // Show 5 visible slots
    for (let pos = -2; pos <= 2; pos++) {
      const idx = this._getIdx(pos);
      this._applySlot(idx, slots[String(pos)], animate);

      const { wrap } = this._cardEls[idx];
      if (pos < 0) {
        wrap.style.cursor = 'pointer';
        wrap.onclick = () => { if (!this.isAnimating) this.prev(); };
      } else if (pos > 0) {
        wrap.style.cursor = 'pointer';
        wrap.onclick = () => { if (!this.isAnimating) this.next(); };
      } else {
        wrap.style.cursor = 'default';
        wrap.onclick = null;
      }
    }

    this._emitChange();
  }

  _emitChange() {
    const event = new CustomEvent('change', {
      detail: { index: this.current, total: this.total }
    });
    this.container.dispatchEvent(event);
  }

  _startAuto() {
    this._stopAuto();
    this._autoTimer = setInterval(() => this.next(), this.options.interval);
  }

  _stopAuto() {
    if (this._autoTimer) {
      clearInterval(this._autoTimer);
      this._autoTimer = null;
    }
  }

  // ─── Public API ─────────────────────────────────────────────────

  next() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Animate leaving card off-screen left
    const leavingIdx  = this._getIdx(-2);
    this._applySlot(leavingIdx, this._getOffScreen('left'), true);

    // Place entering card off-screen right instantly
    const enteringIdx = this._getIdx(3);
    this._applySlot(enteringIdx, this._getOffScreen('right'), false);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.current = (this.current + 1) % this.total;
      this._render(true);
      setTimeout(() => { this.isAnimating = false; }, this.options.duration + 30);
    }));
  }

  prev() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const leavingIdx  = this._getIdx(2);
    this._applySlot(leavingIdx, this._getOffScreen('right'), true);

    const enteringIdx = this._getIdx(-3);
    this._applySlot(enteringIdx, this._getOffScreen('left'), false);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.current = (this.current - 1 + this.total) % this.total;
      this._render(true);
      setTimeout(() => { this.isAnimating = false; }, this.options.duration + 30);
    }));
  }

  goTo(index) {
    if (index === this.current || this.isAnimating) return;
    this.current = ((index % this.total) + this.total) % this.total;
    this._render(true);
  }

  updateOptions(newOptions) {
    this.options = this._mergeOptions(this.options, newOptions);
    this._render(false);
    if (this.options.autoplay) this._startAuto();
    else this._stopAuto();
  }

  destroy() {
    this._stopAuto();
    document.removeEventListener('keydown', this._onKeydown);
    this.container.innerHTML = '';
  }
}
