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
     * Can be any type - use renderItem to customize rendering
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
    const itemsRef = ref(props.items);
    const optionsRef = ref(props.options);
    const renderedItemsRef = ref(new Map());

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
        props.items,
        props.options
      );

      // Listen to change events
      containerRef.value.addEventListener('change', (e) => {
        emit('change', e.detail);
      });

      // Force re-render to show items
      renderedItemsRef.value = new Map();
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
          optionsRef.value = newOpts;
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
          itemsRef.value = newItems;
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
