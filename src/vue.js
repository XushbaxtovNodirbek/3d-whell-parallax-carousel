import { defineComponent, ref, onMounted, onBeforeUnmount, watch, h, getCurrentInstance } from 'vue';
import { ParallaxCarousel } from './core.js';

/**
 * Vue 3 wrapper for ParallaxCarousel
 *
 * @example
 * ```vue
 * <template>
 *   <ParallaxCarouselVue
 *     :items="items"
 *     :options="{ autoplay: true, interval: 3000 }"
 *     @change="onSlideChange"
 *   />
 * </template>
 *
 * <script setup>
 * import { ParallaxCarouselVue } from '3d-whell-parallax-carousel/vue';
 *
 * const items = ['<div>Card 1</div>', '<div>Card 2</div>'];
 * const onSlideChange = ({ index, total }) => console.log(index, total);
 * </script>
 * ```
 */
export const ParallaxCarouselVue = defineComponent({
  name: 'ParallaxCarousel',

  props: {
    /**
     * Array of items to display in the carousel
     * Can be HTML strings, DOM elements, or objects with render() method
     */
    items: {
      type: Array,
      default: () => [],
    },
    /**
     * Carousel options
     */
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['change'],

  setup(props, { emit, expose }) {
    const containerRef = ref(null);
    let instance = null;
    const internalInstance = getCurrentInstance();

    /**
     * Resolve items to renderable content
     */
    const resolveItems = () => {
      return props.items.map(item => {
        if (typeof item === 'string') return item;
        if (item instanceof HTMLElement) return item;
        if (item && typeof item.render === 'function') return item.render();
        // Handle Vue VNodes
        if (item && typeof item === 'object' && item.__v_isVNode) {
          const container = document.createElement('div');
          // Vue 3 VNodes need to be mounted
          // For simplicity, we convert to string representation
          return `<div data-vue-component="true">${String(item.type || 'component')}</div>`;
        }
        return String(item);
      });
    };

    /**
     * Initialize the carousel
     */
    const initCarousel = () => {
      if (!containerRef.value) return;

      // Destroy existing instance
      if (instance) {
        instance.destroy();
      }

      instance = new ParallaxCarousel(
        containerRef.value,
        resolveItems(),
        props.options
      );

      // Listen to change events
      containerRef.value.addEventListener('change', (e) => {
        emit('change', e.detail);
      });
    };

    onMounted(() => {
      initCarousel();
    });

    onBeforeUnmount(() => {
      if (instance) {
        instance.destroy();
        instance = null;
      }
    });

    /**
     * Watch for options changes (deep)
     */
    watch(
      () => props.options,
      (newOpts) => {
        if (instance) {
          instance.updateOptions(newOpts);
        }
      },
      { deep: true }
    );

    /**
     * Watch for items changes - recreate carousel
     */
    watch(
      () => props.items,
      (newItems, oldItems) => {
        if (!instance || !containerRef.value) return;

        // Check if items actually changed
        const itemsChanged = !oldItems ||
          newItems.length !== oldItems.length ||
          newItems.some((item, i) => item !== oldItems[i]);

        if (itemsChanged) {
          // Destroy and recreate with new items
          instance.destroy();
          initCarousel();
        }
      },
      { deep: true }
    );

    // Expose imperative API via template ref
    expose({
      /**
       * Go to next slide
       */
      next: () => instance?.next(),
      /**
       * Go to previous slide
       */
      prev: () => instance?.prev(),
      /**
       * Go to specific slide index
       * @param {number} index - Slide index
       */
      goTo: (index) => instance?.goTo(index),
      /**
       * Update carousel options
       * @param {object} newOptions - New options to merge
       */
      updateOptions: (newOptions) => instance?.updateOptions(newOptions),
      /**
       * Destroy the carousel instance
       */
      destroy: () => {
        if (instance) {
          instance.destroy();
          instance = null;
        }
      },
      /**
       * Get current slide index
       * @returns {number} Current index
       */
      getCurrentIndex: () => instance?.current ?? 0,
      /**
       * Get total number of items
       * @returns {number} Total items
       */
      getTotal: () => instance?.total ?? 0,
    });

    return () => h('div', {
      ref: containerRef,
      style: { width: '100%' },
    });
  },
});

export default ParallaxCarouselVue;
