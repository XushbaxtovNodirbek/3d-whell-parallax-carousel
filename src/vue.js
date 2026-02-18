import { defineComponent, ref, onMounted, onBeforeUnmount, watch, h } from 'vue';
import { ParallaxCarousel } from './core.js';

/**
 * Vue 3 wrapper for ParallaxCarousel
 *
 * @example
 * <ParallaxCarouselVue
 *   :items="['<div>Card 1</div>', '<div>Card 2</div>']"
 *   :options="{ autoplay: true, interval: 3000 }"
 *   @change="onSlideChange"
 * />
 */
export const ParallaxCarouselVue = defineComponent({
  name: 'ParallaxCarousel',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['change'],

  setup(props, { emit, expose }) {
    const containerRef = ref(null);
    let instance = null;

    onMounted(() => {
      instance = new ParallaxCarousel(
        containerRef.value,
        props.items,
        props.options
      );

      containerRef.value.addEventListener('change', (e) => {
        emit('change', e.detail);
      });
    });

    onBeforeUnmount(() => {
      instance?.destroy();
    });

    watch(
      () => props.options,
      (newOpts) => instance?.updateOptions(newOpts),
      { deep: true }
    );

    // Expose imperative API via template ref
    expose({
      next:    () => instance?.next(),
      prev:    () => instance?.prev(),
      goTo:    (i) => instance?.goTo(i),
      destroy: () => instance?.destroy(),
    });

    return () => h('div', {
      ref: containerRef,
      style: { width: '100%' },
    });
  },
});

export default ParallaxCarouselVue;
